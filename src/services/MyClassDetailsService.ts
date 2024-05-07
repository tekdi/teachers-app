import { cohortDetailsList } from '../utils/Interfaces';
import { post } from './RestClient';

export const getMyCohortMemberList = async ({
  contextId,
  attendanceDate,
  report,
  limit,
  offset,
  filters
}: cohortDetailsList): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/attendance/report`;
  try {
    const response = await post(apiUrl, {
      contextId,
      attendanceDate,
      report,
      limit,
      offset,
      filters
    }); //contextId, report, limit, offset, filters
    console.log('data', response?.data);
    return response?.data;
  } catch (error) {
    console.error('error in attendance report api ', error);
    throw error;
  }
};
