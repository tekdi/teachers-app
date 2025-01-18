import { Role } from '@/utils/app.constant';
import { URL_CONFIG } from '@/utils/url.config';
import axios from 'axios';
import {
  GetSolutionDetailsParams,
  GetTargetedSolutionsParams,
  GetUserProjectStatusParams,
  GetUserProjectTemplateParams,
} from '../utils/Interfaces';
import { get } from './RestClient';

export const getTargetedSolutions = async ({
  subject,

  medium,
  class: className,
  board,
  courseType,
  entityId,
}: GetTargetedSolutionsParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_COURSE_PLANNER_API_URL}/solutions/targetedSolutions?type=improvementProject&currentScopeOnly=true`;
  const headers = {
    'X-auth-token': localStorage.getItem('token'),
  };

  const data = {
    subject,
    medium,
    class: className,
    board,
    courseType,
    // entityId
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });
    return response?.data;
  } catch (error) {
    console.error('Error in getting Targeted Solutions', error);
    return error;
  }
};
interface GetUserProjectDetailsParams {
  id: string;
}

export const getUserProjectDetails = async ({
  id,
}: GetUserProjectDetailsParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_COURSE_PLANNER_API_URL}/userProjects/details/${id}`;

  const headers = {
    'X-auth-token': localStorage.getItem('token'),
  };

  try {
    const response = await axios.post(apiUrl, {}, { headers });
    return response?.data;
  } catch (error) {
    console.error('Error in getting User Project Details', error);
    return error;
  }
};

export const getSolutionDetails = async ({
  id,
  role,
}: GetSolutionDetailsParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_COURSE_PLANNER_API_URL}/solutions/details/${id}`;

  const headers = {
    'X-auth-token': localStorage.getItem('token'),
  };

  const data = {
    role,
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });
    return response?.data;
  } catch (error) {
    console.error('Error in getting Solution Details', error);
    return error;
  }
};

export const getUserProjectTemplate = async ({
  templateId,
  solutionId,
  role,
  cohortId,
}: GetUserProjectTemplateParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_COURSE_PLANNER_API_URL}/userProjects/details?templateId=${templateId}&solutionId=${solutionId}`;

  const headers = {
    'X-auth-token': localStorage.getItem('token'),
  };

  const data = {
    role,
    // acl: {
    //   visibility: "ALL",
    //   users: [],
    //   scope: {}
    // },
    // entityId: cohortId
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });
    return response?.data;
  } catch (error) {
    console.error('Error in getting User Project Details', error);
    throw error;
  }
};

export const UserStatusDetails = async ({
  data,
  id,
  lastDownloadedAt,
}: GetUserProjectStatusParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_COURSE_PLANNER_API_URL}/userProjects/sync/${id}?lastDownloadedAt=${encodeURIComponent(lastDownloadedAt)}`;

  const headers = {
    'x-auth-token': localStorage.getItem('token'),
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });
    return response?.data;
  } catch (error) {
    console.error('Error in getting User Project Details', error);
    return error;
  }
};

export const fetchCourseIdFromSolution = async (
  solutionId: string,
  cohortId: string
): Promise<boolean> => {
  try {
    const solutionResponse = await getSolutionDetails({
      id: solutionId,
      role: Role.TEACHER,
    });

    const externalId = solutionResponse?.result?.externalId;
    await getUserProjectTemplate({
      templateId: externalId,
      solutionId,
      role: Role.TEACHER,
      cohortId,
    });

    return true;
  } catch (error) {
    console.error('Error fetching solution details:', error);
    throw error;
  }
};

export const getContentHierarchy = async ({
  doId,
}: {
  doId: string;
}): Promise<any> => {
  const apiUrl: string = `${URL_CONFIG.API.CONTENT_HIERARCHY}/${doId}`;

  try {
    const response = await get(apiUrl);
    return response;
  } catch (error) {
    console.error('Error in getContentHierarchy Service', error);
    throw error;
  }
};
