import {
  assesmentListServiceParam,
  gerDoIdServiceParam,
} from '@/utils/Interfaces';
import { post } from './RestClient';

export const AssesmentListService = async ({
  sort,
  pagination,
  filters,
}: assesmentListServiceParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_TRACKING_API_URL}/tracking-assessment/v1/list`;
  try {
    const response = await post(apiUrl, { pagination, filters, sort });
    return response?.data;
  } catch (error) {
    console.error('error in getting Assesment List Service list', error);

    return error;
  }
};

export const getDoIdForAssesmentDetails = async ({
  filters,
}: gerDoIdServiceParam): Promise<any> => {
  const apiUrl: string =
    'https://sunbirdsaas.com/api/content/v1/search?orgdetails=orgName%2Cemail&licenseDetails=name%2Cdescription%2Curl';

  const data = {
    request: {
      filters: {
        program: filters.program,
        se_boards: filters.se_boards,
        subject: filters.subject,
        assessment1: filters.assessment1,
      },
    },
  };

  try {
    console.log('Request data', apiUrl, data);
    const response = await post(apiUrl, data);
    return response?.data;
  } catch (error) {
    console.error('Error in getDoIdForAssesmentDetails Service', error);
    return error;
  }
};
