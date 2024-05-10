import { post } from './RestClient';
import {
  AttendanceParams,
  BulkAttendanceParams,
  AttendanceByDateParams,
  TeacherAttendanceByDateParams,
  AttendanceReports,
  AttendanceStatusListProps,
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

export const attendanceStatusList = async ({
  limit,
  page,
  filters: { fromDate, toDate },
}: AttendanceStatusListProps): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/attendance/list`;
  try {
    const response = await post(apiUrl, {
      limit,
      page,
      filters: { fromDate, toDate },
    });
    return response?.data;
  } catch (error) {
    console.error('error in marking bulk attendance', error);
  }
};
