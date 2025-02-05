import { deleteApi } from './RestClient';

export const deleteFormFields = async (
  fieldValues: { fieldId: string; itemId: string }[]
): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/fields/values/delete`;

  try {
    const response = await deleteApi(apiUrl, { fieldValues }, {});
    return response?.data?.result;
  } catch (error) {
    console.error('Error in deleting Form Fields', error);
    throw error;
  }
};
