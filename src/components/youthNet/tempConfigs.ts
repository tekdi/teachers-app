//** Note : This file will be removed from the project after API's are integrated **//

export const MOCK_SURVEY_CONFIG = {
  surveyAvailable: true,
};

export const SURVEY_DATA = {
  CREATIVITY_MAHOTSAV: 'Creativity Mahotsav',
  TWELVE: 'Assigned to 12 Villages',
  FIFTY_TWO: '52',
};

export const volunteerData = [
  {
    id: 1,
    title: 'Deviyapur',
    entries: 0,
    volunteerCount: 0,
    actionLabel: 'Add or Update Volunteers',
  },
  {
    id: 2,
    title: 'Kharagpur',
    entries: 0,
    volunteerCount: 0,
    actionLabel: 'Add or Update Volunteers',
  },
  {
    id: 3,
    title: 'Khopi',
    entries: 0,
    volunteerCount: 0,
    actionLabel: 'Add or Update Volunteers',
  },
  {
    id: 4,
    title: 'Shivare',
    entries: 0,
    volunteerCount: 0,
    actionLabel: 'Add or Update Volunteers',
  },
  {
    id: 5,
    title: 'Nandghur',
    entries: 0,
    volunteerCount: 0,
    actionLabel: 'Add or Update Volunteers',
  },
];

export type DataPoint = {
  date: string;
  count: number;
};

type SampleData = {
  [key: string]: DataPoint[];
};

export const sampleData: SampleData = {
  'This month': [
    { date: '1 Sep', count: 2 },
    { date: '2 Sep', count: 7 },
    { date: '3 Sep', count: 4 },
    { date: '4 Sep', count: 6 },
    { date: '5 Sep', count: 5 },
    { date: '6 Sep', count: 3 },
    { date: '7 Sep', count: 10 },
    { date: '8 Sep', count: 8 },
    { date: '9 Sep', count: 2 },
    { date: '10 Sep', count: 5 },
    { date: '11 Sep', count: 9 },
    { date: '12 Sep', count: 4 },
    { date: '13 Sep', count: 6 },
    { date: '14 Sep', count: 3 },
    { date: '15 Sep', count: 7 },
    { date: '16 Sep', count: 10 },
  ],
  'Last month': [
    { date: '1 Aug', count: 3 },
    { date: '15 Aug', count: 8 },
    { date: '3 Aug', count: 5 },
    { date: '2 Aug', count: 6 },
    { date: '4 Aug', count: 9 },
    { date: '5 Aug', count: 4 },
    { date: '8 Aug', count: 5 },
    { date: '10 Aug', count: 8 },
    { date: '11 Aug', count: 9 },
    { date: '14 Aug', count: 7 },
    { date: '13 Aug', count: 5 },
    { date: '15 Aug', count: 12 },
    { date: '18 Aug', count: 13 },
    { date: '25 Aug', count: 6 },
  ],
  'Last 6 months': [
    { date: '1 Apr', count: 10 },
    { date: '1 May', count: 4 },
    { date: '1 Jun', count: 3 },
    { date: '1 Jul', count: 5 },
    { date: '1 Aug', count: 6 },
    { date: '1 Sep', count: 7 },
    { date: '1 Oct', count: 9 },
    { date: '1 Nov', count: 11 },
    { date: '1 Dec', count: 4 },
  ],
};

export const locations = [
  'Katol',
  'Kondhali',
  'Metpanjara',
  'Bhivapur',
  'Deviyapur',
  'Kargaon',
  'Hastinapur',
  'Jabarbodi',
  'Sangoli',
  'Sarvatra',
  'Khurgaon',
  'Ganoli',
];

export const users = [
  {
    name: 'Ananya Gupta',
    age: 14,
    village: 'Deviyapur',
    image: '',
  },
  { name: 'Aisha Sharma', age: 15, village: 'Kasurdi', image: '' },
  { name: 'Bharat Kumar', age: 15, village: 'Pande', image: '' },
  { name: 'Disha Shire', age: 14, village: 'Deviyapur', image: '' },
  { name: 'Divya Sharma', age: 17, village: 'Khopi', image: '' },
];

export const VILLAGE_DATA = {
  TWENTY_SIX: '26',
  ZERO: '+0',
  VILLAGE_ID: 'Village ID',
  ID: '939326',
  YOUTH_VOL: '21 Youth, 6 Volunteers',
  THREE: '3',
  SURVEYS_CONDUCTED: 'Surveys conducted so far',
};

export const surveyData = [
  { title: 'Reading Camp', date: '16 Jul, 2024' },
  { title: 'Science Camp', date: '5 May, 2024' },
  { title: 'Sports Camp', date: '3 Feb, 2024' },
];

export const CAMP_DATA = {
  ASSIGNED: '  Assigned to Ankita Kulkarni, Ananya Sen',
  DATE1: 'Submitted on 10 Sep, 2024 @ 2:35 pm',
  DATE2: 'Submitted on 05 Oct, 2024 @ 6:10 pm',
};
export const youthList = [
  {
    name: 'Ananya Gupta',
    age: 14,
    image: '',
    joinOn: 'Join on 15 Jan, 2025',
    isNew: true,
    showMore: true,
  },
  {
    name: 'Aisha Sharma',
    age: 15,
    image: '',
    joinOn: 'Join on 15 Jan, 2025',
    isNew: true,
    showMore: true,
  },
  {
    name: 'Bharat Kumar',
    age: 15,
    image: '',
    joinOn: 'Join on 15 Jan, 2025',
    isNew: true,
    showMore: true,
  },
  { name: 'Disha Shire', age: 14, joinOn: 'Join on 15 Jan, 2025', image: '' },
  { name: 'Divya Sharma', age: 17, joinOn: 'Join on 15 Jan, 2025', image: '' },
];
