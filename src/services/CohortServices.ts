import { CohortListParam, GetCohortSearchParams } from '@/utils/Interfaces';
import { get, post } from './RestClient';
import { BulkCreateCohortMembersRequest } from '@/utils/Interfaces';
import { Status } from '@/utils/app.constant';

export const cohortList = async ({
  limit,
  offset,
  filters,
}: CohortListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/search`;
  try {
    const response = await post(apiUrl, { limit, offset, filters });
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
  filters: { [key: string]: string } = {},
  isCustomFields: boolean = false
): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/mycohorts/${userId}?children=true`;
  const filterParams = new URLSearchParams(filters).toString();
  if (filterParams) {
    apiUrl += `&${filterParams}`;
  }
  try {
    const response = await get(apiUrl);
    if(isCustomFields)
    {
      return response?.data?.result;

    }
    if (response?.data?.result?.length) {
      let res = response?.data?.result;
      res = res.filter((block: any) => {
        if (
          block?.cohortMemberStatus === Status.ACTIVE &&
          block?.cohortStatus === Status.ACTIVE
        ) {
          return block;
        }
      });
      return res;
    }
    return response?.data?.result;

  } catch (error) {
    console.error('Error in getting cohort details', error);
    // throw error;
  }
};

export const bulkCreateCohortMembers = async (payload: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohortmember/bulkCreate`;
  try {
    const response = await post(apiUrl, payload);
    return response.data;
  } catch (error) {
    console.error('Error in bulk creating cohort members', error);
    throw error;
  }
};

export const getCohortSearch = async ({
  cohortId,
  limit = 20,
  offset = 0,
}: GetCohortSearchParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/search`;

  const data = {
    filters: {
      cohortId,
    },
    limit,
    offset,
  };

  try {
    const response = await post(apiUrl, data);
    return response?.data;
  } catch (error) {
    console.error('Error in searching Cohorts', error);
    return error;
  }
};
