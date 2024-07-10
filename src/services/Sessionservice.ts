import { Session } from '../utils/Interfaces';

export const getSessions = (cohortId: string) => {
  //TODO Add api call here

  const sessionList: Session[] = [
    {
      id: 1,
      subject: 'Home Science',
      time: '2 pm - 5 pm',
      teacherName: 'Mahima Shastri',
      topic: 'real numbers',
      subtopic: 'irrational numbers',
    },
    {
      id: 2,
      subject: 'Mathematics',
      time: '11 am - 12 pm',
      teacherName: 'vivek kasture',
    },
    {
      id: 3,
      subject: 'English',
      time: '12 pm - 1 pm',
      teacherName: '',
    },
  ];
  return sessionList;
};
