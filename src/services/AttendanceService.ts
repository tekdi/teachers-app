import { post } from './RestClient';
import {
  BulkAttendanceParams,
  AttendanceStatusListProps,
  AttendancePercentageProps,
  CohortAttendancePercentParam,
  LearnerAttendanceProps,
  MarkAttendanceParams,
  AllCenterAttendancePercentParam,
  OverallAttendancePercentageProps,
} from '../utils/Interfaces';

// export const bulkAttendance = async ({
//   attendanceDate,
//   contextId,
//   userAttendance,
// }: BulkAttendanceParams): Promise<any> => {
//   const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/v1/attendance/bulkAttendance`;
//   try {
//     const response = await post(apiUrl, {
//       attendanceDate,
//       contextId,
//       userAttendance,
//       context: "cohort"
//     });
//     return response?.data;
//   } catch (error) {
//     console.error('error in marking bulk attendance', error);
//   }
// };

// export const markAttendance = async ({
//   userId,
//   attendanceDate,
//   contextId,
//   attendance,
// }: MarkAttendanceParams): Promise<any> => {
//   const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/v1/attendance`;
//   try {
//     const response = await post(apiUrl, {
//       userId,
//       attendanceDate,
//       contextId,
//       attendance,
//     });
//     return response?.data;
//   } catch (error) {
//     console.error('error in marking bulk attendance', error);
//   }
// };

// const postAttendanceList = async ({
//   limit,
//   page,
//   filters={},
//   facets,
// }: any): Promise<any> => {
//   const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/v1/attendance/list`;
//   filters.context = "cohort";
//   try {
//     const response = await post(apiUrl, { limit, page, filters, facets });
//     return response?.data;
//   } catch (error) {
//     console.error('Error in fetching attendance list', error);
//     // throw error; // Rethrow the error to handle it in the caller function if needed
//   }
// };

// export const attendanceStatusList = async ({
//   limit,
//   page,
//   filters: { fromDate, toDate, contextId, scope },
// }: AttendanceStatusListProps): Promise<any> => {
//   return postAttendanceList({
//     limit,
//     page,
//     filters: { fromDate, toDate, contextId, scope },
//   });
// };

// export const attendanceInPercentageStatusList = async ({
//   limit,
//   page,
//   filters: { contextId, scope, toDate, fromDate },
//   facets,
// }: AttendancePercentageProps): Promise<any> => {
//   return postAttendanceList({
//     limit,
//     page,
//     filters: { contextId, scope, toDate, fromDate },
//     facets,
//   });
// };

// export const overallAttendanceInPercentageStatusList = async ({
//   limit,
//   page,
//   filters: { contextId, scope },
//   facets,
// }: OverallAttendancePercentageProps): Promise<any> => {
//   return postAttendanceList({
//     limit,
//     page,
//     filters: { contextId, scope },
//     facets,
//   });
// };

// export const getLearnerAttendanceStatus = async ({
//   limit,
//   page,
//   filters: { contextId, scope, toDate, fromDate, userId },
// }: LearnerAttendanceProps): Promise<any> => {
//   return postAttendanceList({
//     limit,
//     page,
//     filters: { contextId, scope, toDate, fromDate, userId },
//   });
// };

// export const getCohortAttendance = async ({
//   limit,
//   page,
//   filters: { scope, fromDate, toDate, contextId },
//   facets,
//   sort,
// }: CohortAttendancePercentParam): Promise<any> => {
//   return postAttendanceList({
//     limit,
//     page,
//     filters: { scope, fromDate, toDate, contextId },
//     facets,
//     sort,
//   });
// };

// export const getAllCenterAttendance = async ({
//   limit,
//   page,
//   filters: { scope, fromDate, toDate, contextId },
//   facets,
// }: AllCenterAttendancePercentParam): Promise<any> => {
//   return postAttendanceList({
//     limit,
//     page,
//     filters: { scope, fromDate, toDate, contextId },
//     facets,
//   });
// };

// export const classesMissedAttendancePercentList = async ({
//   filters,
//   facets,
//   sort,
// }: any): Promise<any> => {
//   const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/v1/attendance/list`;
//   try {
//     const response = await post(apiUrl, { filters, facets, sort });
//     return response?.data;
//   } catch (error) {
//     console.error('Error in fetching attendance list', error);
//     // throw error; // Rethrow the error to handle it in the caller function if needed
//   }
// };


export const bulkAttendance = async ({
  attendanceDate,
  contextId,
  userAttendance,
}: BulkAttendanceParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/v1/attendance/bulkAttendance`;
  try {
    const response = await post(apiUrl, {
      attendanceDate,
      contextId,
      userAttendance,
      context: "cohort" // Add context directly
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
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/v1/attendance`;
  try {
    const response = await post(apiUrl, {
      userId,
      attendanceDate,
      contextId,
      attendance,
      context: "cohort" // Add context directly
    });
    return response?.data;
  } catch (error) {
    console.error('error in marking attendance', error);
  }
};

const postAttendanceList = async ({
  limit,
  page,
  filters = {},
  facets,
}: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/v1/attendance/list`;
  filters.context = "cohort"; // Ensure context is added to filters
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
    filters: { fromDate, toDate, contextId, scope, context: "cohort" }, // Add context to filters
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
    filters: { contextId, scope, toDate, fromDate, context: "cohort" }, // Add context to filters
    facets,
  });
};

export const overallAttendanceInPercentageStatusList = async ({
  limit,
  page,
  filters: { contextId, scope },
  facets,
}: OverallAttendancePercentageProps): Promise<any> => {
  return postAttendanceList({
    limit,
    page,
    filters: { contextId, scope, context: "cohort" }, // Add context to filters
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
    filters: { contextId, scope, toDate, fromDate, userId, context: "cohort" }, // Add context to filters
  });
};

export const getCohortAttendance = async ({
  limit,
  page,
  filters: { scope, fromDate, toDate, contextId },
  facets,
  sort,
}: CohortAttendancePercentParam): Promise<any> => {
  return postAttendanceList({
    limit,
    page,
    filters: { scope, fromDate, toDate, contextId, context: "cohort" }, // Add context to filters
    facets,
    sort,
  });
};

export const getAllCenterAttendance = async ({
  limit,
  page,
  filters: { scope, fromDate, toDate, contextId },
  facets,
}: AllCenterAttendancePercentParam): Promise<any> => {
  return postAttendanceList({
    limit,
    page,
    filters: { scope, fromDate, toDate, contextId, context: "cohort" }, // Add context to filters
    facets,
  });
};

export const classesMissedAttendancePercentList = async ({
  filters = {},
  facets,
  sort,
}: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/v1/attendance/list`;
  filters.context = "cohort"; // Add context to filters
  try {
    const response = await post(apiUrl, { filters, facets, sort });
    return response?.data;
  } catch (error) {
    console.error('Error in fetching attendance list', error);
    // throw error; // Rethrow the error to handle it in the caller function if needed
  }
};
