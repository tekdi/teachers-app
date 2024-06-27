export const limit: number = 300;
export const refetchInterval: number = 5 * 60 * 1000;
export const gcTime: number = 10 * 60 * 1000;

export enum Role {
    STUDENT = 'Student',
    TEACHER = 'Teacher',
    ADMIN = 'Admin',
  };
  
  export enum Status {
    DROPOUT = 'dropout',
    ACTIVE = 'active',
    ARCHIVED = 'archived'
  }
  