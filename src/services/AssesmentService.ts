import {
  AssessmentListParam,
  GetDoIdServiceParam,
  IAssessmentStatusOptions,
  ISearchAssessment,
} from '@/utils/Interfaces';
import { post } from './RestClient';
import { URL_CONFIG } from '@/utils/url.config';

export const getAssessmentList = async ({
  sort,
  pagination,
  filters,
}: AssessmentListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/v1/tracking/assessment/list`;
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
  const apiUrl: string = `${URL_CONFIG.API.COMPOSITE_SEARCH}`;
  // const apiUrl: string =
  //   'https://sunbirdsaas.com/api/content/v1/search?orgdetails=orgName%2Cemail&licenseDetails=name%2Cdescription%2Curl';
  const data = {
    request: {
      filters: {
        program: filters.program,
        board: filters.board,
        // state: filters.state,
        assessmentType: filters.assessmentType,
        status: ['Live'],
        primaryCategory: ['Practice Question Set'],
      },
    },
  };

  try {
    const response = await post(apiUrl, data);
    return response?.data;
  } catch (error) {
    console.error('Error in getDoIdForAssessmentDetails Service', error);
    return error;
  }
};

export const getAssessmentStatus = async (body: IAssessmentStatusOptions) => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/v1/tracking/assessment/search/status`;
  try {
    const response = await post(apiUrl, body);
    return response?.data?.data;
  } catch (error) {
    console.error('error in getting Assessment Status Service list', error);

    return error;
  }
};

export const searchAssessment = async (body: ISearchAssessment) => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/v1/tracking/assessment/search`;
  try {
    const response = await post(apiUrl, body);
    return response?.data?.data;
  } catch (error) {
    console.error('error in getting Assessment Status Service list', error);

    return error;
  }
};
