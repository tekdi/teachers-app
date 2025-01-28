import { post } from './RestClient';

//     const sortedFields = response?.data?.result.fields?.sort(
//       (a: { order: string }, b: { order: string }) =>
//         parseInt(a.order) - parseInt(b.order)
//     );
//     const formData = {
//       formid: response?.data?.result?.formid,
//       title: response?.data?.result?.title,
//       fields: sortedFields,
//     };
//     return formData;
//   } catch (error) {
//     console.error('error in getting cohort details', error);
//     // throw error;
//   }
// };

export const createUser = async (userData: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/create`;
  try {
    const response = await post(apiUrl, userData);
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort list', error);
    throw error;
  }
};

export const userNameExist = async (userData: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/suggestUsername`;
  try {
    const response = await post(apiUrl, userData);
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting in userNme exist', error);
    throw error;
  }
};

export const createCohort = async (userData: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/cohort/create`;
  try {
    const response = await post(apiUrl, userData);
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting cohort list', error);
    // throw error;
  }
};
