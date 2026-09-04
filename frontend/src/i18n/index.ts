import { STORAGE_KEYS } from '../types';

export const translations = {
  ro: {
    // Navbar
    clinics: 'Clinici',
    specialties: 'Specialități',
    howItWorks: 'Cum funcționează',
    contact: 'Contact',
    login: 'Autentificare',
    bookAppointment: 'Programează-te',

    // Hero
    heroBadge: 'Clinici verificate din Republica Moldova',
    heroTitle: 'Găsește clinica potrivită',
    heroTitleAccent: 'și programează-te în câteva minute',
    heroSubtitle:
      'Un singur loc pentru toate spitalele și centrele medicale private din Moldova: specialități, prețuri orientative, program de lucru și recenzii reale ale pacienților.',
    searchPlaceholder: 'Clinică, specialitate sau serviciu',
    searchCity: 'Oraș',
    searchButton: 'Caută',
    allCities: 'Toate orașele',
    popularSearches: 'Căutări frecvente:',

    // Sections
    specialtiesTitle: 'Caută după domeniul de care ai nevoie',
    specialtiesSubtitle:
      'Peste 35 de specialități medicale disponibile în clinicile private din țară.',
    viewAllSpecialties: 'Vezi toate specialitățile',
    featuredTitle: 'Cele mai bine apreciate clinici din Moldova',
    featuredSubtitle:
      'Selectate după recenziile pacienților, transparența prețurilor și disponibilitatea programărilor online.',
    viewAllClinics: 'Vezi toate clinicile',
    reviewsTitle: 'Ce spun pacienții',

    // Clinic card
    consultationFrom: 'Consultație de la',
    viewDetails: 'Vezi detalii',
    openNow: 'Deschis acum',
    closed: 'Închis',
    emergency: 'Urgențe 24/7',
    doctors: 'medici',

    // States
    loading: 'Se încarcă...',
    emptyTitle: 'Nicio clinică găsită',
    emptyDescription: 'Încearcă alt filtru sau alt oraș.',
    errorTitle: 'Ceva nu a mers bine',
    retry: 'Încearcă din nou',

    // Footer
    footerTagline:
      'Catalogul clinicilor și spitalelor private din Republica Moldova. Informații actualizate și programări online, într-un singur loc.',
    forPatients: 'Pacienți',
    forClinics: 'Clinici',
    about: 'Despre',
    disclaimer:
      'Datele afișate sunt demonstrative și nu reprezintă oferte oficiale ale clinicilor.',

    // Clinics listing
    clinicsPageTitle: 'Clinici private din Moldova',
    clinicsPageSubtitle:
      'Filtrează după oraș, specialitate, preț sau program și compară clinicile într-un singur loc.',
    filters: 'Filtre',
    showFilters: 'Arată filtrele',
    hideFilters: 'Ascunde filtrele',
    resetFilters: 'Resetează',
    clinicType: 'Tip instituție',
    allTypes: 'Toate tipurile',
    specialty: 'Specialitate',
    allSpecialties: 'Toate specialitățile',
    city: 'Oraș',
    minRating: 'Rating minim',
    anyRating: 'Orice rating',
    maxPrice: 'Preț maxim consultație',
    onlyOpenNow: 'Doar deschise acum',
    onlyEmergency: 'Doar cu urgențe 24/7',
    sortBy: 'Sortează după',
    sortRating: 'Rating (descrescător)',
    sortPriceAsc: 'Preț (crescător)',
    sortPriceDesc: 'Preț (descrescător)',
    sortName: 'Nume (A–Z)',
    resultsFound: 'clinici găsite',
    oneResultFound: 'clinică găsită',
    clearAll: 'Șterge toate filtrele',
    previous: 'Anterior',
    next: 'Următor',

    // Clinic details
    backToClinics: 'Înapoi la clinici',
    aboutClinic: 'Despre clinică',
    servicesOffered: 'Specialități și servicii',
    medicalTeam: 'Echipa medicală',
    reviews: 'Recenzii',
    noDoctors: 'Echipa medicală nu este încă publicată pentru această clinică.',
    noReviews: 'Această clinică nu are încă recenzii.',
    yearsExperience: 'ani experiență',
    contactDetails: 'Date de contact',
    address: 'Adresă',
    phone: 'Telefon',
    website: 'Site web',
    schedule: 'Program',
    insurance: 'Asigurare medicală',
    insuranceAccepted: 'Acceptă asigurare medicală',
    insuranceNotAccepted: 'Nu acceptă asigurare medicală',
    openInMaps: 'Vezi pe hartă',
    callClinic: 'Sună clinica',
    clinicNotFound: 'Clinica nu a fost găsită',
    clinicNotFoundText: 'Este posibil ca adresa să fie greșită sau clinica să fi fost eliminată din catalog.',

    // Auth
    loginTitle: 'Bine ai revenit',
    loginSubtitle: 'Autentifică-te ca să îți vezi programările și clinicile salvate.',
    registerTitle: 'Creează un cont',
    registerSubtitle: 'Îți trebuie mai puțin de un minut. Programările rămân într-un singur loc.',
    fullName: 'Nume și prenume',
    email: 'E-mail',
    phoneOptional: 'Telefon (opțional)',
    password: 'Parolă',
    confirmPassword: 'Confirmă parola',
    signIn: 'Intră în cont',
    signUp: 'Creează contul',
    noAccount: 'Nu ai cont?',
    haveAccount: 'Ai deja cont?',
    createOne: 'Înregistrează-te',
    signInInstead: 'Autentifică-te',
    demoAccounts: 'Conturi demo',
    demoAccountsHint: 'Apasă pe un cont ca să completezi formularul.',
    showPassword: 'Arată parola',
    hidePassword: 'Ascunde parola',
    acceptTerms: 'Sunt de acord cu termenii și condițiile',
    myAccount: 'Contul meu',
    signOut: 'Ieși din cont',
    backHome: 'Înapoi la pagina principală',

    // Validation
    errNameRequired: 'Introdu numele tău.',
    errEmailRequired: 'Introdu adresa de e-mail.',
    errEmailInvalid: 'Adresa de e-mail nu pare validă.',
    errPasswordRequired: 'Introdu o parolă.',
    errPasswordShort: 'Parola trebuie să aibă cel puțin 8 caractere.',
    errPasswordMismatch: 'Parolele nu coincid.',
    errTermsRequired: 'Trebuie să accepți termenii și condițiile.',

    // Booking
    register: 'Înregistrare',
    bookingTitle: 'Programează o consultație',
    bookingSubtitle: 'Alege clinica, medicul și ora care ți se potrivesc.',
    bookingLoginRequired: 'Programarea se face doar din cont. Autentifică-te sau creează unul.',
    clinic: 'Clinică',
    doctor: 'Medic',
    chooseClinic: 'Alege clinica',
    chooseDoctor: 'Alege medicul',
    chooseClinicFirst: 'Alege mai întâi clinica',
    noDoctorsForClinic: 'Această clinică nu are încă medici în catalog.',
    date: 'Data',
    availableSlots: 'Ore disponibile',
    noSlotsAvailable: 'Nu mai sunt ore libere în ziua aleasă.',
    chooseDoctorAndDate: 'Alege medicul și data ca să vezi orele libere.',
    notesOptional: 'Motivul vizitei (opțional)',
    notesPlaceholder: 'Descrie pe scurt simptomele sau motivul consultației',
    confirmBooking: 'Confirmă programarea',
    bookingDone: 'Programare confirmată',
    bookingDoneText: 'Ți-am rezervat locul. Vei primi un mesaj de confirmare înainte de vizită.',
    newBooking: 'Fă altă programare',
    myAppointments: 'Programările mele',
    errClinicRequired: 'Alege o clinică.',
    errDoctorRequired: 'Alege un medic.',
    errDateRequired: 'Alege data consultației.',
    errSlotRequired: 'Alege ora consultației.',

    // My appointments
    myAppointmentsTitle: 'Programările mele',
    myAppointmentsSubtitle: 'Toate consultațiile rezervate prin MedGid, într-un singur loc.',
    upcomingAppointments: 'Urmează',
    pastAppointments: 'Istoric',
    noAppointments: 'Nu ai nicio programare',
    noAppointmentsText: 'Când rezervi o consultație, o vei găsi aici.',
    bookFirstAppointment: 'Fă prima programare',
    cancelAppointment: 'Anulează',
    cancelConfirm: 'Sigur anulezi această programare?',
    statusConfirmed: 'Confirmată',
    statusPending: 'În așteptare',
    statusCancelled: 'Anulată',
    statusDone: 'Finalizată',
    appointmentNotes: 'Motivul vizitei',

    // Profile
    profileTitle: 'Contul meu',
    profileSubtitle: 'Actualizează-ți datele personale și parola.',
    personalData: 'Date personale',
    changePassword: 'Schimbă parola',
    currentPassword: 'Parola actuală',
    newPassword: 'Parola nouă',
    confirmNewPassword: 'Confirmă parola nouă',
    saveChanges: 'Salvează modificările',
    updatePassword: 'Actualizează parola',
    profileSaved: 'Datele au fost salvate.',
    passwordChanged: 'Parola a fost schimbată.',
    accountRole: 'Tip cont',
    memberSince: 'Membru din',
    errCurrentPasswordRequired: 'Introdu parola actuală.',
    errSamePassword: 'Parola nouă trebuie să difere de cea actuală.',

    // Service error fallbacks
    errLoginFailed: 'E-mail sau parolă incorectă.',
    errLoginFailedGeneric: 'Autentificare eșuată.',
    errEmailTaken: 'Există deja un cont cu acest e-mail.',
    errRegisterFailedGeneric: 'Înregistrare eșuată.',
    errLoadSlots: 'Nu am putut încărca orele disponibile.',
    errSlotTaken: 'Ora aleasă tocmai a fost rezervată. Alege alta.',
    errCreateAppointmentGeneric: 'Nu am putut înregistra programarea.',
    errAppointmentNotFound: 'Programarea nu a fost găsită.',
    errCancelAppointmentGeneric: 'Nu am putut anula programarea.',
    errLoadAppointments: 'Nu am putut încărca programările.',
    errLoadClinics: 'Nu am putut încărca lista de clinici.',
    errLoadFeaturedClinics: 'Nu am putut încărca clinicile recomandate.',
    errClinicNotFoundBySlug: 'Clinica "{slug}" nu a fost găsită.',
    errLoadSpecialties: 'Nu am putut încărca specialitățile.',
    errLoadDoctors: 'Nu am putut încărca medicii.',
    errLoadTeam: 'Nu am putut încărca echipa medicală.',
    errLoadReviews: 'Nu am putut încărca recenziile.',
    errAccountNotFound: 'Contul nu a fost găsit.',
    errCurrentPasswordWrong: 'Parola actuală este incorectă.',
    errSaveChangesGeneric: 'Nu am putut salva modificările.',
    errChangePasswordGeneric: 'Nu am putut schimba parola.',
    errMessageRequired: 'Scrie un mesaj înainte de a trimite.',

    // Clinic type labels
    typeHospital: 'Spital privat',
    typeMedicalCenter: 'Centru medical',
    typeSpecializedClinic: 'Clinică specializată',
    typeLaboratory: 'Laborator',

    // Misc UI
    menu: 'Meniu',
    switchLanguage: 'Schimbă limba',
    pagination: 'Paginare',
    switchToDark: 'Comută pe tema întunecată',
    switchToLight: 'Comută pe tema luminoasă',
    reloadPage: 'Reîncarcă pagina',
    errUnexpected: 'A apărut o eroare neașteptată.',
    notFoundLabel: 'Eroare 404',
    notFoundTitle: 'Pagina nu a fost găsită',
    notFoundText: 'Adresa accesată nu există sau a fost mutată.',

    // Footer / auth layout
    footerRegisterClinic: 'Înregistrare clinică',
    footerAdminPanel: 'Panou de administrare',
    footerPricing: 'Tarife',
    footerSupport: 'Suport',
    footerAboutProject: 'Despre proiect',
    footerTerms: 'Termeni și condiții',
    footerPrivacy: 'Confidențialitate',
    footerLocation: 'Chișinău, Republica Moldova',
    projectFooterNote: 'MedGid Moldova. Proiect de practică.',
    authHighlight1: 'Programările tale, într-un singur loc',
    authHighlight2: 'Clinici verificate din toată țara',
    authHighlight3: 'Datele tale rămân confidențiale',
    authBrandHeading: 'Catalogul clinicilor private din Republica Moldova',

    // Home page
    statClinics: 'clinici private',
    statDoctors: 'medici verificați',
    statSpecialties: 'specialități',
    howItWorksHeading: 'Trei pași până la consultație',
    howItWorksSubtitle:
      'MedGid îți arată toate clinicile private din Moldova într-un singur loc, ca să găsești specialistul potrivit fără telefoane și așteptare.',
    stepSearchTitle: 'Caută',
    stepSearchText:
      'Filtrează clinicile după oraș, specialitate, preț sau program de lucru și găsește rapid ce ai nevoie.',
    stepCompareTitle: 'Compară',
    stepCompareText:
      'Vezi recenziile pacienților, serviciile oferite, medicii disponibili și tarifele orientative.',
    stepBookTitle: 'Programează-te',
    stepBookText:
      'Alege ora liberă potrivită și primești confirmarea programării pe e-mail sau SMS.',
    homeBenefit1Title: 'Informații verificate',
    homeBenefit1Text:
      'Fiecare clinică este validată înainte de publicare, iar datele sunt actualizate periodic.',
    homeBenefit2Title: 'Economisești timp',
    homeBenefit2Text:
      'Fără apeluri telefonice repetate — vezi într-un singur loc unde există locuri libere.',
    homeBenefit3Title: 'Prețuri transparente',
    homeBenefit3Text:
      'Tarife orientative pentru consultații și investigații, afișate înainte de programare.',
    reviewsEyebrow: 'Recenzii',
    ctaHeading: 'Ești o clinică privată din Moldova?',
    ctaText:
      'Adaugă-ți instituția în catalog, gestionează programările online și ajungi la pacienți din toată țara.',
    ctaRegisterClinic: 'Înregistrează clinica',
    ctaTalkToUs: 'Vorbește cu noi',

    // How it works page
    whyMedGidEyebrow: 'De ce MedGid',
    whatYouGetHeading: 'Ce primești când te programezi prin platformă',
    guarantee1Title: 'Clinici verificate',
    guarantee1Text:
      'Fiecare clinică listată este verificată manual înainte de publicare, cu date de contact reale.',
    guarantee2Title: 'Prețuri transparente',
    guarantee2Text:
      'Afișăm tarife orientative pentru consultații, ca să știi la ce să te aștepți înainte să te programezi.',
    guarantee3Title: 'Recenzii reale',
    guarantee3Text: 'Recenziile provin de la pacienți autentici, pentru decizii informate.',
    guarantee4Title: 'Suport rapid',
    guarantee4Text:
      'Echipa MedGid te poate ajuta oricând ai o întrebare despre o programare sau o clinică.',
    faqEyebrow: 'Întrebări frecvente',
    faqHeading: 'Ai nelămuriri? Am răspuns deja la ele',
    faq1Question: 'Este gratuit să folosesc MedGid?',
    faq1Answer:
      'Da, căutarea clinicilor și crearea unei programări prin platformă este complet gratuită pentru pacienți.',
    faq2Question: 'Programarea făcută pe platformă este confirmată automat?',
    faq2Answer:
      'Programarea este trimisă clinicii alese, iar confirmarea finală ajunge pe e-mail sau SMS, în funcție de fluxul clinicii respective.',
    faq3Question: 'Pot să-mi anulez sau modific o programare?',
    faq3Answer:
      'Da, din secțiunea „Programările mele" poți vedea și anula programările active, direct din contul tău.',
    faq4Question: 'Cum ajunge o clinică nouă pe MedGid?',
    faq4Answer:
      'Clinicile private din Moldova se pot înregistra pe platformă, iar echipa MedGid le verifică datele înainte de publicare.',
    faqNotFoundText: 'Nu ai găsit răspunsul de care ai nevoie?',
    contactUsCta: 'Contactează-ne',
    searchClinicCta: 'Caută o clinică',

    // Specialties page
    specialtySearchPlaceholder: 'Caută o specialitate…',
    noSpecialtyFoundTitle: 'Nicio specialitate găsită',
    noSpecialtyFoundText: 'Încearcă un alt termen de căutare.',
    specialtiesAvailableSuffix: 'specialități disponibile',
    doctorsVerifiedSuffix: 'medici verificați',

    // Contact page
    contactHeading: 'Hai să vorbim',
    contactSubtitle:
      'Ai o întrebare despre o clinică, o programare sau vrei să înregistrezi clinica ta pe MedGid? Scrie-ne și îți răspundem cât mai curând.',
    contactSupportHoursLabel: 'Program suport',
    contactSupportHoursValue: 'Luni – Vineri, 09:00 – 18:00',
    contactNameLabel: 'Nume',
    contactNamePlaceholder: 'Numele tău',
    emailPlaceholderExample: 'nume@exemplu.md',
    contactSubjectLabel: 'Subiect (opțional)',
    contactSubjectPlaceholder: 'Despre ce este vorba?',
    contactMessageLabel: 'Mesaj',
    contactMessagePlaceholder: 'Scrie mesajul tău aici…',
    sending: 'Se trimite…',
    sendMessage: 'Trimite mesajul',
    messageSentTitle: 'Mesaj trimis!',
    messageSentText: 'Îți mulțumim, am primit mesajul tău și îți vom răspunde în cel mai scurt timp.',
    sendAnotherMessage: 'Trimite alt mesaj',
    minPasswordPlaceholder: 'Cel puțin 8 caractere',

    // Admin — more service errors
    errClinicSlugTaken: 'Există deja o clinică cu un nume foarte asemănător.',
    errClinicNotFound: 'Clinica nu a fost găsită.',
    errDeleteClinicGeneric: 'Nu am putut șterge clinica.',
    errLoadPatients: 'Nu am putut încărca pacienții.',
    errDeletePatientGeneric: 'Nu am putut șterge pacientul.',

    // Admin — layout & navigation
    adminNavDashboard: 'Tablou de bord',
    adminNavPatients: 'Pacienți',
    adminNavAppointments: 'Programări',
    adminBackToSite: 'Înapoi la site',

    // Admin — dashboard
    adminDashboardSubtitle: 'Prezentare generală a platformei MedGid.',
    adminStatDoctors: 'Medici',
    recentAppointmentsTitle: 'Programări recente',
    noRecentAppointments: 'Nu există programări încă.',

    // Admin — clinics
    adminClinicsTitle: 'Administrare clinici',
    adminClinicsSubtitle: 'Adaugă, editează sau elimină clinici din catalog.',
    addClinic: 'Adaugă clinică',
    tablePriceShort: 'Preț',
    statusLabel: 'Stare',
    tableActions: 'Acțiuni',
    editAction: 'Editează',
    deleteAction: 'Șterge',
    confirmDeleteClinic: 'Sigur ștergi clinica „{name}"? Acțiunea nu poate fi anulată.',
    adminNoClinics: 'Nu există clinici în catalog.',
    clinicDeleted: 'Clinica a fost ștearsă.',
    searchClinicsPlaceholder: 'Caută clinică…',

    // Admin — clinic form
    editClinicTitle: 'Editează clinica',
    fieldClinicName: 'Nume clinică',
    fieldDescription: 'Descriere',
    fieldConsultationPrice: 'Preț consultație (MDL)',
    fieldBrandColor: 'Culoare brand',
    fieldSpecialties: 'Specialități oferite',
    fieldHasEmergency: 'Are urgențe 24/7',
    alwaysOpenLabel: 'Non-stop (24/7)',
    weekdayHoursLabel: 'Luni – Vineri',
    saturdayEnabledLabel: 'Deschis și sâmbătă',
    saturdayHoursLabel: 'Sâmbătă',
    fromLabel: 'De la',
    toLabel: 'Până la',
    saveClinic: 'Salvează clinica',
    cancel: 'Anulează',
    errClinicNameRequired: 'Introdu numele clinicii.',
    errClinicAddressRequired: 'Introdu adresa clinicii.',
    errClinicPhoneRequired: 'Introdu telefonul clinicii.',
    errClinicDescriptionRequired: 'Introdu o descriere.',
    errClinicPriceRequired: 'Introdu un preț valid.',
    errClinicSpecialtiesRequired: 'Alege cel puțin o specialitate.',
    clinicSaved: 'Clinica a fost salvată.',

    // Admin — patients
    adminPatientsSubtitle: 'Toți pacienții înregistrați pe platformă.',
    searchPatientsPlaceholder: 'Caută după nume sau e-mail…',
    tableName: 'Nume',
    tableAppointmentsCount: 'Programări',
    noPatientsYet: 'Nu există pacienți înregistrați.',
    confirmDeletePatient: 'Sigur ștergi contul lui „{name}"? Acțiunea nu poate fi anulată.',
    patientDeleted: 'Contul a fost șters.',

    // Admin — appointments
    adminAppointmentsSubtitle: 'Toate programările făcute pe platformă.',
    searchAppointmentsPlaceholder: 'Caută după pacient sau clinică…',
    filterAllStatuses: 'Toate stările',
    tablePatient: 'Pacient',
    noAppointmentsYetAdmin: 'Nu există programări.',
    appointmentCancelled: 'Programarea a fost anulată.',
  },

  en: {
    // Navbar
    clinics: 'Clinics',
    specialties: 'Specialties',
    howItWorks: 'How it works',
    contact: 'Contact',
    login: 'Sign in',
    bookAppointment: 'Book a visit',

    // Hero
    heroBadge: 'Verified clinics across Moldova',
    heroTitle: 'Find the right clinic',
    heroTitleAccent: 'and book an appointment in minutes',
    heroSubtitle:
      'One place for every private hospital and medical centre in Moldova: specialties, indicative prices, opening hours and real patient reviews.',
    searchPlaceholder: 'Clinic, specialty or service',
    searchCity: 'City',
    searchButton: 'Search',
    allCities: 'All cities',
    popularSearches: 'Popular searches:',

    // Sections
    specialtiesTitle: 'Search by the field you need',
    specialtiesSubtitle:
      'Over 35 medical specialties available in private clinics across the country.',
    viewAllSpecialties: 'View all specialties',
    featuredTitle: 'Top rated clinics in Moldova',
    featuredSubtitle:
      'Selected by patient reviews, price transparency and online booking availability.',
    viewAllClinics: 'View all clinics',
    reviewsTitle: 'What patients say',

    // Clinic card
    consultationFrom: 'Consultation from',
    viewDetails: 'View details',
    openNow: 'Open now',
    closed: 'Closed',
    emergency: 'Emergency 24/7',
    doctors: 'doctors',

    // States
    loading: 'Loading...',
    emptyTitle: 'No clinics found',
    emptyDescription: 'Try another filter or another city.',
    errorTitle: 'Something went wrong',
    retry: 'Try again',

    // Footer
    footerTagline:
      'The catalogue of private clinics and hospitals in Moldova. Up-to-date information and online booking, all in one place.',
    forPatients: 'Patients',
    forClinics: 'Clinics',
    about: 'About',
    disclaimer:
      'The data shown is illustrative and does not represent official offers from the clinics.',

    // Clinics listing
    clinicsPageTitle: 'Private clinics in Moldova',
    clinicsPageSubtitle:
      'Filter by city, specialty, price or opening hours and compare clinics in one place.',
    filters: 'Filters',
    showFilters: 'Show filters',
    hideFilters: 'Hide filters',
    resetFilters: 'Reset',
    clinicType: 'Institution type',
    allTypes: 'All types',
    specialty: 'Specialty',
    allSpecialties: 'All specialties',
    city: 'City',
    minRating: 'Minimum rating',
    anyRating: 'Any rating',
    maxPrice: 'Maximum consultation price',
    onlyOpenNow: 'Open now only',
    onlyEmergency: 'With 24/7 emergency only',
    sortBy: 'Sort by',
    sortRating: 'Rating (high to low)',
    sortPriceAsc: 'Price (low to high)',
    sortPriceDesc: 'Price (high to low)',
    sortName: 'Name (A–Z)',
    resultsFound: 'clinics found',
    oneResultFound: 'clinic found',
    clearAll: 'Clear all filters',
    previous: 'Previous',
    next: 'Next',

    // Clinic details
    backToClinics: 'Back to clinics',
    aboutClinic: 'About the clinic',
    servicesOffered: 'Specialties and services',
    medicalTeam: 'Medical team',
    reviews: 'Reviews',
    noDoctors: 'The medical team has not been published for this clinic yet.',
    noReviews: 'This clinic has no reviews yet.',
    yearsExperience: 'years of experience',
    contactDetails: 'Contact details',
    address: 'Address',
    phone: 'Phone',
    website: 'Website',
    schedule: 'Opening hours',
    insurance: 'Health insurance',
    insuranceAccepted: 'Accepts health insurance',
    insuranceNotAccepted: 'Does not accept health insurance',
    openInMaps: 'View on map',
    callClinic: 'Call the clinic',
    clinicNotFound: 'Clinic not found',
    clinicNotFoundText: 'The address may be wrong, or the clinic may have been removed from the catalogue.',

    // Auth
    loginTitle: 'Welcome back',
    loginSubtitle: 'Sign in to see your appointments and saved clinics.',
    registerTitle: 'Create an account',
    registerSubtitle: 'It takes less than a minute. Your appointments stay in one place.',
    fullName: 'Full name',
    email: 'E-mail',
    phoneOptional: 'Phone (optional)',
    password: 'Password',
    confirmPassword: 'Confirm password',
    signIn: 'Sign in',
    signUp: 'Create account',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    createOne: 'Sign up',
    signInInstead: 'Sign in',
    demoAccounts: 'Demo accounts',
    demoAccountsHint: 'Click an account to fill in the form.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    acceptTerms: 'I agree to the terms and conditions',
    myAccount: 'My account',
    signOut: 'Sign out',
    backHome: 'Back to home page',

    // Validation
    errNameRequired: 'Enter your name.',
    errEmailRequired: 'Enter your e-mail address.',
    errEmailInvalid: 'That e-mail address does not look valid.',
    errPasswordRequired: 'Enter a password.',
    errPasswordShort: 'The password must be at least 8 characters long.',
    errPasswordMismatch: 'The passwords do not match.',
    errTermsRequired: 'You must accept the terms and conditions.',

    // Booking
    register: 'Sign up',
    bookingTitle: 'Book an appointment',
    bookingSubtitle: 'Pick the clinic, the doctor and the time that suit you.',
    bookingLoginRequired: 'Booking requires an account. Sign in or create one.',
    clinic: 'Clinic',
    doctor: 'Doctor',
    chooseClinic: 'Choose a clinic',
    chooseDoctor: 'Choose a doctor',
    chooseClinicFirst: 'Choose a clinic first',
    noDoctorsForClinic: 'This clinic has no doctors in the catalogue yet.',
    date: 'Date',
    availableSlots: 'Available times',
    noSlotsAvailable: 'No free times left on the selected day.',
    chooseDoctorAndDate: 'Pick a doctor and a date to see the free times.',
    notesOptional: 'Reason for the visit (optional)',
    notesPlaceholder: 'Briefly describe your symptoms or the reason for the visit',
    confirmBooking: 'Confirm appointment',
    bookingDone: 'Appointment confirmed',
    bookingDoneText: 'Your slot is reserved. You will get a confirmation message before the visit.',
    newBooking: 'Book another appointment',
    myAppointments: 'My appointments',
    errClinicRequired: 'Choose a clinic.',
    errDoctorRequired: 'Choose a doctor.',
    errDateRequired: 'Choose the appointment date.',
    errSlotRequired: 'Choose the appointment time.',

    // My appointments
    myAppointmentsTitle: 'My appointments',
    myAppointmentsSubtitle: 'Every visit booked through MedGid, in one place.',
    upcomingAppointments: 'Upcoming',
    pastAppointments: 'History',
    noAppointments: 'You have no appointments',
    noAppointmentsText: 'Once you book a visit, you will find it here.',
    bookFirstAppointment: 'Book your first appointment',
    cancelAppointment: 'Cancel',
    cancelConfirm: 'Cancel this appointment?',
    statusConfirmed: 'Confirmed',
    statusPending: 'Pending',
    statusCancelled: 'Cancelled',
    statusDone: 'Completed',
    appointmentNotes: 'Reason for the visit',

    // Profile
    profileTitle: 'My account',
    profileSubtitle: 'Update your personal details and password.',
    personalData: 'Personal details',
    changePassword: 'Change password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmNewPassword: 'Confirm new password',
    saveChanges: 'Save changes',
    updatePassword: 'Update password',
    profileSaved: 'Your details have been saved.',
    passwordChanged: 'Your password has been changed.',
    accountRole: 'Account type',
    memberSince: 'Member since',
    errCurrentPasswordRequired: 'Enter your current password.',
    errSamePassword: 'The new password must differ from the current one.',

    // Service error fallbacks
    errLoginFailed: 'Incorrect e-mail or password.',
    errLoginFailedGeneric: 'Sign in failed.',
    errEmailTaken: 'An account with this e-mail already exists.',
    errRegisterFailedGeneric: 'Registration failed.',
    errLoadSlots: 'We could not load the available times.',
    errSlotTaken: 'That time was just booked. Choose another one.',
    errCreateAppointmentGeneric: 'We could not register the appointment.',
    errAppointmentNotFound: 'Appointment not found.',
    errCancelAppointmentGeneric: 'We could not cancel the appointment.',
    errLoadAppointments: 'We could not load the appointments.',
    errLoadClinics: 'We could not load the list of clinics.',
    errLoadFeaturedClinics: 'We could not load the featured clinics.',
    errClinicNotFoundBySlug: 'Clinic "{slug}" was not found.',
    errLoadSpecialties: 'We could not load the specialties.',
    errLoadDoctors: 'We could not load the doctors.',
    errLoadTeam: 'We could not load the medical team.',
    errLoadReviews: 'We could not load the reviews.',
    errAccountNotFound: 'Account not found.',
    errCurrentPasswordWrong: 'The current password is incorrect.',
    errSaveChangesGeneric: 'We could not save the changes.',
    errChangePasswordGeneric: 'We could not change the password.',
    errMessageRequired: 'Write a message before sending.',

    // Clinic type labels
    typeHospital: 'Private hospital',
    typeMedicalCenter: 'Medical centre',
    typeSpecializedClinic: 'Specialized clinic',
    typeLaboratory: 'Laboratory',

    // Misc UI
    menu: 'Menu',
    switchLanguage: 'Switch language',
    pagination: 'Pagination',
    switchToDark: 'Switch to dark theme',
    switchToLight: 'Switch to light theme',
    reloadPage: 'Reload page',
    errUnexpected: 'An unexpected error occurred.',
    notFoundLabel: '404 error',
    notFoundTitle: 'Page not found',
    notFoundText: 'The page you tried to reach does not exist or has been moved.',

    // Footer / auth layout
    footerRegisterClinic: 'Register your clinic',
    footerAdminPanel: 'Admin panel',
    footerPricing: 'Pricing',
    footerSupport: 'Support',
    footerAboutProject: 'About the project',
    footerTerms: 'Terms and conditions',
    footerPrivacy: 'Privacy',
    footerLocation: 'Chisinau, Republic of Moldova',
    projectFooterNote: 'MedGid Moldova. Student project.',
    authHighlight1: 'Your appointments, all in one place',
    authHighlight2: 'Verified clinics from across the country',
    authHighlight3: 'Your data stays confidential',
    authBrandHeading: 'The catalogue of private clinics in the Republic of Moldova',

    // Home page
    statClinics: 'private clinics',
    statDoctors: 'verified doctors',
    statSpecialties: 'specialties',
    howItWorksHeading: 'Three steps to your appointment',
    howItWorksSubtitle:
      'MedGid shows you every private clinic in Moldova in one place, so you can find the right specialist without phone calls and waiting.',
    stepSearchTitle: 'Search',
    stepSearchText:
      'Filter clinics by city, specialty, price or opening hours and quickly find what you need.',
    stepCompareTitle: 'Compare',
    stepCompareText:
      'See patient reviews, the services offered, the available doctors and indicative prices.',
    stepBookTitle: 'Book',
    stepBookText: 'Pick the free time that suits you and get the booking confirmation by e-mail or SMS.',
    homeBenefit1Title: 'Verified information',
    homeBenefit1Text: 'Every clinic is validated before publishing, and the data is updated regularly.',
    homeBenefit2Title: 'You save time',
    homeBenefit2Text: 'No more repeated phone calls — see in one place where there are free slots.',
    homeBenefit3Title: 'Transparent prices',
    homeBenefit3Text:
      'Indicative prices for consultations and investigations, shown before you book.',
    reviewsEyebrow: 'Reviews',
    ctaHeading: 'Are you a private clinic in Moldova?',
    ctaText:
      'Add your institution to the catalogue, manage bookings online and reach patients from across the country.',
    ctaRegisterClinic: 'Register your clinic',
    ctaTalkToUs: 'Talk to us',

    // How it works page
    whyMedGidEyebrow: 'Why MedGid',
    whatYouGetHeading: 'What you get when you book through the platform',
    guarantee1Title: 'Verified clinics',
    guarantee1Text:
      'Every listed clinic is manually verified before publishing, with real contact details.',
    guarantee2Title: 'Transparent prices',
    guarantee2Text:
      'We show indicative consultation prices, so you know what to expect before you book.',
    guarantee3Title: 'Real reviews',
    guarantee3Text: 'Reviews come from genuine patients, for informed decisions.',
    guarantee4Title: 'Fast support',
    guarantee4Text: 'The MedGid team can help any time you have a question about a booking or a clinic.',
    faqEyebrow: 'Frequently asked questions',
    faqHeading: 'Have questions? We already answered them',
    faq1Question: 'Is it free to use MedGid?',
    faq1Answer:
      'Yes, searching for clinics and booking an appointment through the platform is completely free for patients.',
    faq2Question: 'Is a booking made on the platform automatically confirmed?',
    faq2Answer:
      "The booking is sent to the chosen clinic, and the final confirmation arrives by e-mail or SMS, depending on that clinic's process.",
    faq3Question: 'Can I cancel or change a booking?',
    faq3Answer:
      'Yes, from the "My appointments" section you can see and cancel your active bookings, directly from your account.',
    faq4Question: 'How does a new clinic join MedGid?',
    faq4Answer:
      'Private clinics in Moldova can register on the platform, and the MedGid team verifies their data before publishing.',
    faqNotFoundText: "Didn't find the answer you needed?",
    contactUsCta: 'Contact us',
    searchClinicCta: 'Search for a clinic',

    // Specialties page
    specialtySearchPlaceholder: 'Search for a specialty…',
    noSpecialtyFoundTitle: 'No specialty found',
    noSpecialtyFoundText: 'Try another search term.',
    specialtiesAvailableSuffix: 'specialties available',
    doctorsVerifiedSuffix: 'verified doctors',

    // Contact page
    contactHeading: "Let's talk",
    contactSubtitle:
      'Have a question about a clinic, a booking, or want to register your clinic on MedGid? Write to us and we will get back to you as soon as possible.',
    contactSupportHoursLabel: 'Support hours',
    contactSupportHoursValue: 'Monday – Friday, 09:00 – 18:00',
    contactNameLabel: 'Name',
    contactNamePlaceholder: 'Your name',
    emailPlaceholderExample: 'name@example.com',
    contactSubjectLabel: 'Subject (optional)',
    contactSubjectPlaceholder: 'What is it about?',
    contactMessageLabel: 'Message',
    contactMessagePlaceholder: 'Write your message here…',
    sending: 'Sending…',
    sendMessage: 'Send message',
    messageSentTitle: 'Message sent!',
    messageSentText: 'Thank you, we received your message and will reply as soon as possible.',
    sendAnotherMessage: 'Send another message',
    minPasswordPlaceholder: 'At least 8 characters',

    // Admin — more service errors
    errClinicSlugTaken: 'A clinic with a very similar name already exists.',
    errClinicNotFound: 'Clinic not found.',
    errDeleteClinicGeneric: 'We could not delete the clinic.',
    errLoadPatients: 'We could not load the patients.',
    errDeletePatientGeneric: 'We could not delete the patient.',

    // Admin — layout & navigation
    adminNavDashboard: 'Dashboard',
    adminNavPatients: 'Patients',
    adminNavAppointments: 'Appointments',
    adminBackToSite: 'Back to site',

    // Admin — dashboard
    adminDashboardSubtitle: 'An overview of the MedGid platform.',
    adminStatDoctors: 'Doctors',
    recentAppointmentsTitle: 'Recent appointments',
    noRecentAppointments: 'No appointments yet.',

    // Admin — clinics
    adminClinicsTitle: 'Manage clinics',
    adminClinicsSubtitle: 'Add, edit or remove clinics from the catalogue.',
    addClinic: 'Add clinic',
    tablePriceShort: 'Price',
    statusLabel: 'Status',
    tableActions: 'Actions',
    editAction: 'Edit',
    deleteAction: 'Delete',
    confirmDeleteClinic: 'Delete clinic "{name}"? This cannot be undone.',
    adminNoClinics: 'There are no clinics in the catalogue.',
    clinicDeleted: 'The clinic was deleted.',
    searchClinicsPlaceholder: 'Search clinics…',

    // Admin — clinic form
    editClinicTitle: 'Edit clinic',
    fieldClinicName: 'Clinic name',
    fieldDescription: 'Description',
    fieldConsultationPrice: 'Consultation price (MDL)',
    fieldBrandColor: 'Brand colour',
    fieldSpecialties: 'Specialties offered',
    fieldHasEmergency: 'Has 24/7 emergency',
    alwaysOpenLabel: 'Open 24/7',
    weekdayHoursLabel: 'Monday – Friday',
    saturdayEnabledLabel: 'Also open on Saturday',
    saturdayHoursLabel: 'Saturday',
    fromLabel: 'From',
    toLabel: 'To',
    saveClinic: 'Save clinic',
    cancel: 'Cancel',
    errClinicNameRequired: 'Enter the clinic name.',
    errClinicAddressRequired: 'Enter the clinic address.',
    errClinicPhoneRequired: 'Enter the clinic phone number.',
    errClinicDescriptionRequired: 'Enter a description.',
    errClinicPriceRequired: 'Enter a valid price.',
    errClinicSpecialtiesRequired: 'Choose at least one specialty.',
    clinicSaved: 'The clinic was saved.',

    // Admin — patients
    adminPatientsSubtitle: 'Every patient registered on the platform.',
    searchPatientsPlaceholder: 'Search by name or e-mail…',
    tableName: 'Name',
    tableAppointmentsCount: 'Appointments',
    noPatientsYet: 'No registered patients yet.',
    confirmDeletePatient: 'Delete "{name}"\'s account? This cannot be undone.',
    patientDeleted: 'The account was deleted.',

    // Admin — appointments
    adminAppointmentsSubtitle: 'Every appointment booked on the platform.',
    searchAppointmentsPlaceholder: 'Search by patient or clinic…',
    filterAllStatuses: 'All statuses',
    tablePatient: 'Patient',
    noAppointmentsYetAdmin: 'No appointments yet.',
    appointmentCancelled: 'The appointment was cancelled.',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)['ro'];

/** Reads the saved language synchronously, for code outside the React tree. */
export function getStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language | null;
    return saved === 'en' ? 'en' : 'ro';
  } catch {
    return 'ro';
  }
}

/**
 * Translates a key using the currently saved language, for services, contexts
 * and class components that cannot call the `useLanguage` hook.
 */
export function translate(key: TranslationKey): string {
  const language = getStoredLanguage();
  return translations[language][key] ?? translations.ro[key] ?? key;
}
