import { CoursePlanner, GetSolutionDetailsParams, GetTargetedSolutionsParams, GetUserProjectTemplateParams } from '../utils/Interfaces';
import axios from 'axios';

export const getCoursePlanner = (): CoursePlanner[] => {
  // TODO: Add API call here

  const CoursePlannerService: CoursePlanner[] = [
    // { id: 1, subject: 'Mathematics', circular: 10 },
    // { id: 2, subject: 'Science', circular: 50 },
    // { id: 3, subject: 'History', circular: 30 },
    // { id: 4, subject: 'Geography', circular: 60 },
    // { id: 5, subject: 'Marathi', circular: 90 },
    { id: 6, subject: 'Marathi', circular: 0 },
    // { id: 7, subject: 'Social Science', circular: 80 },
  ];

  return CoursePlannerService;
};


export const getTargetedSolutions = async ({
  subject,
  state,
  role,
  medium,
  class: className,
  board,
  type,
}: GetTargetedSolutionsParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_SHIKSHALOKAM_API_URL}/solutions/targetedSolutions?type=improvementProject&currentScopeOnly=true`;

  const headers = {
    'X-auth-token': process.env.NEXT_PUBLIC_SHIKSHALOKAM_TOKEN,
    'Content-Type': 'application/json',
  };

  const data = {
    subject,
    state,
    role,
    medium,
    class: className,
    board,
    type,
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

export const getUserProjectDetails = async ({ id }: GetUserProjectDetailsParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_SHIKSHALOKAM_API_URL}/userProjects/details/${id}`;

  const headers = {
    'Authorization': process.env.NEXT_PUBLIC_SHIKSHALOKAM_TOKEN,
    'Content-Type': 'application/json',
    'x-auth-token': process.env.NEXT_PUBLIC_SHIKSHALOKAM_TOKEN,
    
  };

  try {
    const response = await axios.post(apiUrl, {}, { headers });
    return response?.data;
  } catch (error) {
    console.error('Error in getting User Project Details', error);
    return error;
  }
};


export const getSolutionDetails = async ({ id, role }: GetSolutionDetailsParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_SHIKSHALOKAM_API_URL}/solutions/details/${id}`;

  const headers = {
    'X-auth-token': process.env.NEXT_PUBLIC_SHIKSHALOKAM_TOKEN,
    'Content-Type': 'application/json',
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
}: GetUserProjectTemplateParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_SHIKSHALOKAM_API_URL}/userProjects/details?templateId=${templateId}&solutionId=${solutionId}`;

  const headers = {
    'X-auth-token': process.env.NEXT_PUBLIC_SHIKSHALOKAM_TOKEN,
    'Content-Type': 'application/json',
  };

  const data = {
    role,
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });
    return response?.data;
  } catch (error) {
    console.error('Error in getting User Project Details', error);
    throw error;
  }
};



