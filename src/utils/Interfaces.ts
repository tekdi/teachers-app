export interface AttendanceParams {
  userId: string;
  attendanceDate: string;
  attendance: string;
  contextId: string;
}

export interface CohortCardProps {
  showBackground: boolean;
  isRemote: boolean;
  cohortName: string;
  cohortId: string;
}

export interface MarkAttendanceProps {
  isOpen: boolean;
  isSelfAttendance?: boolean;
  date: string;
  name?: string;
  currentStatus: string;
  handleClose: () => void;

  handleSubmit: (attendanceDate: string, attendance: string) => void;
  message?: string;
}

export interface AttendanceStatusListViewProps {
  userData?: UserAttendanceObj;
  isEdit?: boolean;
  isBulkAction?: boolean;
  handleBulkAction?: (
    isBulkAction: boolean,
    status: string,
    id?: string | undefined
  ) => void;
  bulkAttendanceStatus?: string;
}

export interface UserAttendanceObj {
  userId: string;
  attendance: string; //Mandatory
  name?: string;
  attendanceDate?: Date | string;
}

export interface BulkAttendanceParams {
  attendanceDate: string;
  contextId: string;
  userAttendance: UserAttendanceObj[];
}

export interface cohortListParam {
  limit: number;
  page: number;
  filters: {
    userId: string;
  };
}

export interface cohortMemberList {
  limit: number;
  page: number;
  filters: {
    cohortId: string;
  };
}

interface CustomField {
  label: string;
  value: string;
}
export interface UserData {
  id: number;
  name: string;
  role: string;
  district: string;
  state: string;
  email: string;
  dob?: string;
  mobile?: string;
  customFields: CustomField[];
}

export interface TimeTableCardProps {
  subject: string;
  instructor: string;
  time: string;
}
export interface ExtraSessionsCardProps {
  subject: string;
  instructor: string;
  dateAndTime: string;
  meetingURL: string;
  onEditClick?: () => void;
  onCopyClick?: () => void;
}
export interface AttendanceStatusListProps {
  limit: number;
  page: number;
  filters: {
    fromDate: string;
    toDate: string;
  };
}

export interface AttendancePercentageProps {
  limit: number;
  page: number;
  filters: {
    contextId: string;
    scope: string;
    toDate: string;
    fromDate: string;
  };
  facets: Array<string>;
}

export interface cohort {
  cohortId: string;
  name: string;
  value: string;
}