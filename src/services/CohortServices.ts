import { CohortListParam } from '@/utils/Interfaces';
import { get, post } from './RestClient';
import { BulkCreateCohortMembersRequest } from '@/utils/Interfaces';
import { Status } from '@/utils/app.constant';
export interface cohortListFilter {
  type: string;
  status: string[];
  states: string;
  districts: string;
  blocks: string;
}

export interface cohortListData {
  limit?: Number;
  offset?: Number;
  filter?: any;
  filters?: any;
}
export interface UpdateCohortMemberStatusParams {
  memberStatus: string;
  statusReason?: string;
  membershipId: string | number;
}


export const getEligibleUsers = async ({
  cohortId,
  limit,
  offset,
  filters
}: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/eligible`;
  try {
    const response = await post(apiUrl,{
    cohortId: cohortId,
    offset,
    limit,
    filters: filters
  })
    return response?.data?.result;
  } catch (error) {
    console.error("error in getting user list", error);
    throw error;
  }
};


export const cohortList = async ({
  limit,
  offset,
  filters,
}:any): Promise<any> => {
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

export const searchCohortList = async (data: cohortListData): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/search`;
  if (!data.filters) {
    data.filters = { status: ["active"] };
  } else if (!data.filters.status) {
    data.filters.status = ["active"];
  }
  try {
    const response = await post(apiUrl, data);
    return response?.data?.result;
  } catch (error) {
    console.error("Error in Getting cohort List Details", error);
    return error;
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
      return res
    }
    return response?.data?.result;
  } catch (error) {
    console.error('Error in getting cohort details', error);
    // throw error;
  }
};

export const addCohortMembers = async (payload: any): Promise<any> => {
   if (!payload.selectAll) {
      const req = {
        userId: payload.userIds,
        cohortId: [payload.cohortId]
      };
      return await bulkCreateCohortMembers(req);  
  } else {
  
    const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/addMembersByfilter`;
    try {
      const req = {
        filters: payload.filters,
        cohortId:payload.cohortId,
      };
      const response = await post(apiUrl, req);
      return response;  
    } catch (error) {
    console.error("Error in adding cohort members", error);
    throw error;
    }
    }
};

export const bulkCreateCohortMembers = async (payload: any): Promise<any>  => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohortmember/bulkCreate`;
  try {
    const response = await post(apiUrl, payload);
    return response.data;
  } catch (error) {
    console.error("Error in bulk creating cohort members", error);
    throw error;
  }
};

export const getSchoolNames = async (): Promise<Record<string, {}>> => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const schoolNamesStr = localStorage.getItem('schoolClusterNames');
    if (schoolNamesStr) {
      return JSON.parse(schoolNamesStr);
    } else {
      let schoolFilters = {
        limit: 0, offset: 0, filters: { type: "SCHOOL", status: ["active"] },
      };
      const schoolRes = await cohortList(schoolFilters);

      let clusterFilters = {
        limit: 0, offset: 0, filters: { type: "CLUSTER", status: ["active"] },
      };
      const clusterRes = await cohortList(clusterFilters);

       const schoolMap: Record<string, {code:string; name: string; clusterName: string }> = {};
       const schools = schoolRes?.results?.cohortDetails || [];
       const clusters = clusterRes?.results?.cohortDetails || [];
      if (!schools.length || !clusters.length) return schoolMap;
      
       schools.forEach((school: any) => {
          const cluster = clusters.find((c: any) => c.cohortId === school.parentId);
          const schoolObj: any = {
            code: school.cohortId,
            name: school.name,
            clusterName: cluster.name,
          };

      // Add latitude and longitude only if customFields and the keys exist (by name)
      if (school?.customFields) {
        const latitudeField:any = Object.values(school.customFields).find(
          (field: any) => field.fieldId === 'fd466e4e-193b-4d01-863d-cf861d8d5bf4'
        );
        const longitudeField:any = Object.values(school.customFields).find(
          (field: any) => field.fieldId === 'fe466e4e-193b-4d01-863d-cf861d8d5bf5'
        );

        if (latitudeField && longitudeField) {
          schoolObj.latitude = latitudeField.value;
          schoolObj.longitude = longitudeField.value;
        }
      }

      schoolMap[school.cohortId] = schoolObj;
      });

      if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('schoolClusterNames', JSON.stringify(schoolMap));
      }
      return schoolMap
    }
  }
  return {};
};

export const getClusterNames = async (): Promise<Record<string, string>> => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const clusterNamesStr = localStorage.getItem('clusterNames');
    if (clusterNamesStr) {
      return JSON.parse(clusterNamesStr);
    } else {
      let data = {
        limit: 0,
        offset: 0,
        filters: { type: "CLUSTER", status: ["active"] },
      };
      const clusters = await cohortList(data);
       const clusterMap: Record<string, string> = {};
       clusters.forEach((school: any) => {
          clusterMap[school.cohortId] = school.name;
      });

      if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('clusterNames', JSON.stringify(clusterMap));
      }
      return clusterMap
    }
  }
  return {};
};
