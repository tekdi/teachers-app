import { Role } from '@/utils/app.constant';

export const lowLearnerAttendanceLimit: number = 32;
export const avgLearnerAttendanceLimit: number = 66;
export const dashboardDaysLimit: number = 30;
export const modifyAttendanceLimit: number = 6;
export const eventDaysLimit: number = 7;
export const toastAutoHideDuration: number = 5000; // 5 seconds
export const tenantId: string = 'ef99949b-7f3a-4a5f-806a-e67e683e38f3';
export const idealTimeForSession: string = '120';
export const timeZone: string = 'Asia/Kolkata';
export const dropoutReasons = [
  {
    label: 'UNABLE_TO_COPE_WITH_STUDIES',
    value: 'Unable to cope with studies',
  },
  { label: 'FAMILY_RESPONSIBILITIES', value: 'Family responsibility' },
  {
    label: 'NEED_TO_GO_TO_WORK_OWN_WORK',
    value: 'Need to go to work/ own work',
  },
  { label: 'MARRIAGE', value: 'Marriage' },
  { label: 'ILLNESS', value: 'Illness' },
  { label: 'MIGRATION', value: 'Migration' },
  { label: 'PREGNANCY', value: 'Pregnancy' },
  { label: 'DOCUMENT_ISSUE', value: 'Document issue' },
  { label: 'DISTANCE_ISSUE', value: 'Distance issue' },
  { label: 'SCHOOL_ADMISSION', value: 'School admission' },
];

export const accessControl: { [key: string]: Role[] } = {
  accessDashboard: [Role.TEACHER, Role.TEAM_LEADER],
  accessAttendanceHistory: [Role.TEACHER, Role.TEAM_LEADER],
  accessAttendanceOverview: [Role.TEACHER, Role.TEAM_LEADER],
  accessProfile: [Role.TEACHER, Role.TEAM_LEADER],
  accessLearnerProfile: [Role.TEACHER, Role.TEAM_LEADER],
  accessLearnerAttendanceHistory: [Role.TEACHER, Role.TEAM_LEADER],
  showTeachingCenter: [Role.TEAM_LEADER],
  showBlockLevelCohort: [Role.TEAM_LEADER],
  showTeacherCohorts: [Role.TEACHER],
  showBlockLevelData: [Role.TEAM_LEADER],
  showCreateCenterButton: [Role.TEAM_LEADER],
  showBlockLevelCenterData: [Role.TEAM_LEADER],
  showTeacherLevelCenterData: [Role.TEACHER],
  accessCoursePlanner: [Role.TEACHER, Role.TEAM_LEADER],
  accessCoursePlannerDetails: [Role.TEACHER, Role.TEAM_LEADER],
  accessAssessments: [Role.TEACHER, Role.TEAM_LEADER],
  accessCenters: [Role.TEACHER, Role.TEAM_LEADER],
};

export const fullWidthPages = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/404',
  '/500',
  '/offline',
  '/unauthorized',
  '/create-password',
];

export const DaysOfWeek = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export const Program = 'Second chance';

export const frameworkId = 'gujaratboardfw';

export enum AssessmentType {
  PRE_TEST = 'Pre Test',
  POST_TEST = 'Post Test',
}

export const RequisiteType = {
  PRE_REQUISITES: 'prerequisite',
  POST_REQUISITES: 'postrequisite',
};
