import {
  CohortListParam,
  GetCohortSearchParams,
  StateListParam,
  CenterListParam,
} from '@/utils/Interfaces';
import { Status, CohortTypes } from '@/utils/app.constant';
import { get, post } from './RestClient';

export const cohortList = async ({
  limit,
  offset,
  filters,
}: CohortListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/cohort/search`;
  try {
    const response = await post(apiUrl, { limit, offset, filters });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort list', error);
    throw error;
  }
};

export const getCohortDetails = async (cohortId: string): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/cohort/cohortHierarchy/${cohortId}`;
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
  let apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/cohort/mycohorts/${userId}?children=true`;
  const filterParams = new URLSearchParams(filters).toString();
  if (filterParams) {
    apiUrl += `&${filterParams}`;
  }
  try {
    const response = await get(apiUrl);
    if (isCustomFields) {
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
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/cohortmember/bulkCreate`;
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
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/cohort/search`;

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

export const getStateBlockDistrictList = async ({
  controllingfieldfk,
  fieldName,
  limit,
  offset,
  optionName,
  sort,
}: StateListParam): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/fields/options/read`;

  const requestBody: StateListParam = {
    fieldName,
    limit,
    offset,
    sort,
  };
  if (controllingfieldfk) {
    requestBody.controllingfieldfk = controllingfieldfk;
  }
  if (optionName) {
    requestBody.optionName = optionName;
  }
  try {
    const response = await post(apiUrl, requestBody);
    return response?.data;
  } catch (error) {
    console.error('Error in fetching state, block, and district list', error);
    throw error;
  }
};

export const searchFields = async ({
  limit,
  page,
  filters,
}: {
  limit: number;
  page: number;
  filters: { context: string; contextType: string };
}): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/fields/search`;

  const requestBody = {
    limit,
    page,
    filters,
  };

  try {
    const response = await post(apiUrl, requestBody);
    return response?.data;
  } catch (error) {
    console.error('Error in fetching fields via search API', error);
    throw error;
  }
};

export const formatedDistricts = async () => {
  const adminState = JSON.parse(
    localStorage.getItem('adminInfo') || '{}'
  ).customFields.find((field: any) => field.label === 'STATES');
  try {
    const reqParams = {
      limit: 0,
      offset: 0,
      filters: {
        // name: searchKeyword,
        states: adminState.code,
        type: CohortTypes.DISTRICT,
        status: ['active'],
      },
      sort: ['name', 'asc'],
    };

    const response = await cohortList(reqParams);

    const cohortDetails = response?.results?.cohortDetails || [];
    const object = {
      controllingfieldfk: adminState.code,
      fieldName: 'districts',
    };

    const optionReadResponse = await getStateBlockDistrictList(object);
    const result = optionReadResponse?.result?.values;
    const uniqueResults = result.reduce(
      (acc: any, current: any) => {
        const isDuplicate = acc.some(
          (item: any) => item.label === current.label
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      },
      [] as typeof result
    );

    const matchedCohorts = uniqueResults
      ?.map((value: any) => {
        const cohortMatch = cohortDetails.find(
          (cohort: any) =>
            cohort?.name?.toLowerCase() === value?.label?.toLowerCase()
        );
        return cohortMatch ? { ...value } : null;
      })
      .filter(Boolean);

    return matchedCohorts;
  } catch (error) {
    console.error('Error in getting District Details', error);
    return error;
  }
};

export const formatedBlocks = async (districtCode: string) => {
  const adminState = JSON.parse(
    localStorage.getItem('adminInfo') || '{}'
  ).customFields.find((field: any) => field.label === 'STATES');
  try {
    const reqParams = {
      limit: 0,
      offset: 0,
      filters: {
        // name: searchKeyword,
        country: adminState?.code,
        states: districtCode,
        type: CohortTypes.CITY,
        status: ['active'],
      },
      sort: ['name', 'asc'],
    };

    const response = await cohortList(reqParams);
    const cohortDetails = response?.results?.cohortDetails || [];

    const object = {
      controllingfieldfk: districtCode,
      fieldName: 'city',
    };
    const optionReadResponse = await getStateBlockDistrictList(object);
    const result = optionReadResponse?.result?.values;

    const matchedCohorts = result
      ?.map((value: any) => {
        const cohortMatch = cohortDetails.find(
          (cohort: any) =>
            cohort?.name?.toLowerCase() === value?.label?.toLowerCase()
        );
        // Include cohortId if the match is found
        return cohortMatch
          ? { ...value, cohortId: cohortMatch.cohortId }
          : null;
      })
      .filter(Boolean);

    return matchedCohorts;
  } catch (error) {
    console.log('Error in getting Channel Details', error);
    return error;
  }
};

export const getCenterList = async ({
  filters,
  limit,
  offset,
}: CenterListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/cohort/search`;
  try {
    const response = await post(apiUrl, {
      filters,
      limit,
      offset,
    });
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};
