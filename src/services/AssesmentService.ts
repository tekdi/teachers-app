import {
  AssessmentListParam,
  GetDoIdServiceParam,
  IAssessmentStatusOptions,
} from '@/utils/Interfaces';
import { post } from './RestClient';

export const getAssessmentList = async ({
  sort,
  pagination,
  filters,
}: AssessmentListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_TRACKING_API_URL}/tracking/v1/list`;
  try {
    const response = await post(apiUrl, { pagination, filters, sort });
    return response?.data;
  } catch (error) {
    console.error('error in getting Assessment List Service list', error);

    return error;
  }
};

export const getDoIdForAssessmentDetails = async ({
  filters,
}: GetDoIdServiceParam): Promise<any> => {
  const apiUrl: string =
    'https://sunbirdsaas.com/api/content/v1/search?orgdetails=orgName%2Cemail&licenseDetails=name%2Cdescription%2Curl';

  const data = {
    request: {
      filters: {
        program: filters.program,
        se_boards: filters.se_boards,
        // subject: filters.subject,
        assessment1: filters.assessment1,
      },
    },
  };

  try {
    console.log('Request data', apiUrl, data);
    const response = await post(apiUrl, data);
    return response?.data;
  } catch (error) {
    console.error('Error in getDoIdForAssessmentDetails Service', error);
    return error;
  }
};

export const getAssessmentStatus = async (body: IAssessmentStatusOptions) => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_TRACKING_API_URL}/v1/tracking/assessment/search/status`;
  try {
    const response = await post(apiUrl, body);
    return response?.data?.data;
  } catch (error) {
    console.error('error in getting Assessment Status Service list', error);

    return error;
  }
};
