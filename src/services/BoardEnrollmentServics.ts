import { BoardEnrollment } from '@/utils/Interfaces';

export const boardEnrollment = (): BoardEnrollment[] => {
  return [
    {
      userId: 1,
      studentName: 'Aanya Gupta',
      center: 'Khapari Dharmu (Chimur, Chandrapur)',
      isDropout: false,
    },
    {
      userId: 2,
      studentName: 'Aisha Bhatt',
      center: 'Khapari Dharmu (Chimur, Chandrapur)',
      isDropout: false,
    },
    {
      userId: 3,
      studentName: 'Ankita Kulkarni',
      center: 'Khapari Dharmu (Chimur, Chandrapur)',
      isDropout: true,
    },
  ];
};
