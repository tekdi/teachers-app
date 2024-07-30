import { CohortListParam } from '@/utils/Interfaces';
import { get, post } from './RestClient';
import { BulkCreateCohortMembersRequest } from '@/utils/Interfaces';

export const cohortList = async ({
  limit,
  page,
  filters,
}: CohortListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/search`;
  try {
    const response = await post(apiUrl, { limit, page, filters });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort list', error);
    throw error;
  }
};

export const getCohortDetails = async (cohortId: string): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/cohortHierarchy/${cohortId}`;
  try {
    const response = await get(apiUrl);
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort details', error);
    // throw error;
  }
};

export const getCohortList = async (
  userId: string,
  filters: { [key: string]: string } = {}
): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/mycohorts/${userId}?children=true`;
  const filterParams = new URLSearchParams(filters).toString();
  if (filterParams) {
    apiUrl += `&${filterParams}`;
  }
  try {
    const response = await get(apiUrl);
    return response?.data?.result;
  } catch (error) {
    console.error('Error in getting cohort details', error);
    // throw error;
  }
};

export const bulkCreateCohortMembers = async (
  payload: BulkCreateCohortMembersRequest
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohortmember/bulkCreate`;
  try {
    const response = await post(apiUrl, payload);
    return response.data;
  } catch (error) {
    console.error('Error in bulk creating cohort members', error);
    throw error;
  }
};
