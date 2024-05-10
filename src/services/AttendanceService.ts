import { post } from './RestClient';
import {
  AttendanceParams,
  BulkAttendanceParams,
  AttendanceByDateParams,
  TeacherAttendanceByDateParams,
  AttendanceReports,
  AttendanceStatusListProps,
  AttendancePercentageProps,
} from '../utils/Interfaces';

export const markAttendance = async ({
  userId,
  attendanceDate,
  attendance,
  contextId,
}: AttendanceParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/attendance`;
  try {
    const response = await post(apiUrl, {
      userId,
      attendanceDate,
      attendance,
      contextId,
    });
    return response?.data;
  } catch (error) {
    console.error('error in marking attendance', error);
    throw error;
  }
};

export const bulkAttendance = async ({
  attendanceDate,
  contextId,
  userAttendance,
}: BulkAttendanceParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/attendance/bulkAttendance`;
  try {
    const response = await post(apiUrl, {
      attendanceDate,
      contextId,
      userAttendance,
    });
    return response?.data;
  } catch (error) {
    console.error('error in marking bulk attendance', error);
  }
};

export const getTeacherAttendanceByDate = async ({
  fromDate,
  toDate,
  filters: { userId, contextId },
}: TeacherAttendanceByDateParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/attendance/bydate`;
  try {
    const response = await post(apiUrl, {
      fromDate,
      toDate,
      filters: {
        contextId,
        userId,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('error in marking attendance', error);
    throw error;
  }
};

const postAttendanceList = async ({
  limit,
  page,
  filters,
  facets,
}: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/attendance/list`;
  try {
    const response = await post(apiUrl, { limit, page, filters, facets });
    return response?.data;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
    throw error; // Rethrow the error to handle it in the caller function if needed
  }
};

export const attendanceStatusList = async ({
  limit,
  page,
  filters: { fromDate, toDate },
}: AttendanceStatusListProps): Promise<any> => {
  return postAttendanceList({
    limit,
    page,
    filters: { fromDate, toDate },
  });
};

export const attendanceInPercentageStatusList = async ({
  limit,
  page,
  filters: { contextId, scope, toDate, fromDate },
  facets,
}: AttendancePercentageProps): Promise<any> => {
  return postAttendanceList({
    limit,
    page,
    filters: { contextId, scope, toDate, fromDate },
    facets,
  });
};
