import type { CatalogStats, Clinic, Doctor, Review, Specialty, UserRole } from '../types';

import medparkLogo from '../assets/logos/medpark.svg';
import terramedLogo from '../assets/logos/terramed.png';
import repromedLogo from '../assets/logos/repromed.svg';
import excellenceLogo from '../assets/logos/excellence.png';
import santeLogo from '../assets/logos/sante.svg';
import terradentLogo from '../assets/logos/terradent.png';

export interface DemoAccount {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

/**
 * Demo dataset used until the backend is connected.
 *
 * Names, websites, addresses and phone numbers were taken from each clinic's
 * own website. Ratings, review counts, prices and the `isOpenNow` flag are
 * illustrative — they must not be presented as official information.
 * Logos are the property of the respective clinics and are used here only to
 * identify them inside the catalogue.
 */

export const mockSpecialties: Specialty[] = [
  { id: 'sp-1', slug: 'cardiologie', name: 'Cardiologie', icon: 'HeartPulse', doctorsCount: 78 },
  { id: 'sp-2', slug: 'stomatologie', name: 'Stomatologie', icon: 'Smile', doctorsCount: 154 },
  { id: 'sp-3', slug: 'neurologie', name: 'Neurologie', icon: 'Brain', doctorsCount: 46 },
  { id: 'sp-4', slug: 'oftalmologie', name: 'Oftalmologie', icon: 'Eye', doctorsCount: 39 },
  { id: 'sp-5', slug: 'pediatrie', name: 'Pediatrie', icon: 'Baby', doctorsCount: 92 },
  { id: 'sp-6', slug: 'ortopedie', name: 'Ortopedie', icon: 'Bone', doctorsCount: 51 },
  { id: 'sp-7', slug: 'analize', name: 'Analize de laborator', icon: 'TestTube', doctorsCount: 33 },
  { id: 'sp-8', slug: 'medicina-familie', name: 'Medicină de familie', icon: 'Stethoscope', doctorsCount: 118 },
];

export const mockClinics: Clinic[] = [
  {
    id: 'cl-1',
    slug: 'medpark',
    name: 'Medpark International Hospital',
    type: 'hospital',
    city: 'Chișinău',
    address: 'str. Andrei Doga 24',
    phone: '+373 22 40 00 40',
    website: 'https://medpark.md',
    description:
      'Primul spital internațional din Republica Moldova, inaugurat în 2011. Spital multidisciplinar acreditat Joint Commission International, cu centre de excelență în cardiologie și chirurgie cardiacă, oncologie, perinatologie, pediatrie și imagistică medicală, plus departament de medicină de urgență permanent.',
    rating: 4.8,
    reviewsCount: 1243,
    specialties: ['cardiologie', 'ortopedie', 'pediatrie', 'analize', 'neurologie'],
    consultationFrom: 600,
    workingHours: { label: 'Non-stop, 24/7', isOpenNow: true },
    hasEmergency: true,
    acceptsInsurance: true,
    brandColor: '#008286',
    logo: medparkLogo,
    initials: 'MP',
  },
  {
    id: 'cl-2',
    slug: 'terramed',
    name: 'Terramed',
    type: 'medical_center',
    city: 'Chișinău',
    address: 'str. Trandafirilor 15/4',
    phone: '+373 22 20 23 73',
    website: 'https://terramed.md',
    description:
      'Centru medical fondat în 1999, cu două filiale în Chișinău. Acoperă policlinică pentru adulți și copii, staționar de zi, sală de operații și laborator propriu, cu specializări de la ginecologie și cardiologie până la ortopedie, dermatologie și oftalmologie.',
    rating: 4.6,
    reviewsCount: 812,
    specialties: ['medicina-familie', 'pediatrie', 'analize', 'oftalmologie', 'cardiologie'],
    consultationFrom: 450,
    workingHours: { label: 'Lun–Vin, 08:00–19:00 · Sâm, 09:00–14:00', isOpenNow: true },
    hasEmergency: false,
    acceptsInsurance: true,
    brandColor: '#12a89b',
    logo: terramedLogo,
    initials: 'TM',
  },
  {
    id: 'cl-3',
    slug: 'repromed',
    name: 'Repromed',
    type: 'hospital',
    city: 'Chișinău',
    address: 'bd. Cuza Vodă 29/1',
    phone: '+373 22 26 38 88',
    website: 'https://repromed.md',
    description:
      'Centru medical multidisciplinar cunoscut pentru clinica de fertilitate, cu spital propriu (Repromed+), farmacie specializată și departamente de ginecologie, chirurgie și mamologie. Oferă diagnostic de laborator și instrumental cu echipament modern.',
    rating: 4.7,
    reviewsCount: 546,
    specialties: ['medicina-familie', 'analize', 'pediatrie'],
    consultationFrom: 700,
    workingHours: { label: 'Lun–Vin, 08:00–18:00 · Sâm, 08:00–14:00', isOpenNow: false },
    hasEmergency: false,
    acceptsInsurance: false,
    brandColor: '#8b5cf6',
    logo: repromedLogo,
    initials: 'RM',
  },
  {
    id: 'cl-4',
    slug: 'excellence',
    name: 'Excellence Medical Center',
    type: 'medical_center',
    city: 'Chișinău',
    address: 'str. Grenoble 23',
    phone: '+373 22 28 86 22',
    website: 'https://www.excellence.md',
    description:
      'Centru medical axat pe diagnostic: tomografie computerizată spirală, radiografie, osteodensitometrie, ultrasonografie și elastografie, plus diagnostic funcțional computerizat (EEG, EMG, ECG, spirografie). Programările și rezultatele sunt gestionate într-un sistem informatic propriu.',
    rating: 4.5,
    reviewsCount: 389,
    specialties: ['neurologie', 'ortopedie', 'analize'],
    consultationFrom: 550,
    workingHours: { label: 'Lun–Vin, 08:00–18:00', isOpenNow: true },
    hasEmergency: false,
    acceptsInsurance: true,
    brandColor: '#1d4ed8',
    logo: excellenceLogo,
    initials: 'EX',
  },
  {
    id: 'cl-5',
    slug: 'clinica-sante-balti',
    name: 'Clinica Sante Bălți',
    type: 'laboratory',
    city: 'Bălți',
    address: 'str. Independenței 37',
    phone: '+373 79 77 44 74',
    website: 'https://sante.md',
    description:
      'Filiala din Bălți a rețelei Clinica Sante, cu laborator de analize medicale și consultații de specialitate. Recoltarea începe de la ora 07:00, iar rezultatele sunt disponibile online în contul pacientului.',
    rating: 4.4,
    reviewsCount: 271,
    specialties: ['analize', 'medicina-familie', 'cardiologie'],
    consultationFrom: 350,
    workingHours: { label: 'Lun–Vin, 07:00–17:00 · Sâm, 08:00–13:00', isOpenNow: true },
    hasEmergency: false,
    acceptsInsurance: true,
    brandColor: '#f26f1a',
    logo: santeLogo,
    initials: 'CS',
  },
  {
    id: 'cl-6',
    slug: 'terradent',
    name: 'TerraDent',
    type: 'specialized_clinic',
    city: 'Chișinău',
    address: 'str. Trandafirilor 7',
    phone: '+373 22 20 23 73',
    website: 'https://terradent.md',
    description:
      'Clinică stomatologică premiată ca cea mai bună din republică patru ani consecutiv. Acoperă stomatologie digitală, implantologie, ortodonție, chirurgie orală și estetică dentară, cu scanare intraorală și planificare digitală a tratamentului.',
    rating: 4.9,
    reviewsCount: 964,
    specialties: ['stomatologie'],
    consultationFrom: 300,
    workingHours: { label: 'Lun–Vin, 09:00–20:00 · Sâm, 09:00–15:00', isOpenNow: true },
    hasEmergency: false,
    acceptsInsurance: false,
    brandColor: '#c9a227',
    logo: terradentLogo,
    initials: 'TD',
  },
];

export const mockDoctors: Doctor[] = [
  // Medpark
  { id: 'dr-1', name: 'Dr. Daniela Moraru', specialtySlug: 'cardiologie', clinicId: 'cl-1', yearsOfExperience: 14, rating: 4.9, initials: 'DM' },
  { id: 'dr-2', name: 'Dr. Andrei Cebotari', specialtySlug: 'ortopedie', clinicId: 'cl-1', yearsOfExperience: 11, rating: 4.7, initials: 'AC' },
  { id: 'dr-3', name: 'Dr. Mihai Rusu', specialtySlug: 'neurologie', clinicId: 'cl-1', yearsOfExperience: 18, rating: 4.8, initials: 'MR' },
  // Terramed
  { id: 'dr-4', name: 'Dr. Irina Bejan', specialtySlug: 'pediatrie', clinicId: 'cl-2', yearsOfExperience: 9, rating: 4.8, initials: 'IB' },
  { id: 'dr-5', name: 'Dr. Vasile Croitoru', specialtySlug: 'cardiologie', clinicId: 'cl-2', yearsOfExperience: 21, rating: 4.6, initials: 'VC' },
  { id: 'dr-6', name: 'Dr. Ana Lungu', specialtySlug: 'oftalmologie', clinicId: 'cl-2', yearsOfExperience: 7, rating: 4.5, initials: 'AL' },
  // Repromed
  { id: 'dr-7', name: 'Dr. Elena Postică', specialtySlug: 'medicina-familie', clinicId: 'cl-3', yearsOfExperience: 16, rating: 4.9, initials: 'EP' },
  { id: 'dr-8', name: 'Dr. Nicolae Barbu', specialtySlug: 'analize', clinicId: 'cl-3', yearsOfExperience: 12, rating: 4.6, initials: 'NB' },
  // Excellence
  { id: 'dr-9', name: 'Dr. Cristina Ursu', specialtySlug: 'neurologie', clinicId: 'cl-4', yearsOfExperience: 13, rating: 4.7, initials: 'CU' },
  { id: 'dr-10', name: 'Dr. Sergiu Pînzari', specialtySlug: 'ortopedie', clinicId: 'cl-4', yearsOfExperience: 10, rating: 4.4, initials: 'SP' },
  // Clinica Sante Bălți
  { id: 'dr-11', name: 'Dr. Tatiana Cojocaru', specialtySlug: 'medicina-familie', clinicId: 'cl-5', yearsOfExperience: 15, rating: 4.5, initials: 'TC' },
  { id: 'dr-12', name: 'Dr. Igor Melnic', specialtySlug: 'cardiologie', clinicId: 'cl-5', yearsOfExperience: 8, rating: 4.3, initials: 'IM' },
  // TerraDent
  { id: 'dr-13', name: 'Dr. Radu Ciobanu', specialtySlug: 'stomatologie', clinicId: 'cl-6', yearsOfExperience: 17, rating: 5, initials: 'RC' },
  { id: 'dr-14', name: 'Dr. Olga Grosu', specialtySlug: 'stomatologie', clinicId: 'cl-6', yearsOfExperience: 6, rating: 4.8, initials: 'OG' },
];

export const mockReviews: Review[] = [
  {
    id: 'rv-1',
    clinicId: 'cl-1',
    authorName: 'Victoria P.',
    rating: 5,
    comment:
      'Programare online în 2 minute, iar consultația a început la ora exactă. Recomand cu încredere.',
    createdAt: '2026-07-14',
  },
  {
    id: 'rv-2',
    clinicId: 'cl-6',
    authorName: 'Sergiu M.',
    rating: 5,
    comment:
      'Prețurile afișate în aplicație au corespuns exact cu cele din clinică. Fără surprize.',
    createdAt: '2026-08-02',
  },
  {
    id: 'rv-3',
    clinicId: 'cl-5',
    authorName: 'Elena C.',
    rating: 4,
    comment:
      'Foarte util că pot compara clinicile din Bălți fără să sun la fiecare în parte.',
    createdAt: '2026-08-21',
  },
  {
    id: 'rv-4',
    clinicId: 'cl-1',
    authorName: 'Andrei T.',
    rating: 5,
    comment:
      'Am ajuns la urgențe noaptea, personalul a fost prompt și explicațiile foarte clare.',
    createdAt: '2026-06-30',
  },
  {
    id: 'rv-5',
    clinicId: 'cl-2',
    authorName: 'Mihaela D.',
    rating: 4,
    comment:
      'Analizele au fost gata a doua zi, primite pe e-mail. Sala de așteptare cam aglomerată dimineața.',
    createdAt: '2026-08-11',
  },
  {
    id: 'rv-6',
    clinicId: 'cl-3',
    authorName: 'Cristina B.',
    rating: 5,
    comment:
      'Echipa de la clinica de fertilitate a explicat fiecare pas al procedurii. Multă răbdare.',
    createdAt: '2026-05-19',
  },
  {
    id: 'rv-7',
    clinicId: 'cl-4',
    authorName: 'Dorin V.',
    rating: 4,
    comment:
      'CT-ul s-a făcut rapid, iar rezultatul l-am descărcat din contul online în aceeași zi.',
    createdAt: '2026-07-28',
  },
  {
    id: 'rv-8',
    clinicId: 'cl-6',
    authorName: 'Natalia S.',
    rating: 5,
    comment: 'Tratament fără durere și un plan de lucru explicat pe înțelesul meu.',
    createdAt: '2026-08-25',
  },
];

/**
 * Accounts seeded into localStorage on first run, so the login page works
 * before the backend exists. The passwords are shown on the login screen on
 * purpose — these are demo credentials, not secrets.
 */
export const demoAccounts: DemoAccount[] = [
  {
    name: 'Ana Popescu',
    email: 'pacient@medgid.md',
    password: 'pacient123',
    role: 'patient',
    phone: '+373 69 123 456',
  },
  {
    name: 'Administrator MedGid',
    email: 'admin@medgid.md',
    password: 'admin123',
    role: 'admin',
  },
];

export const mockStats: CatalogStats = {
  clinicsCount: 124,
  doctorsCount: 1420,
  specialtiesCount: 35,
  citiesCount: 6,
};
