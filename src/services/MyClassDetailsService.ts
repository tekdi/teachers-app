import { Role, Status } from '@/utils/app.constant';
import {
  CohortMemberList,
  UpdateCohortMemberStatusParams,
  UserList,
} from '../utils/Interfaces';
import { post, put } from './RestClient';

const fetchCohortMemberList = async ({
  limit,
  page,
  filters,
}: CohortMemberList): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohortmember/list`;
  try {
    const response = await post(apiUrl, {
      limit,
      offset: page,
      filters,
    });
    console.log('data', response?.data);
    return response?.data;
  } catch (error) {
    console.error('error in cohort member list API ', error);
    // throw error;
  }
};

export const getMyUserList = async ({
  limit,
  page,
  filters,
  fields,
}: UserList): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/list`;
  try {
    const response = await post(apiUrl, {
      limit,
      offset: page,
      filters,
      fields,
    });
    console.log('data', response?.data);
    return response?.data;
  } catch (error) {
    console.error('error in cohort member list API ', error);
    // throw error;
  }
};

export const getMyCohortMemberList = async ({
  limit,
  page,
  filters,
}: CohortMemberList): Promise<any> => {
  const studentFilters = {
    role: Role.STUDENT,
    status: [Status.DROPOUT, Status.ACTIVE],
    ...filters,
  };
  return fetchCohortMemberList({ limit, page, filters: studentFilters });
};

export const getMyCohortFacilitatorList = async ({
  limit,
  page,
  filters,
}: CohortMemberList): Promise<any> => {
  const studentFilters = {
    ...filters,
    role: Role.TEACHER,
    status: [Status.DROPOUT, Status.ACTIVE],
  };
  return fetchCohortMemberList({ limit, page, filters: studentFilters });
};

export const getFacilitatorList = async ({
  limit,
  page,
  filters,
}: CohortMemberList): Promise<any> => {
  return fetchCohortMemberList({ limit, page, filters });
};

export const updateCohortMemberStatus = async ({
  memberStatus,
  statusReason,
  membershipId,
}: UpdateCohortMemberStatusParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohortmember/update/${membershipId}`;
  try {
    const response = await put(apiUrl, {
      status: memberStatus,
      statusReason,
    });
    console.log('data', response?.data);
    return response?.data;
  } catch (error) {
    console.error('error in attendance report api ', error);
    // throw error;
  }
};
