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
  attendanceDates?: any[];
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
  attendanceDate?: Date;
}

export interface UserAttendanceObj {
  userId: string;
  attendance: string; //Mandatory
  name?: string;
  attendanceDate?: Date | string;
  memberStatus?: string;
  updatedAt?: string | number | Date;
  createdAt?: string;
  userName?: string;
}

export interface user {
  memberStatus: string;
  userId: string;
  name: string;
  attendance?: string;
  key?: string;
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
  limit?: number;
  page?: number;
  filters: {
    cohortId: string;
    role?: string;
    status?: string[];
    name?: string | undefined;
    firstName?: string;
  };
  includeArchived?: boolean;
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
  username?: string;
  district: string;
  state: string;
  mobile?: string;
  firstName?: string;
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
  data: any;
  showCenterName?: boolean;
  children?: React.ReactNode;
  isEventDeleted?: () => void;
  isEventUpdated?: () => void;
  StateName?: string;
  board?: string;
  medium?: string;
  grade?: string;
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
  handleEditModal?: () => void;
  disable?: boolean;
}

export interface PlannedModalProps {
  removeModal?: () => void;
  clickedBox?: string | null;
  scheduleEvent?: boolean;
  eventDeleted?: boolean;
  cohortName?: string;
  cohortType?: string;
  cohortId?: string;
  onCloseModal?: () => void | undefined;
  editSelection?: string;
  handleEditSelection?: (selection: string) => void;
  onEventDeleted?: () => void;
  onEventUpdated?: () => void;
  updateEvent?: boolean;
  editSession?: any;
  eventData?: any;
  StateName?: string;
  board?: string;
  medium?: string;
  grade?: string;
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
  disabled?: boolean;
  cohortType?: string;
}
export interface LearnerAttendanceProps {
  limit?: number;
  page?: number;
  filters: {
    contextId?: string;
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
  typeOfCohort: string;
  presentPercentage: number;
  cohortId: string;
  name: string;
  value: string;
  state: string;
  customField: any[];
  firstName?: string;
}

export interface LearListHeaderProps {
  numberOfColumns: number;
  firstColumnName: string;
  secondColumnName?: string;
}

export interface MarksObtainedCardProps {
  data: { question: string; mark_obtained: number; totalMarks: number }[];
}

export interface AssessmentListParam {
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
    board?: string[];
    subject?: string | string[];
    assessmentType?: string | string[];
    state: string;
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
  memberStatus?: string;
  statusReason?: string;
  membershipId: string | number;
  dynamicBody?: Record<string, any>;
}

export interface LearnerListProps {
  type?: string;
  userId: string;
  isDropout: boolean;
  enrollmentId?: any;
  age?: string | number;
  cohortMembershipId: string | number;
  learnerName: string;
  statusReason: string;
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
  block?: string;
  center?: string;
  showMiniProfile?: boolean;
  onLearnerDelete: () => void;
  isFromProfile?: boolean;
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
  endDateTime: string | number | Date;
  startDateTime: string | number | Date;
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
export interface SessionCardFooterProps {
  item: any;
  cohortName?: string;
  cohortId?: string;
  isTopicSubTopicAdded?: any;
  state?: string;
  board?: string;
  medium?: string;
  grade?: string;
}

export interface TopicSubtopicProps {
  topics?: any;
  subTopicsList?: any;
  onTopicSelected: any;
  onSubtopicSelected: any;
  selectedTopics?: any;
  selectedSubTopics?: any;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  name: string;
  type:
    | 'text'
    | 'numeric'
    | 'drop_down'
    | 'checkbox'
    | 'radio'
    | 'email'
    | 'date';
  label: string;
  order: string;
  coreField: number;
  dependsOn: string | null;
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
  ) => (event?: React.KeyboardEvent | React.MouseEvent) => void;
  drawerState: { bottom: boolean };
  onPrimaryClick?: () => void;
  selectedCount?: any;
  onSecondaryClick?: () => void;
}

export interface CoursePlannerCardsProps {
  resources: any;
  type: string;
}

export interface scheduleEventParam {
  limit: number;
  offset: number;
  filters: eventFilters;
}

export interface eventFilters {
  date?: dateRange;
  startDate?: dateRange;
  endDate?: dateRange;
  eventType?: [];
  title?: string;
  status?: string[];
  cohortId?: string;
  createdBy?: string;
}

export interface dateRange {
  after?: string;
  before?: string;
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

export interface SendCredentialsRequest {
  isQueue: boolean;
  context: string;
  key: string;
  replacements?: any;
  email?: {
    receipients: any[];
  };
  push?: {
    receipients: any;
  };
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
  date: string;
}

export interface AssessmentQuestion {
  userId: number;
  question: string;
  score: number;
}

export interface CreateEvent {
  title?: string;
  shortDescription?: string;
  description?: string;
  eventType: string;
  isRestricted?: boolean;
  autoEnroll?: boolean;
  location?: string;
  maxAttendees: number;
  attendees: string[];
  status?: string;
  createdBy: string;
  updatedBy: string;
  idealTime?: string;
  isRecurring: boolean;
  startDatetime: string;
  endDatetime: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  onlineProvider?: string;
  isMeetingNew?: boolean;
  meetingDetails?: MeetingDetails;
  recurrencePattern?: RecurrencePattern;
  metaData?: MetaData;
}
export interface RecurrencePattern {
  frequency: string;
  interval: number;
  endCondition: EndCondtion;
  daysOfWeek: number[];
  recurringStartDate: string;
}

export interface EndCondtion {
  type: string;
  value: string;
}
export interface MeetingDetails {
  url: string;
  id?: string;
  password?: string;
}

export interface MetaData {
  category?: string;
  courseType?: string;
  subject?: string;
  teacherName?: string;
  cohortId?: string;
  cycleId?: string;
  tenantId?: string;
  type?: string;
}
type Anchor = 'bottom';
export interface BottomDrawerProps {
  toggleDrawer: (
    anchor: Anchor,
    anchorEl: any,
    open: boolean
  ) => (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent) => void;
  state: { [key in Anchor]?: boolean };
  optionList: {
    label: string;
    icon: React.ReactNode;
    name: string;
  }[];
  listItemClick: (event: React.MouseEvent, name: string) => void;
  renderCustomContent?: () => React.ReactNode;
  children?: React.ReactNode;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  anchorEl: null | HTMLElement;
  isMobile: boolean;
}

export interface IAssessmentStatusOptions {
  userId: string[];
  courseId?: string[];
  unitId?: string[];
  contentId: string[];
  // batchId: string;
}

export interface GetTargetedSolutionsParams {
  subject: any;
  medium: any;
  class: any;
  board: any;
  courseType: string;
  entityId?: string;
}

export interface GetUserProjectDetailsParams {
  id: string;
  userId: string[];
  contentId: string[];
  batchId: string;
}

export interface EditEvent {
  isMainEvent: boolean;
  status?: string;
}

export interface ISearchAssessment {
  userId: string;
  courseId?: string;
  unitId?: string;
  contentId: string;
  // batchId: string;
}

export interface AssessmentReportProp {
  classId: string;
  userId: string;
}

export interface IQuestion {
  duration: number;
  maxScore: number;
  pass: string;
  queTitle: string;
  questionId: string;
  resValue: string;
  score: number;
  sectionId: string;
}

export interface GetSolutionDetailsParams {
  id: string;
  role: string;
}

export interface GetUserProjectTemplateParams {
  templateId: string;
  solutionId: string;
  role: string;
  cohortId?: string;
}

export interface HorizontalLinearStepperProps {
  activeStep: number;
}

export interface GetCohortSearchParams {
  cohortId: string;
  limit?: number;
  offset?: number;
}

export interface CentralizedModalProps {
  title?: string;
  subTitle?: string;
  secondary?: string;
  primary?: string;
  modalOpen?: boolean;
  handlePrimaryButton?: () => void;
  handleSkipButton?: () => void;
  icon?: boolean;
}

export interface GetUserProjectStatusParams {
  data: any;
  id: string;
  lastDownloadedAt: string;
}

export interface PasswordCreateProps {
  handleResetPassword: (password: string) => void;
  editPassword?: boolean;
}

export interface AcademicYear {
  id: string;
  session: string;
  isActive: string;
}

export enum ObservationEntityType {
  LEARNER = 'learner',
  FACILITATOR = 'facilitator',
  CENTER = 'center',
}
export interface observationInterface {
  role?: string;
}

export interface Pdata {
  id: string;
  pid?: string;
  ver?: string;
}

export interface ContextRollup {
  l1?: string;
  l2?: string;
  l3?: string;
  l4?: string;
}

export interface Cdata {
  type: string;
  id: string;
}

export interface ObjectRollup {
  l1?: string;
  l2?: string;
  l3?: string;
  l4?: string;
}

export interface Context {
  mode?: string;
  authToken?: string;
  sid?: string;
  did?: any;
  uid?: string;
  channel: string;
  pdata: Pdata;
  contextRollup?: ContextRollup;
  tags?: string[];
  cdata?: Cdata[];
  timeDiff?: number;
  objectRollup?: ObjectRollup;
  host?: string;
  endpoint?: string;
  dispatcher?: object;
  partner?: any[];
  contentId?: any;
  dims?: any[];
  app?: string[];
  userData?: {
    firstName: string;
    lastName: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config {
  toolBar?: {
    showZoomButtons?: boolean;
    showPagesButton?: boolean;
    showPagingButtons?: boolean;
    showSearchButton?: boolean;
    showRotateButton?: boolean;
  };
  sideMenu?: {
    showShare?: boolean;
    showDownload?: boolean;
    showReplay?: boolean;
    showExit?: boolean;
    showPrint?: boolean;
  };
  [propName: string]: any;
}

export interface Metadata {
  identifier: string;
  name: string;
  artifactUrl: string;
  streamingUrl?: string;
  compatibilityLevel?: number;
  pkgVersion?: number;
  isAvailableLocally?: boolean;
  basePath?: string;
  baseDir?: string;
}
export interface PlayerConfig {
  context: Context;
  config?: Config;
  metadata?: Metadata;
  data?: any;
}

export interface BoardEnrollmentStageCounts {
  board: number;
  subjects: number;
  registration: number;
  fees: number;
  completed: number;
}

// export interface BoardEnrollmentFieldsType {
//   BOARD?: string;
//   SUBJECTS?: string;
//   REGISTRATION?: string;
//   FEES?: string;
// };

export interface BoardEnrollmentData {
  userId: string;
  cohortMembershipId: string;
  name: string;
  memberStatus: string;
  statusReason: string | null;
  customField: {
    fieldId: string;
    label: string;
    value: string;
  }[];
  completedStep: number;
}

interface Subject {
  name: string;
  code?: string;
  identifier?: string;
}

export interface BoardEnrollmentProfileProps {
  learnerName: string | undefined;
  centerName: string;
  board: string;
  subjects: Subject[];
  registrationNum: string;
  feesPaidStatus: string;
  setActiveStep?: React.Dispatch<React.SetStateAction<number>>;
}

export interface RegistrationStatisticsProps {
  title?: string;
  cardTitle?: string;
  statistic?: string | number;
  avatar?: boolean;
  subtile?: string;
  onPrimaryClick?: () => void;
}
export interface VillageNewRegistrationProps {
  locations: any;
}
export interface RegistrationModalProps {
  avatar?: string;
  title?: string;
  age?: number;
  village?: string;
}
export interface SurveysProps {
  title: string;
  date?: string;
  villages?: number;
  status?: string;
  actionRequired?: string;
  isActionRequired?: boolean;
  onClick?: () => void;
  minHeight?: string;
}

export interface VillageDetailProps {
  title?: string;
  imageSrc?: any;
  subtitle?: string;
  onClick?: () => void;
}


export interface Block {
    id: number;
    name: string;
    selectedCount: number;
    handleNext?: any;
}

export interface BlockItemProps {
    name: string;
    selectedCount: number;
    onClick: () => void;
    handleNext ? : any;
}

export interface AssignVillagesProps {
    district: string;
    blocks: Block[];
    onBlockClick: (block: Block) => void;
    handleNext?: any;
}

export interface ExamplePageProps {
    handleNext: () => void;
}