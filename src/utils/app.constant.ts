/* eslint-disable no-unused-vars */
import { TFunction } from 'i18next';
import pdf from './../assets/images/PDF.svg';
import epub from '../assets/images/Epub.svg';
import html from '../assets/images/HTML.svg';
import mp4 from '../assets/images/MP4.svg';
import qml from '../assets/images/Qml.svg';
import youtube from '../assets/images/youtube.svg';
import h5p from '../assets/images/h5p.png';
import unit from '../assets/images/Unit.png';

// background image

import bgpdf from './../assets/images/bgPDF.svg';
import bgepub from '../assets/images/bgEpub.svg';
import bghtml from '../assets/images/bgHtml.svg';
import bgmp4 from '../assets/images/bgMP4 .svg';
import bgqml from '../assets/images/bgQml.svg';
import bgyoutube from '../assets/images/bgYouTube.svg';
import bgh5p from '../assets/images/bgh5p.png';
import bgunit from '../assets/images/bgUnit.png';

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
  COHORTS = 'COHORTS',
  COHORT_MEMBER = 'COHORTMEMBER',
}

export enum FormContextType {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  TEAM_LEADER = 'TEAM LEADER',
  COHORT = 'COHORT',
  COHORT_MEMBER = 'COHORTMEMBER',
}
export enum ObservationEntityType {
  LEARNER = 'learner',
  FACILITATOR = 'facilitator',
  CENTER = 'center',
}
export enum ObservationStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  NOT_STARTED = 'notstarted',
  STARTED = 'started',
  ALL = 'All',
}

export enum CenterType {
  REGULAR = 'REGULAR',
  REMOTE = 'REMOTE',
  UNKNOWN = 'UNKNOWN',
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
export enum LeftDays {
  ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24,
}

export enum Telemetry {
  CLICK = 'CLICK',
  SEARCH = 'SEARCH',
  VIEW = 'VIEW',
}
export enum TelemetryEventType {
  CLICK = 'CLICK',
  SEARCH = 'SEARCH',
  VIEW = 'VIEW',
  RADIO = 'RADIO',
}
export enum AssessmentStatus {
  NOT_STARTED = 'Not_Started',
  IN_PROGRESS = 'In_Progress',
  COMPLETED = 'Completed',
  COMPLETED_SMALL = 'completed',
}

export enum QueryKeys {
  GET_ACTIVE_FACILITATOR = 'getActiveFacilitatorList',
  MY_COHORTS = 'myCohorts',
}

export enum CoursePlannerConstants {
  SUBJECT = 'SUBJECT',
  STATES = 'STATES',
  BOARD = 'BOARD',
  MEDIUM = 'MEDIUM',
  GRADE = 'GRADE',

  SUBJECT_SMALL = 'Subject',
  STATES_SMALL = 'State',
  BOARD_SMALL = 'Board',
  MEDIUM_SMALL = 'Medium',
  GRADE_SMALL = 'Grade',
}

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  PASSED = 'PASSED',
}

export const metaTags = {
  title: 'Pratham Learning Management App',
  description:
    "Pratham's Second Chance program focuses on providing school dropouts, especially young girls and women, another chance at education. Second Chance aims to support those who could not complete their secondary education. The program focuses on completion of Grade 10. The academic certificate that they receive opens the door for further opportunities for lifelong learning and growth. The Second Chance program uses innovative teaching methods, to provide accessible learning opportunities very close to where the students live.",
  keywords: 'Second Chance Program',
};

export enum ResourcesType {
  PREREQUSITE = 'prerequisite',
  POSTREQUSITE = 'postrequisite',
  NONE = 'none',
}
export const FeesStepBoards = ['NIOS'];

import { StaticImageData } from 'next/image'; // Import StaticImageData for type safety with images

// Define the enum for content types

export enum ContentType {
  PDF = 'application/pdf',
  EPUB = 'application/epub',
  HTML = 'application/vnd.ekstep.html-archive',
  VIDEO_MP4 = 'video/mp4',
  QUESTION_SET = 'application/vnd.sunbird.questionset',
  H5P = 'application/vnd.ekstep.h5p-archive',
  YOUTUBE_VIDEO = 'video/youtube',
  YOUTUBE_X_VIDEO = 'video/x-youtube',
  WEBM_VIDEO = 'video/webm',
  COLLECTION = 'application/vnd.ekstep.content-collection',
}

// Define the type for the content type mapping
export type FileType = {
  [key in ContentType]: {
    name: string;
    imgPath: StaticImageData;
    BgImgPath?: StaticImageData;
  };
};

// Create the mapping object with enum keys
export const ContentCardsTypes: FileType = {
  [ContentType.PDF]: { name: 'PDF', imgPath: pdf, BgImgPath: bgpdf },
  [ContentType.EPUB]: { name: 'EPUB', imgPath: epub, BgImgPath: bgepub },
  [ContentType.HTML]: { name: 'HTML', imgPath: html, BgImgPath: bghtml },
  [ContentType.VIDEO_MP4]: { name: 'Video', imgPath: mp4, BgImgPath: bgmp4 },
  [ContentType.QUESTION_SET]: {
    name: 'Question Set',
    imgPath: qml,
    BgImgPath: bgqml,
  },
  [ContentType.H5P]: { name: 'H5P', imgPath: h5p, BgImgPath: bgh5p },
  [ContentType.YOUTUBE_X_VIDEO]: {
    name: 'YouTube',
    imgPath: youtube,
    BgImgPath: bgyoutube,
  },
  [ContentType.YOUTUBE_VIDEO]: {
    name: 'YouTube',
    imgPath: youtube,
    BgImgPath: bgyoutube,
  },
  [ContentType.WEBM_VIDEO]: { name: 'WEBM', imgPath: mp4, BgImgPath: bgmp4 },
  [ContentType.COLLECTION]: {
    name: 'Course',
    imgPath: unit,
    BgImgPath: bgunit,
  },
};

export enum contentStatus {
  COMPLETED = 'Completed',
  IN_PROGRESS = 'In_Progress',
  NOT_STARTED = 'Not_Started',
}

export enum sessionType {
  PLANNED = 'planned',
  EXTRA = 'extra',
}
