export const limit: number = 300;
export const refetchInterval: number = 5 * 60 * 1000;
export const gcTime: number = 10 * 60 * 1000;
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

export enum cohortPrivileges {
  STUDENT = 'student',
  
}

export enum FormContext {
  USERS = 'USERS'
}

export enum FormContextType {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  TEAM_LEADER = 'TEAMLEADER',
}

export enum RoleId {
  STUDENT = '493c04e2-a9db-47f2-b304-503da358d5f4',
  TEACHER = '3bde0028-6900-4900-9d05-eeb608843718',
  TEAM_LEADER = '9dd9328f-1bc7-444f-96e3-c5e1daa3514a',
  ADMIN = 'ee482faf-8a41-45fe-9656-5533dd6a787c'
}
