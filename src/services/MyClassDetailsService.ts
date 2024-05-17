import { cohortMemberList } from '../utils/Interfaces';
import { post } from './RestClient';

export const getMyCohortMemberList = async ({
  limit,
  page,
  filters,
}: cohortMemberList): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohortmembers/search`;
  try {
    const response = await post(apiUrl, {
      limit,
      page,
      filters,
    });
    console.log('data', response?.data);
    return response?.data;
  } catch (error) {
    console.error('error in attendance report api ', error);
    throw error;
  }
};
