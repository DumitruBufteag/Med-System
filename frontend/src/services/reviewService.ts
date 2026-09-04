import type { Review, ServiceResponse } from '../types';
import { mockReviews } from '../data/mockData';
import { extractServiceError } from './apiMappers';
import { getApiClient } from './httpClient';
import { USE_MOCK_DATA, mockDelay } from './config';
import { translate } from '../i18n';
import { loadClinics } from './clinicService';

/** Reviews are addressed by clinic slug, the same identifier used in the URL. */
export async function getReviewsByClinic(slug: string): Promise<ServiceResponse<Review[]>> {
  if (!slug) return { success: true, data: [] };

  if (USE_MOCK_DATA) {
    await mockDelay();
    const clinic = loadClinics().find((item) => item.slug === slug);
    const reviews = clinic
      ? mockReviews
          .filter((review) => review.clinicId === clinic.id)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      : [];
    return { success: true, data: reviews };
  }

  try {
    const response = await getApiClient().get(`/api/reviews/getByClinic/${slug}`);
    const items = Array.isArray(response.data) ? (response.data as Review[]) : [];
    return { success: true, data: items };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, translate('errLoadReviews')),
    };
  }
}
