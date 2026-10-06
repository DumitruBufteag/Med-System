# MedGid Moldova

Catalogul clinicilor și spitalelor private din Republica Moldova: căutare după oraș
și specialitate, prețuri orientative, program de lucru, recenzii și programări online.

Proiect de practică. Structura repozitoriului urmează modelul din
[finance-tracker](https://github.com/nikkjke/finance-tracker): frontend-ul stă în
`frontend/`, iar proiectele de backend sunt directoare surori, grupate în
soluția `MedGid.sln`.

## Stack

| Strat    | Tehnologii                                                     |
| -------- | -------------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7    |
| Icons    | lucide-react                                                    |
| Animații | framer-motion                                                   |
| HTTP     | axios                                                           |
| Backend  | ASP.NET Core 8 (Web API), EF Core 8, Npgsql                     |
| Bază de date | PostgreSQL 16 (docker-compose)                              |
| Auth     | JWT Bearer, parole hash-uite cu BCrypt                          |

## Rulare

Sunt trei lucruri de pornit, în ordinea asta.

**1. Baza de date**

```bash
cp .env.example .env     # o singură dată, apoi pune-ți propria parolă
docker compose up -d     # PostgreSQL pe localhost:5433
```

> Portul gazdă este `5433`, nu cel implicit `5432`, pentru că acesta din urmă era
> deja ocupat de alt proiect. Dacă la tine e liber, schimbă `POSTGRES_PORT` din
> `.env` și portul din connection string (pasul următor).

**2. Secretele API-ului**

Nici connection string-ul, nici cheia JWT nu stau în fișiere urmărite de git.
În dezvoltare le ții în **User Secrets**, adică într-un fișier din profilul tău de
utilizator, în afara repozitoriului. Se setează o singură dată:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" \
  "Host=localhost;Port=5433;Database=medgid;Username=postgres;Password=<parola din .env>" \
  --project MedGid.API

dotnet user-secrets set "Jwt:Key" "<minim 32 de caractere>" --project MedGid.API
```

Verifici cu `dotnet user-secrets list --project MedGid.API`. Dacă lipsesc, API-ul
refuză să pornească și îți scrie în consolă exact comanda de mai sus.

În producție nu folosești User Secrets, ci variabile de mediu — ASP.NET Core le
citește din același `IConfiguration`, deci codul rămâne neschimbat:

```
ConnectionStrings__DefaultConnection=...
Jwt__Key=...
```

**3. API-ul**

```bash
dotnet run --project MedGid.API
```

Pornește pe `http://localhost:5200`. La prima rulare aplică migrările și
populează baza cu catalogul demonstrativ (aceleași clinici care erau în
`mockData.ts`). Swagger UI se deschide chiar în rădăcină: <http://localhost:5200>.

**4. Frontend-ul**

```bash
cd frontend
npm install
npm run dev      # server de dezvoltare
npm run build    # tsc -b && vite build
npm run lint     # eslint
```

## Variabile de mediu

Rădăcina repozitoriului are un `.env` **ignorat de git**, cu datele de conectare la
baza de date (`.env.example` arată forma). Docker compose îl citește singur la
`docker compose up`. Nimic din el nu ajunge pe GitHub.

`frontend/.env` este, dimpotrivă, commit-uit intenționat: conține doar un URL de
localhost și un flag, niciun secret, iar astfel proiectul merge imediat după clone.

| Variabilă             | Implicit                | Descriere                                                   |
| --------------------- | ----------------------- | ----------------------------------------------------------- |
| `VITE_API_BASE_URL`   | `http://localhost:5200` | Adresa API-ului                                              |
| `VITE_USE_MOCK_DATA`  | `false`                 | Pe `true`, serviciile citesc din `src/data/mockData` în loc de API |

Ambele moduri sunt păstrate intenționat: interfața poate fi arătată și fără
backend pornit, iar serviciile au exact aceleași semnături în ambele cazuri.

## Structura backend-ului

Trei straturi cerute (`API`, `BusinessLayer`, `Domain`) plus `DataAccess`,
exact ca în finance-tracker. Referințele merg într-un singur sens:
`API → BusinessLayer → DataAccess → Domain`.

```
MedGid.sln
├── MedGid.Domain/              # fără dependențe
│   ├── Entities/               # UserData, ClinicData, DoctorData, ... (ce se salvează)
│   ├── Models/                 # DTO-urile (ce circulă prin HTTP), grupate pe domeniu
│   └── Exceptions/             # BusinessRuleException (poartă propriul status code)
├── MedGid.DataAccess/
│   ├── Context/MedGidDbContext.cs
│   ├── DbSession.cs            # connection string-ul, setat o dată de API
│   ├── Migrations/
│   └── Seed/DatabaseSeeder.cs  # catalogul demonstrativ, doar în tabele goale
├── MedGid.BusinessLayer/
│   ├── BusinessLogic.cs        # fabrica: singura poartă spre stratul de business
│   ├── Interfaces/             # IClinicAction, IAuthAction, ...
│   ├── Core/                   # logica propriu-zisă (metode ...ActionExecution)
│   └── Structure/              # leagă Core de Interfaces
└── MedGid.API/
    ├── Controllers/            # 7 controllere + o bază comună
    ├── Middleware/             # traduce excepțiile în { status, message }
    └── Program.cs              # CORS, JWT, Swagger, migrare la pornire
```

### Endpoint-uri

Rutele sunt cele pe care serviciile din frontend le apelau deja.

| Metodă | Rută | Acces |
| --- | --- | --- |
| POST | `/api/auth/login`, `/api/auth/register` | public |
| GET | `/api/clinics/getAll`, `getFeatured`, `getBySlug/{slug}`, `getById/{id}` | public |
| POST/PUT/DELETE | `/api/clinics/create`, `update/{id}`, `delete/{id}` | admin |
| GET | `/api/doctors/getAll`, `getByClinic/{slug}`, `getById/{id}` | public |
| POST/PUT/DELETE | `/api/doctors/create`, `update/{id}`, `delete/{id}` | admin |
| GET | `/api/specialties/getAll`, `/api/reviews/getByClinic/{slug}` | public |
| GET | `/api/appointments/getTakenSlots` | public |
| GET | `/api/appointments/getByPatient/{id}` | propriul cont sau admin |
| GET | `/api/appointments/getAll` | admin |
| POST/PUT | `/api/appointments/create`, `cancel/{id}` | autentificat |
| GET/DELETE | `/api/users/getAll`, `delete/{id}` | admin |
| PUT | `/api/users/updateProfile/{id}`, `changePassword/{id}` | propriul cont |

Codurile de status sunt cele așteptate: `200`/`201`/`204` la succes, `400` la
validare, `401` fără token, `403` fără rol, `404` inexistent, `409` la conflict
(e-mail deja folosit, interval deja rezervat, medic cu programări active).
Orice eroare are același corp — `{ "status": 409, "message": "..." }` — ca
interceptorul de axios să-l poată citi uniform.

## Structura frontend-ului

```
frontend/src/
├── components/
│   ├── ErrorBoundary.tsx      # prinde erorile de randare
│   ├── layout/                # Navbar, Footer, PublicLayout, ScrollToTop
│   └── ui/                    # componente reutilizabile (ClinicCard, SearchBar, ...)
├── contexts/                  # Axios, Theme, Auth, Language, Clinic
├── data/mockData.ts           # date demonstrative până la conectarea API-ului
├── hooks/                     # useLocalStorage, useDebounce (+ barrel index.ts)
├── i18n/                      # traduceri ro / en
├── lib/                       # cn(), formatări, variante de animație
├── pages/                     # HomePage + pages/errors
├── services/                  # httpClient, mappers, servicii pe domeniu (+ barrel)
└── types/                     # tipuri de domeniu, DTO-uri, STORAGE_KEYS
```

Convenții păstrate din finance-tracker:

- fiecare serviciu întoarce `ServiceResponse<T>` (`{ success, data?, error? }`);
- `services/index.ts` și `hooks/index.ts` sunt barrel-uri pentru importuri scurte;
- fiecare context exportă provider-ul împreună cu hook-ul aferent (`useAuth`, `useClinics`),
  iar hook-ul aruncă eroare dacă e folosit în afara provider-ului;
- alias `@/` către `src/`;
- tipurile de domeniu, DTO-urile și cheile de `localStorage` stau centralizat în `types/index.ts`.

## Stadiu

- [x] Pagina principală (hero + căutare, specialități, clinici recomandate, cum funcționează, recenzii, CTA)
- [x] Listarea clinicilor cu filtre (`/clinici`) — filtre în URL, sortare, paginare
- [x] Pagina de detalii a unei clinici (`/clinici/:slug`)
- [x] Autentificare și înregistrare (`/login`, `/register`) — conturi în `localStorage`
- [x] Profil editabil (`/profil`) — date personale și schimbarea parolei
- [x] Programări (`/programare`) și „Programările mele" (`/programarile-mele`) — rute
      protejate, programările în `localStorage`
- [x] Backend: soluție .NET în 4 proiecte, PostgreSQL, JWT, Swagger, CORS
- [x] Frontend conectat la API prin axios provider cu interceptoare de request și response
- [x] Secretele scoase din fișierele urmărite de git (User Secrets / variabile de mediu)

> Datele afișate sunt parțial demonstrative. Denumirile, adresele, telefoanele și
> site-urile clinicilor provin de pe paginile lor oficiale; ratingurile, numărul de
> recenzii, prețurile, medicii și recenziile sunt inventate pentru demonstrație.
> Logourile din `src/assets/logos/` aparțin clinicilor respective și sunt folosite
> doar pentru a le identifica în catalog.
