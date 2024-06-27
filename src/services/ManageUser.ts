import {
  AssignCentersToFacilitatorListParam,
  FacilitatorListParam,
} from '@/utils/Interfaces';
import { post } from './RestClient';

export const getFacilitatorList = async ({
  limit,
  page,
  filters,
}: FacilitatorListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/list`;
  try {
    const response = await post(apiUrl, { limit, page, filters });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort list', error);
    throw error;
  }
};

export const assignCentersToFacilitator = async ({
  userId,
  cohortId,
}: AssignCentersToFacilitatorListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohortmember/bulkCreate`;
  try {
    const response = await post(apiUrl, { userId, cohortId });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort list', error);
    throw error;
  }
};
