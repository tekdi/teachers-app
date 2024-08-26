import { get, patch } from './RestClient';

export const getUserId = async (): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`;
  try {
    const response = await get(apiUrl);
    return response?.data?.result;
  } catch (error) {
    console.error('error in fetching user details', error);
    throw error;
  }
};

export const editEditUser = async (
  userId?: string | string[],
  userDetails?: object
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/update/${userId}`;
  try {
    const response = await patch(apiUrl, userDetails);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    throw error;
  }
};

export const getUserDetails = async (
  userId?: string | string[],
  fieldValue?: boolean
): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/read/${userId}`;
  apiUrl = fieldValue ? `${apiUrl}?fieldvalue=true` : apiUrl;
  
  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};
