import { getMyCohortMemberList } from '../services/MyClassDetailsService';
import { attendanceInPercentageStatusList } from '../services/AttendanceService';
import {
  AttendancePercentageProps,
  CohortMemberList,
} from '../utils/Interfaces';
import { getLatestEntries, shortDateFormat } from './Helper';

const getTotalStudentCount = async (
  response: any,
  fromDate: Date
): Promise<number> => {
  try {
    const filteredFields = response?.result?.userDetails || [];
    // console.log('Filtered User Details:', filteredFields);

    const nameUserIdArray = filteredFields
      .map((entry: any) => ({
        userId: entry.userId,
        memberStatus: entry.status,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      }))
      .filter(
        (member: {
          createdAt: string | number | Date;
          updatedAt: string | number | Date;
          memberStatus: string;
        }) => {
          const createdAt = new Date(member.createdAt).setHours(0, 0, 0, 0);
          const updatedAt = new Date(member.updatedAt).setHours(0, 0, 0, 0);
          const currentDate = new Date(fromDate).setHours(0, 0, 0, 0);

          if (member.memberStatus === 'archived' && updatedAt <= currentDate) {
            return false;
          }
          return createdAt <= currentDate;
        }
      );

    // Get the latest entries
    const filteredEntries = getLatestEntries(
      nameUserIdArray,
      shortDateFormat(fromDate)
    );

    const totalStudentsCount = filteredEntries.length;
    // console.log('Total Students Count:', totalStudentsCount);

    return totalStudentsCount;
  } catch (error) {
    // console.error('Error in getTotalStudentCount:', error);
    return 0;
  }
};



const getPresentStudentCount = async (
  attendanceRequest: AttendancePercentageProps
): Promise<PresentStudents> => {
  const response = await attendanceInPercentageStatusList(attendanceRequest);
  const attendanceDates = response?.data?.result?.attendanceDate;
  const presentStudents: any = {};

  if (!attendanceDates) {
    return presentStudents;
  }
  for (const date of Object.keys(attendanceDates)) {
    const attendance = attendanceDates[date];
    const present = attendance.present || 0;
    presentStudents[date] = {
      present_students: present,
    };
  }
  console.log('presentStudents', presentStudents);
  return presentStudents;
};

type PresentStudents = {
  [date: string]: {
    present_students: number;
  };
};

type Result = {
  [date: string]: {
    present_students: number;
    totalcount: number;
    present_percentage: number;
  };
};

export const calculatePercentage = async (
  cohortMemberRequest: CohortMemberList,
  attendanceRequest: AttendancePercentageProps,
  selectedDate?: any
): Promise<Result> => {
  const fromDate = new Date(selectedDate);
  const response = await getMyCohortMemberList(cohortMemberRequest);

  const presentStudents = await getPresentStudentCount(attendanceRequest);
  const result: Result = {};
  for (const date of Object.keys(presentStudents)) {
    const totalStudentsCount = await getTotalStudentCount(
      response,
      new Date(date)
    );
    const presentCount = presentStudents[date].present_students;
    const presentPercentage = parseFloat(
      ((presentCount / totalStudentsCount) * 100).toFixed(2)
    );
    result[date] = {
      present_students: presentCount,
      totalcount: totalStudentsCount,
      present_percentage: presentPercentage,
    };
  }
  return result;
};
