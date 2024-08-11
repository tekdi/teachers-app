/* eslint-disable no-unused-vars */
import { TFunction } from 'i18next';

export const limit: number = 300;
export const refetchInterval: number = 5 * 60 * 1000; // 5 min
export const gcTime: number = 10 * 60 * 1000; // 10 Min

export const labelsToExtractForMiniProfile = [
  'AGE',
  'GENDER',
  'LEARNERS_PRIMARY_WORK',
  'TYPE_OF_LEARNER',
];

export const getMenuItems = (
  t: TFunction,
  dateRange: string | Date,
  currentDayMonth: string | Date
) => {
  return [
    t('DASHBOARD.LAST_SEVEN_DAYS_RANGE', {
      date_range: dateRange,
    }),
    t('DASHBOARD.AS_OF_TODAY_DATE', {
      day_date: currentDayMonth,
    }),
    t('COMMON.LAST_MONTH'),
    t('COMMON.LAST_SIX_MONTHS'),
    t('COMMON.CUSTOM_RANGE'),
  ];
};

export const names = [
  'name',
  'age',
  'gender',
  'student_type',
  'enrollment_number',
  'primary_work',
];

export enum Role {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  TEAM_LEADER = 'Team Leader',
  ADMIN = 'Admin',
}

export enum Status {
  DROPOUT = 'dropout',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export enum cohortHierarchy {
  BLOCK = 'BLOCK',
  COHORT = 'COHORT',
}

export enum sessionMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
}
export enum sessionType {
  JUST = 'Just Once',
  REPEATING = 'Repeating',
}

export enum cohortPrivileges {
  STUDENT = 'student',
}

export enum FormContext {
  USERS = 'USERS',
}

export enum FormContextType {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  TEAM_LEADER = 'TEAM LEADER',
}

export enum CenterType {
  REGULAR = 'REGULAR',
  REMOTE = 'REMOTE',
}

export enum RoleId {
  STUDENT = '493c04e2-a9db-47f2-b304-503da358d5f4',
  TEACHER = '3bde0028-6900-4900-9d05-eeb608843718',
  TEAM_LEADER = '9dd9328f-1bc7-444f-96e3-c5e1daa3514a',
  ADMIN = 'ee482faf-8a41-45fe-9656-5533dd6a787c',
}

export enum Pagination {
  ITEMS_PER_PAGE = 10,
  MAX_ITEMS = 50,
}
