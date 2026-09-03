# MedGid Moldova

Catalogul clinicilor și spitalelor private din Republica Moldova: căutare după oraș
și specialitate, prețuri orientative, program de lucru, recenzii și programări online.

Proiect de practică. Structura repozitoriului urmează modelul din
[finance-tracker](https://github.com/nikkjke/finance-tracker): frontend-ul stă în
`frontend/`, iar proiectele de backend vor fi adăugate ca directoare surori.

## Stack

| Strat    | Tehnologii                                                     |
| -------- | -------------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7    |
| Icons    | lucide-react                                                    |
| Animații | framer-motion                                                   |
| HTTP     | axios                                                           |
| Backend  | _urmează_ (ASP.NET Core, după modelul din finance-tracker)      |

## Rulare

```bash
cd frontend
npm install
npm run dev      # server de dezvoltare
npm run build    # tsc -b && vite build
npm run lint     # eslint
```

## Conturi demo

Cât timp `VITE_USE_MOCK_DATA=true`, conturile sunt ținute în `localStorage` și sunt
create automat la prima autentificare. Sunt afișate și pe pagina de login:

| E-mail | Parolă | Rol |
| --- | --- | --- |
| `pacient@medgid.md` | `pacient123` | patient |
| `admin@medgid.md` | `admin123` | admin |

Înregistrarea creează conturi noi tot local (rol `patient`). Pentru a reveni la
starea inițială, șterge cheile `users`, `currentUser`, `jwt_token` și
`appointments` din `localStorage` (DevTools → Application → Local Storage).

> Parolele sunt trecute prin SHA-256 înainte de a fi salvate, ca să nu stea în
> clar pe disc — dar aceasta **nu** este securitate reală: hash-ul se calculează
> în browser. Hashing-ul propriu-zis (bcrypt/Argon2, cu salt, pe server) vine
> odată cu backend-ul.

## Variabile de mediu

Copiază `frontend/.env.example` în `frontend/.env` și ajustează:

| Variabilă             | Implicit                | Descriere                                                   |
| --------------------- | ----------------------- | ----------------------------------------------------------- |
| `VITE_API_BASE_URL`   | `http://localhost:5200` | Adresa API-ului                                              |
| `VITE_USE_MOCK_DATA`  | `true`                  | Cât timp e `true`, serviciile citesc din `src/data/mockData` |

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
- [ ] Backend

> Datele afișate sunt parțial demonstrative. Denumirile, adresele, telefoanele și
> site-urile clinicilor provin de pe paginile lor oficiale; ratingurile, numărul de
> recenzii, prețurile, medicii și recenziile sunt inventate pentru demonstrație.
> Logourile din `src/assets/logos/` aparțin clinicilor respective și sunt folosite
> doar pentru a le identifica în catalog.
