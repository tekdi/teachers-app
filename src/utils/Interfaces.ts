/* eslint-disable no-unused-vars */
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
  onAttendanceUpdate: () => void;
}

export interface AttendanceStatusListViewProps {
  isDisabled?: boolean;
  showLink?: boolean;
  userData?: UserAttendanceObj;
  isEdit?: boolean;
  isBulkAction?: boolean;
  handleBulkAction?: (
    isBulkAction: boolean,
    status: string,
    id?: string | undefined
  ) => void;
  bulkAttendanceStatus?: string;
  presentCount?: number;
  absentCount?: number;
}

export interface UserAttendanceObj {
  userId: string;
  attendance: string; //Mandatory
  name?: string;
  attendanceDate?: Date | string;
  memberStatus?: string;
}

export interface BulkAttendanceParams {
  attendanceDate: string;
  contextId: string;
  userAttendance: UserAttendanceObj[];
}
export interface MarkAttendanceParams {
  userId: string;
  attendanceDate: string;
  contextId: string;
  attendance: string;
}

export interface UserIdFilter {
  userId: string;
}

export interface ParentIdFilter {
  parentId: string[];
}

// Define a union type for the filters
export type Filters = UserIdFilter | ParentIdFilter;
export interface CohortListParam {
  limit: number;
  offset: number;
  filters: Filters;
}

export interface CohortMemberList {
  limit: number;
  page: number;
  filters: {
    cohortId: string;
    role?: string;
    status?: string[];
  };
}

export interface UserList {
  limit: number;
  page: number;
  filters: {
    states: string;
    districts: string;
    blocks: string;
    role?: string;
  };
  fields: string[];
}

export interface UserData {
  name?: any;
  district: string;
  state: string;
  mobile?: string;
}

export interface IUserData {
  name?: any;
}

export interface LearnerData {
  name?: any;
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

export interface SessionsCardProps {
  data: Session;
  children?: React.ReactNode;
}
export interface SessionsModalProps {
  children?: React.ReactNode;
  open: boolean;
  handleClose: () => void;
  title: string;
  primary?: string;
  center?: string;
  date?: string;
  handlePrimaryModel?: () => void;
  secondary?: string;
}

export interface PlannedModalProps {
  removeModal?: () => void;
  clickedBox?: string | null;
}

export interface ScheduleModalProps {
  handleClick?: (selection: string) => void;
  clickedBox?: string | null;
}

export interface AttendanceStatusListProps {
  limit: number;
  page: number;
  filters: {
    fromDate: string | Date;
    toDate: string | Date;
    contextId: string;
    scope: string;
  };
}

export interface AttendancePercentageProps {
  limit: number;
  page: number;
  filters: {
    contextId: string;
    scope: string;
    toDate: string | Date;
    fromDate: string | Date;
  };
  facets: Array<string>;
}

export interface OverallAttendancePercentageProps {
  limit: number;
  page: number;
  filters: {
    contextId: string;
    scope: string;
  };
  facets: Array<string>;
}
export interface SessionModeProps {
  handleSessionModeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mode: string;
  sessions: {
    tile: string;
    mode1: string;
    mode2: string;
  };
}
export interface LearnerAttendanceProps {
  limit: number;
  page: number;
  filters: {
    contextId: string;
    scope: string;
    toDate: string | Date;
    fromDate: string | Date;
    userId: string;
  };
}

export interface UpdateCustomField {
  options: any;
  fieldId: string;
  value: string;
  type: string;
  label?: string;
  values?: string | string[];
  name?: string;
  isEditable?: boolean;
  order: number;
}
export interface ICohort {
  presentPercentage: number;
  cohortId: string;
  name: string;
  value: string;
  state: string;
}

export interface LearListHeaderProps {
  numberOfColumns: number;
  firstColumnName: string;
  secondColumnName?: string;
}

export interface MarksObtainedCardProps {
  data: { question: string; mark_obtained: number; totalMarks: number }[];
}

export interface AssessmentListServiceParam {
  filters: {
    userId: string;
  };
  pagination: {
    pageSize: number;
    page: number;
  };
  sort: {
    field: string;
    order: string;
  };
}

export interface CohortAttendancePercentParam {
  limit: number;
  page: number;
  filters: {
    scope: string;
    fromDate: Date | string;
    toDate: Date | string;
    contextId: string;
  };
  facets: Array<string>;
  sort?: Array<string>;
}
export interface GetDoIdServiceParam {
  filters: {
    program?: string | string[];
    se_boards?: (string | null)[];
    subject?: string | string[];
    assessment1?: string | string[];
  };
}

export interface CustomField {
  fieldId: string;
  isEditable: boolean;
  isRequired?: boolean;
  label: string;
  name: string;
  options: Record<string, any>;
  order: number;
  type: any;
  value: string;
}
export interface CohortAttendanceListViewProps {
  cohortName: string;
  attendancePercent: number;
}

export interface AllCenterAttendancePercentParam {
  limit: number;
  page: number;
  filters: {
    scope: string;
    fromDate: Date | string;
    toDate: Date | string;
    contextId: string;
  };
  facets: Array<string>;
}

export interface UpdateCohortMemberStatusParams {
  memberStatus: string;
  statusReason?: string;
  membershipId: string | number;
}

export interface LearnerListProps {
  type?: string;
  userId: string;
  isDropout: boolean;
  enrollmentId?: string | number;
  cohortMembershipId: string | number;
  learnerName: string;
  statusReason: string;
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
  block?: string;
  center?: string;
  showMiniProfile?: boolean;
  onLearnerDelete: () => void;
}
export interface FacilitatorListParam {
  limit: number;
  page: number;
  filters: {
    state: string;
    district: string;
    role: string;
  };
}

export interface DropoutMember {
  userId: string | number;
  name: string;
  memberStatus: string;
}
export interface AssignCentersToFacilitatorListParam {
  userId: string[];
  cohortId: string[];
}

export interface Session {
  id: number;
  subject: string;
  time: string;
  teacherName: string;
  topic?: string;
  subtopic?: string;
  url?: string;
}
export interface CoursePlanner {
  id: number;
  subject?: string;
  circular?: number;
}
export interface CoursePlanner {
  id: number;
  subject?: string;
  circular?: number;
}
export interface SessionCardFooterProps {
  item: Session;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  name: string;
  type: 'text' | 'numeric' | 'drop_down' | 'checkbox' | 'radio' | 'email';
  label: string;
  order: string;
  coreField: number;
  dependsOn: string | boolean | null;
  isEditable: boolean;
  isPIIField: boolean | null;
  validation?: string[];
  placeholder: string;
  isMultiSelect: boolean;
  maxSelections: number | null;
  sourceDetails: Record<string, any>;
  options: FieldOption[];
  hint?: string | null;
  pattern?: string | null;
  maxLength?: number | null;
  minLength?: number | null;
  fieldId: string;
  isRequired?: boolean;
  default?: any;
}

export interface FormData {
  formid: string;
  title: string;
  fields: Field[];
}

export interface FacilitatorDeleteUserData {
  status: string;
  reason: string;
}

export interface TenantCohortRoleMapping {
  tenantId: string;
  roleId: string;
}

export interface CreateUserParam {
  username: string;
  name: string;
  email: string;
  password: string;
  tenantCohortRoleMapping: TenantCohortRoleMapping[];
  customFields: CustomField[];
}
export interface BulkCreateCohortMembersRequest {
  userId: string[];
  cohortId?: string[];
  removeCohortId?: string[];
}

export interface FacilitatorDrawerProps {
  secondary?: string;
  primary?: string;
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  drawerState: { bottom: boolean };
}
export interface CoursePlannerCardsProps {
  title: string;
  subtitle: string;
}

export interface scheduleEventParam {
  limit: number;
  page: number;
  filters: eventFilters;
}

export interface eventFilters {
  date?: string;
  startDate?: string;
  endDate?: string;
  eventType?: [];
  title?: string;
  status?: [];
}

export interface CoursePlannerData {
  id: string;
  subject: string;
  circular: number;
}

export interface OverallAttendance {
  absent?: any;
  present?: any;
  absent_percentage: any;
  present_percentage: any;
}


export interface Assessment {
  userId: number;
  studentName: string;
  progress: string;
  score?: number;
}

export interface AssessmentSubject {
  userId: number;
  subject: string;
  score: string;
  date :string;
}