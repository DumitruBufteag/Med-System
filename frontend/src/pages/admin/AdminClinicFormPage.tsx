import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { City, ClinicInputDTO, ClinicType, WorkingHours } from '../../types';
import { CITIES, CLINIC_TYPES } from '../../types';
import { createClinic, getClinicById, updateClinic } from '../../services';
import { useClinics } from '../../contexts/ClinicContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getClinicTypeLabel } from '../../lib/utils';
import FormField from '../../components/ui/FormField';
import Dropdown from '../../components/ui/Dropdown';
import Spinner from '../../components/ui/Spinner';

interface FormState {
  name: string;
  type: ClinicType;
  city: City;
  address: string;
  phone: string;
  website: string;
  description: string;
  consultationFrom: string;
  hasEmergency: boolean;
  acceptsInsurance: boolean;
  specialties: string[];
  brandColor: string;
  alwaysOpen: boolean;
  weekdayStart: string;
  weekdayEnd: string;
  saturdayEnabled: boolean;
  saturdayStart: string;
  saturdayEnd: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  type: 'medical_center',
  city: 'Chișinău',
  address: '',
  phone: '',
  website: '',
  description: '',
  consultationFrom: '',
  hasEmergency: false,
  acceptsInsurance: true,
  specialties: [],
  brandColor: '#0e86ad',
  alwaysOpen: false,
  weekdayStart: '08:00',
  weekdayEnd: '18:00',
  saturdayEnabled: false,
  saturdayStart: '09:00',
  saturdayEnd: '14:00',
};

/** Rebuilds the form's simplified schedule from an existing clinic's working hours. */
function scheduleFromWorkingHours(workingHours: WorkingHours): Partial<FormState> {
  if (workingHours.alwaysOpen) return { alwaysOpen: true };

  const weekday = workingHours.periods?.find((period) => period.days.includes(1));
  const saturday = workingHours.periods?.find((period) => period.days.includes(6));

  return {
    alwaysOpen: false,
    weekdayStart: weekday?.start ?? EMPTY_FORM.weekdayStart,
    weekdayEnd: weekday?.end ?? EMPTY_FORM.weekdayEnd,
    saturdayEnabled: Boolean(saturday),
    saturdayStart: saturday?.start ?? EMPTY_FORM.saturdayStart,
    saturdayEnd: saturday?.end ?? EMPTY_FORM.saturdayEnd,
  };
}

interface FieldErrors {
  name?: string;
  address?: string;
  phone?: string;
  description?: string;
  consultationFrom?: string;
  specialties?: string;
}

export default function AdminClinicFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { specialties, refresh } = useClinics();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isCurrent = true;

    void getClinicById(id).then((result) => {
      if (!isCurrent) return;
      setIsLoading(false);

      if (result.success && result.data) {
        const clinic = result.data;
        setForm({
          ...EMPTY_FORM,
          name: clinic.name,
          type: clinic.type,
          city: clinic.city,
          address: clinic.address,
          phone: clinic.phone,
          website: clinic.website ?? '',
          description: clinic.description,
          consultationFrom: String(clinic.consultationFrom),
          hasEmergency: clinic.hasEmergency,
          acceptsInsurance: clinic.acceptsInsurance,
          specialties: clinic.specialties,
          brandColor: clinic.brandColor,
          ...scheduleFromWorkingHours(clinic.workingHours),
        });
      } else {
        setError(result.error ?? t('errClinicNotFound'));
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

  function toggleSpecialty(slug: string) {
    setForm((previous) => ({
      ...previous,
      specialties: previous.specialties.includes(slug)
        ? previous.specialties.filter((item) => item !== slug)
        : [...previous.specialties, slug],
    }));
  }

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!form.name.trim()) errors.name = t('errClinicNameRequired');
    if (!form.address.trim()) errors.address = t('errClinicAddressRequired');
    if (!form.phone.trim()) errors.phone = t('errClinicPhoneRequired');
    if (!form.description.trim()) errors.description = t('errClinicDescriptionRequired');
    if (!form.consultationFrom || Number(form.consultationFrom) <= 0) {
      errors.consultationFrom = t('errClinicPriceRequired');
    }
    if (form.specialties.length === 0) errors.specialties = t('errClinicSpecialtiesRequired');

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!validate()) return;

    const dto: ClinicInputDTO = {
      name: form.name,
      type: form.type,
      city: form.city,
      address: form.address,
      phone: form.phone,
      website: form.website || undefined,
      description: form.description,
      consultationFrom: Number(form.consultationFrom),
      hasEmergency: form.hasEmergency,
      acceptsInsurance: form.acceptsInsurance,
      specialties: form.specialties,
      brandColor: form.brandColor,
      schedule: {
        alwaysOpen: form.alwaysOpen,
        weekdayStart: form.weekdayStart,
        weekdayEnd: form.weekdayEnd,
        saturdayEnabled: form.saturdayEnabled,
        saturdayStart: form.saturdayStart,
        saturdayEnd: form.saturdayEnd,
      },
    };

    setIsSubmitting(true);
    const result = isEditing ? await updateClinic(id!, dto) : await createClinic(dto);
    setIsSubmitting(false);

    if (result.success) {
      await refresh();
      navigate('/admin/clinici');
      return;
    }
    setError(result.error ?? t('errSaveChangesGeneric'));
  }

  const typeOptions = CLINIC_TYPES.map((type) => ({ value: type, label: getClinicTypeLabel(type, t) }));
  const cityOptions = CITIES.map((city) => ({ value: city, label: city }));

  if (isLoading) {
    return <Spinner className="py-24" label={t('loading')} />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white">
          {isEditing ? t('editClinicTitle') : t('addClinic')}
        </h1>
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
          label={t('fieldClinicName')}
          value={form.name}
          error={fieldErrors.name}
          onChange={(event) => update('name', event.target.value)}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <span className="label">{t('clinicType')}</span>
            <Dropdown
              label={t('clinicType')}
              value={form.type}
              options={typeOptions}
              onChange={(value) => update('type', value as ClinicType)}
            />
          </div>
          <div>
            <span className="label">{t('city')}</span>
            <Dropdown
              label={t('city')}
              value={form.city}
              options={cityOptions}
              onChange={(value) => update('city', value as City)}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label={t('address')}
            value={form.address}
            error={fieldErrors.address}
            onChange={(event) => update('address', event.target.value)}
          />
          <FormField
            label={t('phone')}
            value={form.phone}
            error={fieldErrors.phone}
            placeholder="+373 22 000 000"
            onChange={(event) => update('phone', event.target.value)}
          />
        </div>

        <FormField
          label={t('website')}
          value={form.website}
          placeholder="https://…"
          onChange={(event) => update('website', event.target.value)}
        />

        <div>
          <label htmlFor="clinic-description" className="label">
            {t('fieldDescription')}
          </label>
          <textarea
            id="clinic-description"
            rows={4}
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            className="input resize-none"
          />
          {fieldErrors.description && (
            <p className="mt-1.5 text-xs font-medium text-danger-600">{fieldErrors.description}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label={t('fieldConsultationPrice')}
            type="number"
            min={0}
            value={form.consultationFrom}
            error={fieldErrors.consultationFrom}
            onChange={(event) => update('consultationFrom', event.target.value)}
          />
          <div>
            <label htmlFor="clinic-brand-color" className="label">
              {t('fieldBrandColor')}
            </label>
            <input
              id="clinic-brand-color"
              type="color"
              value={form.brandColor}
              onChange={(event) => update('brandColor', event.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-surface-200 bg-white p-1 dark:border-surface-700 dark:bg-surface-900"
            />
          </div>
        </div>

        <div>
          <span className="label">{t('fieldSpecialties')}</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {specialties.map((specialty) => (
              <label
                key={specialty.slug}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-surface-200 px-3 py-2 text-sm text-surface-700 dark:border-surface-700 dark:text-surface-300"
              >
                <input
                  type="checkbox"
                  checked={form.specialties.includes(specialty.slug)}
                  onChange={() => toggleSpecialty(specialty.slug)}
                  className="h-4 w-4 cursor-pointer rounded border-surface-300 accent-primary-600 dark:border-surface-600"
                />
                {specialty.name}
              </label>
            ))}
          </div>
          {fieldErrors.specialties && (
            <p className="mt-1.5 text-xs font-medium text-danger-600">{fieldErrors.specialties}</p>
          )}
        </div>

        <fieldset className="space-y-2.5 border-t border-surface-200 pt-4 dark:border-surface-800">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-surface-700 dark:text-surface-300">
            <input
              type="checkbox"
              checked={form.hasEmergency}
              onChange={(event) => update('hasEmergency', event.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-surface-300 accent-primary-600 dark:border-surface-600"
            />
            {t('fieldHasEmergency')}
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-surface-700 dark:text-surface-300">
            <input
              type="checkbox"
              checked={form.acceptsInsurance}
              onChange={(event) => update('acceptsInsurance', event.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-surface-300 accent-primary-600 dark:border-surface-600"
            />
            {t('insuranceAccepted')}
          </label>
        </fieldset>

        <fieldset className="space-y-3 border-t border-surface-200 pt-4 dark:border-surface-800">
          <legend className="label mb-1">{t('schedule')}</legend>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-surface-700 dark:text-surface-300">
            <input
              type="checkbox"
              checked={form.alwaysOpen}
              onChange={(event) => update('alwaysOpen', event.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-surface-300 accent-primary-600 dark:border-surface-600"
            />
            {t('alwaysOpenLabel')}
          </label>

          {!form.alwaysOpen && (
            <>
              <div>
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  {t('weekdayHoursLabel')}
                </span>
                <div className="mt-1.5 flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-sm text-surface-500">
                    {t('fromLabel')}
                    <input
                      type="time"
                      value={form.weekdayStart}
                      onChange={(event) => update('weekdayStart', event.target.value)}
                      className="input py-1.5"
                    />
                  </label>
                  <label className="flex items-center gap-1.5 text-sm text-surface-500">
                    {t('toLabel')}
                    <input
                      type="time"
                      value={form.weekdayEnd}
                      onChange={(event) => update('weekdayEnd', event.target.value)}
                      className="input py-1.5"
                    />
                  </label>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                <input
                  type="checkbox"
                  checked={form.saturdayEnabled}
                  onChange={(event) => update('saturdayEnabled', event.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-surface-300 accent-primary-600 dark:border-surface-600"
                />
                {t('saturdayEnabledLabel')}
              </label>

              {form.saturdayEnabled && (
                <div>
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                    {t('saturdayHoursLabel')}
                  </span>
                  <div className="mt-1.5 flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-sm text-surface-500">
                      {t('fromLabel')}
                      <input
                        type="time"
                        value={form.saturdayStart}
                        onChange={(event) => update('saturdayStart', event.target.value)}
                        className="input py-1.5"
                      />
                    </label>
                    <label className="flex items-center gap-1.5 text-sm text-surface-500">
                      {t('toLabel')}
                      <input
                        type="time"
                        value={form.saturdayEnd}
                        onChange={(event) => update('saturdayEnd', event.target.value)}
                        className="input py-1.5"
                      />
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </fieldset>

        <div className="flex justify-end gap-3 border-t border-surface-200 pt-5 dark:border-surface-800">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/clinici')}
          >
            {t('cancel')}
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting && <Loader2 size={17} className="animate-spin" />}
            {t('saveClinic')}
          </button>
        </div>
      </form>
    </div>
  );
}
