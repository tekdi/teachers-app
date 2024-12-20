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
