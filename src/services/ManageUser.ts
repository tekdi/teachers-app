import {
  AssignCentersToFacilitatorListParam,
  FacilitatorDeleteUserData,
  FacilitatorListParam,
} from '@/utils/Interfaces';
import { patch, post, put } from './RestClient';

export const getFacilitatorList = async ({
  limit,
  page,
  filters,
}: FacilitatorListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/list`;
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
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/cohortmember/bulkCreate`;
  try {
    const response = await post(apiUrl, { userId, cohortId });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort list', error);
    throw error;
  }
};

export const updateFacilitator = async (
  userId: string,
  userData: FacilitatorDeleteUserData
): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/update/${userId}`;
  try {
    const response = await patch(apiUrl, { userData });
    return response.data.result;
  } catch (error) {
    console.error('Error in updating Facilitator', error);
    throw error;
  }
};

export const renameFacilitator = async (
  userId: string,
  name: string
): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/cohort/update/${userId}`;
  try {
    const response = await put(apiUrl, { name });
    return response.data.result;
  } catch (error) {
    console.error('Error in updating Facilitator', error);
    throw error;
  }
};
