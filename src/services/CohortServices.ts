import { get } from './RestClient';

export const cohortList = async (name: string, userId: string): Promise<any> => {
  const apiUrl: string = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/cohort/cohortDetails?name=${name}&id=${userId}`;
  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('error in getting cohort list', error);
    throw error;
  }
};
