import { post } from './RestClient';

export const getAcademicYear = async (): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/academicyears/list`;
  try {
    const response = await post(apiUrl,{});
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting academicYearId', error);
  }
};