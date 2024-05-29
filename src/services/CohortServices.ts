import { cohortListParam } from '@/utils/Interfaces';
import { post } from './RestClient';

export const cohortList = async ({
  limit,
  page,
  filters,
}: cohortListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/search`;
  try {
    const response = await post(apiUrl, { limit, page, filters });
    return response?.data;
  } catch (error) {
    console.error('error in getting cohort list', error);
    throw error;
  }
};
