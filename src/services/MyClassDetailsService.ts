import { cohortMemberList, updateCohortMemberStatusParams } from '../utils/Interfaces';
import { post, put } from './RestClient';

export const getMyCohortMemberList = async ({
  limit,
  page,
  filters,
}: cohortMemberList): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohortmember/list`;
  filters = { ...filters, role: 'Student' };
  try {
    const response = await post(apiUrl, {
      limit,
      page,
      filters,
    });
    console.log('data', response?.data);
    return response?.data;
  } catch (error) {
    console.error('error in attendance report api ', error);
    // throw error;
  }
};

// export const updateCohortMemberStatus = async ({
//   memberStatus, 
//   statusReason
// }: updateCohortMemberStatusParams): Promise<any> => {
//   const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohortmember/update/${userId}`;
//   try {
//     const response = await put(apiUrl, {
//       memberStatus, 
//       statusReason
//     });
//     console.log('data', response?.data);
//     return response?.data;
//   } catch (error) {
//     console.error('error in attendance report api ', error);
//     // throw error;
//   }
// };
