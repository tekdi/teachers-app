import { attendanceStatusList } from '@/services/AttendanceService';
import { shortDateFormat } from '@/utils/Helper';
import { AttendanceStatusListProps, DropoutMember } from '@/utils/Interfaces';
import { Status } from '@/utils/app.constant';

export const fetchAttendanceDetails = async (
  nameUserIdArray: any[],
  selectedDate: any,
  classId: string,
  onAttendanceDataUpdate: (data: {
    cohortMemberList: any[];
    presentCount: number;
    absentCount: number;
    numberOfCohortMembers: number;
    dropoutMemberList: any[];
    dropoutCount: number;
    bulkStatus: string;
  }) => void
) => {
  let cohortMemberList: Array<{}> = [];
  let presentCount = 0;
  let absentCount = 0;
  let numberOfCohortMembers = 0;
  let dropoutMemberList: Array<DropoutMember> = [];
  let dropoutCount = 0;
  let bulkAttendanceStatus = '';

  const updateBulkAttendanceStatus = (arr: any[]) => {
    const isAllPresent = arr.every((user: any) => user.attendance === 'present');
    const isAllAbsent = arr.every((user: any) => user.attendance === 'absent');
    bulkAttendanceStatus = isAllPresent ? 'present' : isAllAbsent ? 'absent' : '';
  };

  const getPresentCount = (newArray: { attendance: string }[]) => {
    return newArray.filter((user) => user.attendance === 'present').length;
  };

  const getAbsentCount = (newArray: { attendance: string }[]) => {
    return newArray.filter((user) => user.attendance === 'absent').length;
  };

  if (nameUserIdArray && selectedDate) {
    const formatSelectedDate = shortDateFormat(new Date(selectedDate));

    const attendanceStatusData: AttendanceStatusListProps = {
      limit: 300,
      page: 0,
      filters: {
        fromDate: formatSelectedDate,
        toDate: formatSelectedDate,
        contextId: classId,
        scope: 'student',
      },
    };

    const res = await attendanceStatusList(attendanceStatusData);
    const response = res?.data?.attendanceList;

    if (nameUserIdArray && response) {
      const getUserAttendanceStatus = (
        nameUserIdArray: any[],
        response: any[]
      ) => {
        const userAttendanceArray: { userId: any; attendance: any }[] = [];

        nameUserIdArray.forEach((user) => {
          const userId = user.userId;
          const attendance = response.find((status) => status.userId === userId);
          userAttendanceArray.push({
            userId,
            attendance: attendance?.attendance || '',
          });
        });
        return userAttendanceArray;
      };

      const userAttendanceArray = getUserAttendanceStatus(nameUserIdArray, response);

      const mergeArrays = (
        nameUserIdArray: { userId: string; name: string; memberStatus: string }[],
        userAttendanceArray: { userId: string; attendance: string }[]
      ) => {
        const newArray = nameUserIdArray.map((user) => {
          const attendanceEntry = userAttendanceArray.find(
            (entry) => entry.userId === user.userId
          );
          return {
            userId: user.userId,
            name: user.name,
            memberStatus: user.memberStatus,
            attendance: attendanceEntry?.attendance || '',
          };
        });

        if (newArray.length !== 0) {
          numberOfCohortMembers = newArray.length;
          cohortMemberList = newArray;
          presentCount = getPresentCount(newArray);
          absentCount = getAbsentCount(newArray);

          const hasDropout = newArray.some((user) => user.memberStatus === Status.DROPOUT);
          if (hasDropout) {
            cohortMemberList = newArray.filter((user) => user.memberStatus === Status.ACTIVE);
            dropoutMemberList = newArray.filter((user) => user.memberStatus === Status.DROPOUT);
            dropoutCount = dropoutMemberList.length;
          }
        } else {
          cohortMemberList = nameUserIdArray.filter((user) => user.memberStatus === Status.ACTIVE);
          dropoutMemberList = nameUserIdArray.filter((user) => user.memberStatus === Status.DROPOUT);
          numberOfCohortMembers = nameUserIdArray.length;
        }

        updateBulkAttendanceStatus(newArray);
        return newArray;
      };

      mergeArrays(nameUserIdArray, userAttendanceArray);
    }
  }

  onAttendanceDataUpdate({
    cohortMemberList,
    presentCount,
    absentCount,
    numberOfCohortMembers,
    dropoutMemberList,
    dropoutCount,
    bulkStatus: bulkAttendanceStatus,
  });
};
