import { post } from './RestClient';
import {
  BulkAttendanceParams,
  AttendanceStatusListProps,
  AttendancePercentageProps,
  cohortAttendancePercentParam,
  LearnerAttendanceProps,
  MarkAttendanceParams,
  allCenterAttendancePercentParam,
} from '../utils/Interfaces';

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

export const markAttendance = async ({
  userId,
  attendanceDate,
  contextId,
  attendance,
}: MarkAttendanceParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/attendance`;
  try {
    const response = await post(apiUrl, {
      userId,
      attendanceDate,
      contextId,
      attendance,
    });
    return response?.data;
  } catch (error) {
    console.error('error in marking bulk attendance', error);
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
    // throw error; // Rethrow the error to handle it in the caller function if needed
  }
};

export const attendanceStatusList = async ({
  limit,
  page,
  filters: { fromDate, toDate, contextId, scope },
}: AttendanceStatusListProps): Promise<any> => {
  return postAttendanceList({
    limit,
    page,
    filters: { fromDate, toDate, contextId, scope },
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

export const getLearnerAttendanceStatus = async ({
  limit,
  page,
  filters: { contextId, scope, toDate, fromDate, userId },
}: LearnerAttendanceProps): Promise<any> => {
  return postAttendanceList({
    limit,
    page,
    filters: { contextId, scope, toDate, fromDate, userId },
  });
};

export const getCohortAttendance = async ({
  limit,
  page,
  filters: { scope, fromDate, toDate, contextId },
  facets,
  sort,
}: cohortAttendancePercentParam): Promise<any> => {
  return postAttendanceList({
    limit,
    page,
    filters: { scope, fromDate, toDate, contextId },
    facets,
    sort,
  });
};

export const getAllCenterAttendance = async ({
  limit,
  page,
  filters: { scope, fromDate, toDate, contextId },
  facets,
}: allCenterAttendancePercentParam): Promise<any> => {
  return postAttendanceList({
    limit,
    page,
    filters: { scope, fromDate, toDate, contextId },
    facets,
  });
};

export const classesMissedAttendancePercentList = async ({
  filters,
  facets,
  sort,
}: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/attendance/list`;
  try {
    const response = await post(apiUrl, { filters, facets, sort });
    return response?.data;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
    // throw error; // Rethrow the error to handle it in the caller function if needed
  }
};
