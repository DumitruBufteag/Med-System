import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { DoctorInputDTO } from '../../types';
import { createDoctor, getDoctorById, updateDoctor } from '../../services';
import { useClinics } from '../../contexts/ClinicContext';
import { useLanguage } from '../../contexts/LanguageContext';
import FormField from '../../components/ui/FormField';
import Dropdown from '../../components/ui/Dropdown';
import Spinner from '../../components/ui/Spinner';

interface FormState {
  name: string;
  clinicId: string;
  specialtySlug: string;
  yearsOfExperience: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  clinicId: '',
  specialtySlug: '',
  yearsOfExperience: '',
};

interface FieldErrors {
  name?: string;
  clinicId?: string;
  specialtySlug?: string;
  yearsOfExperience?: string;
}

export default function AdminDoctorFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { clinics, specialties } = useClinics();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isCurrent = true;

    void getDoctorById(id).then((result) => {
      if (!isCurrent) return;
      setIsLoading(false);

      if (result.success && result.data) {
        const doctor = result.data;
        setForm({
          name: doctor.name,
          clinicId: doctor.clinicId,
          specialtySlug: doctor.specialtySlug,
          yearsOfExperience: String(doctor.yearsOfExperience),
        });
      } else {
        setError(result.error ?? t('errDoctorNotFound'));
      }
    });

    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  const selectedClinic = clinics.find((clinic) => clinic.id === form.clinicId);
  // A doctor can only practise a specialty their clinic actually offers.
  const availableSpecialties = selectedClinic
    ? specialties.filter((specialty) => selectedClinic.specialties.includes(specialty.slug))
    : [];

  function changeClinic(clinicId: string) {
    const clinic = clinics.find((item) => item.id === clinicId);
    const keepsSpecialty = clinic?.specialties.includes(form.specialtySlug) ?? false;

    setForm((previous) => ({
      ...previous,
      clinicId,
      specialtySlug: keepsSpecialty ? previous.specialtySlug : '',
    }));
  }

  function validate(): boolean {
    const errors: FieldErrors = {};
    const years = Number(form.yearsOfExperience);

    if (!form.name.trim()) errors.name = t('errDoctorNameRequired');
    if (!form.clinicId) errors.clinicId = t('errDoctorClinicRequired');
    if (!form.specialtySlug) errors.specialtySlug = t('errDoctorSpecialtyRequired');
    if (form.yearsOfExperience === '' || Number.isNaN(years) || years < 0 || years > 70) {
      errors.yearsOfExperience = t('errDoctorExperienceInvalid');
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!validate()) return;

    const dto: DoctorInputDTO = {
      name: form.name,
      clinicId: form.clinicId,
      specialtySlug: form.specialtySlug,
      yearsOfExperience: Number(form.yearsOfExperience),
    };

    setIsSubmitting(true);
    const result = isEditing ? await updateDoctor(id!, dto) : await createDoctor(dto);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/admin/medici');
      return;
    }
    setError(result.error ?? t('errSaveChangesGeneric'));
  }

  if (isLoading) {
    return <Spinner className="py-24" label={t('loading')} />;
  }

  const clinicOptions = clinics.map((clinic) => ({ value: clinic.id, label: clinic.name }));
  const specialtyOptions = availableSpecialties.map((specialty) => ({
    value: specialty.slug,
    label: specialty.name,
  }));

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white">
          {isEditing ? t('editDoctorTitle') : t('addDoctor')}
        </h1>
        <p className="mt-1.5 text-surface-500 dark:text-surface-400">{t('adminDoctorFormHint')}</p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6">
        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm font-medium text-danger-600 dark:bg-danger-500/10 dark:text-danger-400"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <FormField
          label={t('fieldDoctorName')}
          value={form.name}
          error={fieldErrors.name}
          placeholder="Dr. Ana Popescu"
          onChange={(event) => update('name', event.target.value)}
        />

        <div>
          <span className="label">{t('clinic')}</span>
          <Dropdown
            label={t('clinic')}
            value={form.clinicId}
            options={clinicOptions}
            placeholder={t('selectClinicPlaceholder')}
            onChange={changeClinic}
          />
          {fieldErrors.clinicId && (
            <p className="mt-1.5 text-xs font-medium text-danger-600">{fieldErrors.clinicId}</p>
          )}
        </div>

        <div>
          <span className="label">{t('specialty')}</span>
          {form.clinicId && specialtyOptions.length === 0 ? (
            <p className="rounded-lg border border-dashed border-surface-200 px-3.5 py-2.5 text-sm text-surface-500 dark:border-surface-700 dark:text-surface-400">
              {t('clinicHasNoSpecialties')}
            </p>
          ) : (
            <Dropdown
              label={t('specialty')}
              value={form.specialtySlug}
              options={specialtyOptions}
              placeholder={
                form.clinicId ? t('selectSpecialtyPlaceholder') : t('selectClinicFirstPlaceholder')
              }
              onChange={(value) => update('specialtySlug', value)}
            />
          )}
          {fieldErrors.specialtySlug && (
            <p className="mt-1.5 text-xs font-medium text-danger-600">
              {fieldErrors.specialtySlug}
            </p>
          )}
        </div>

        <FormField
          label={t('fieldYearsOfExperience')}
          type="number"
          min={0}
          max={70}
          value={form.yearsOfExperience}
          error={fieldErrors.yearsOfExperience}
          onChange={(event) => update('yearsOfExperience', event.target.value)}
        />

        <div className="flex justify-end gap-3 border-t border-surface-200 pt-5 dark:border-surface-800">
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin/medici')}>
            {t('cancel')}
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting && <Loader2 size={17} className="animate-spin" />}
            {t('saveDoctor')}
          </button>
        </div>
      </form>
    </div>
  );
}
