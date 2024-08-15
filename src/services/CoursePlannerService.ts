import { CoursePlanner } from '../utils/Interfaces';

export const getCoursePlanner = (): CoursePlanner[] => {
  // TODO: Add API call here

  const CoursePlannerService: CoursePlanner[] = [
    { id: 1, subject: 'Mathematics', circular: 10 },
    { id: 2, subject: 'Science', circular: 50 },
    { id: 3, subject: 'History', circular: 30 },
    { id: 4, subject: 'Geography', circular: 60 },
    { id: 5, subject: 'Marathi', circular: 90 },
    { id: 6, subject: 'Hindi', circular: 70 },
    { id: 7, subject: 'Social Science', circular: 80 },
  ];

  return CoursePlannerService;
};
