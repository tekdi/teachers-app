import { getMyCohortMemberList } from '../services/MyClassDetailsService';
import { attendanceInPercentageStatusList } from '../services/AttendanceService';
import {
  AttendancePercentageProps,
  cohortMemberList,
} from '../utils/Interfaces';

const getTotalStudentCount = async (
  cohortMemberRequest: cohortMemberList
): Promise<number> => {
  const response = await getMyCohortMemberList(cohortMemberRequest);
  const totalStudentsCount = response?.result?.totalCount;
  console.log('totalStudentsCount', totalStudentsCount);
  return totalStudentsCount;
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
  cohortMemberRequest: cohortMemberList,
  attendanceRequest: AttendancePercentageProps
): Promise<Result> => {
  const totalStudentsCount = await getTotalStudentCount(cohortMemberRequest);
  const presentStudents = await getPresentStudentCount(attendanceRequest);

  const result: Result = {};

  for (const date of Object.keys(presentStudents)) {
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
