import { Role, Status, labelsToExtractForMiniProfile } from './app.constant';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import FingerprintJS from 'fingerprintjs2';
import {
  BoardEnrollmentStageCounts,
  CustomField,
  UpdateCustomField,
} from './Interfaces';
dayjs.extend(utc);
import { format, parseISO } from 'date-fns';
import manageUserStore from '@/store/manageUserStore';
import {
  AssessmentType,
  avgLearnerAttendanceLimit,
  lowLearnerAttendanceLimit,
} from '../../app.config';

export const ATTENDANCE_ENUM = {
  PRESENT: 'present',
  ABSENT: 'absent',
  HALF_DAY: 'half-day',
  NOT_MARKED: 'notmarked',
  ON_LEAVE: 'on-leave',
};

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formatDate = (dateString: string) => {
  if (dateString) {
    const dateOnly = dateString?.split('T')[0];

    const [year, monthIndex, day] = dateOnly.split('-');
    const month = MONTHS[parseInt(monthIndex, 10) - 1];

    return `${day} ${month}, ${year}`;
  }
};

export const formatToShowDateMonth = (date: Date) => {
  const day = date.toLocaleString('en-US', { day: '2-digit' });
  const month = date.toLocaleString('en-US', { month: 'long' });
  return `${day} ${month}`;
};

export const shortDateFormat = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatSelectedDate = (inputDate: string | Date) => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

export const getTodayDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 as month is zero-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getMonthName = () => {
  const currentDate = new Date();
  const monthIndex = currentDate.getMonth();
  return MONTHS[monthIndex];
};

export const getDayAndMonthName = (dateString: Date | string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  return `${day} ${month}`;
};

export const getDayMonthYearFormat = (dateString: string) => {
  const [year, monthIndex, day] = dateString.split('-');
  const date = new Date(
    parseInt(year, 10),
    parseInt(monthIndex, 10) - 1,
    parseInt(day, 10)
  );
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Function to truncate URL if it's too long
export const truncateURL = (
  url: string,
  maxLength: number,
  isMobile?: boolean
) => {
  if (isMobile) {
    return url.length > maxLength ? `${url.substring(0, maxLength)} ...` : url;
  }
  return url;
};

// debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    const context = this;
    clearTimeout(timeout);

    if (immediate && !timeout) func.apply(context, args);

    timeout = setTimeout(() => {
      timeout = undefined;
      if (!immediate) func.apply(context, args);
    }, wait);
  };

  // Add a cancel method to clear any pending timeout
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = undefined;
  };

  return debounced;
};

//Function to convert names in capitalize case
export const toPascalCase = (name: string | any) => {
  if (typeof name !== 'string') {
    return name;
  }

  return name
    ?.toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const valueToLabelMap: { [key: string]: string } = {
  english: 'English',
  math: 'Math',
  language: 'Language',
  home_science: 'Home Science',
  social_science: 'Social Science',
  life_skills: 'Life Skills',
  science: 'Science',
};

// Function to transform a single value to its label
export const getLabelForValue = (value: string): string => {
  return valueToLabelMap[value] || 'NA';
};

export const generateRandomString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength)); //NOSONAR
  }

  return result;
};

export const generateUUID = () => {
  let d = new Date().getTime();
  let d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //NOSONAR
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const getDeviceId = () => {
  return new Promise((resolve) => {
    FingerprintJS.get((components: any[]) => {
      const values = components.map((component) => component.value);
      const deviceId = FingerprintJS.x64hash128(values.join(''), 31);
      resolve(deviceId);
    });
  });
};

export const getFieldValue = (
  data: any[],
  searchKey: string,
  searchValue: string,
  returnKey: string,
  defaultValue: any = null
) => {
  const field = data.find((item: any) => item[searchKey] === searchValue);
  return field ? field[returnKey] : defaultValue;
};

export const capitalizeEachWord = (str: string) => {
  return str.toUpperCase();
};

// Define the function type to handle the event
export const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    const focusedInput = document.activeElement;
    if (focusedInput instanceof HTMLElement) {
      focusedInput.blur();
    }
  }
};

export const sortAttendanceNumber = (data: any[], order: string) => {
  return data.sort(
    (
      a: { memberStatus: string; present_percent: string },
      b: { memberStatus: string; present_percent: string }
    ) => {
      if (
        a.memberStatus === Status.DROPOUT &&
        b.memberStatus !== Status.DROPOUT
      )
        return 1;
      if (
        a.memberStatus !== Status.DROPOUT &&
        b.memberStatus === Status.DROPOUT
      )
        return -1;
      const aPercent = parseFloat(a.present_percent);
      const bPercent = parseFloat(b.present_percent);
      if (isNaN(aPercent) && isNaN(bPercent)) return 0;
      if (isNaN(aPercent)) return 1;
      if (isNaN(bPercent)) return -1;
      return order === 'high' ? bPercent - aPercent : aPercent - bPercent;
    }
  );
};

export const sortClassesMissed = (data: any[], order: string) => {
  return data.sort(
    (
      a: { memberStatus: string; absent: string },
      b: { memberStatus: string; absent: string }
    ) => {
      if (
        a.memberStatus === Status.DROPOUT &&
        b.memberStatus !== Status.DROPOUT
      )
        return 1;
      if (
        a.memberStatus !== Status.DROPOUT &&
        b.memberStatus === Status.DROPOUT
      )
        return -1;
      const aClassMissed = parseFloat(a.absent);
      const bClassMissed = parseFloat(b.absent);
      if (isNaN(aClassMissed) && isNaN(bClassMissed)) return 0;
      if (isNaN(aClassMissed)) return 1;
      if (isNaN(bClassMissed)) return -1;
      return order === 'more'
        ? bClassMissed - aClassMissed
        : aClassMissed - bClassMissed;
    }
  );
};

export const filterAttendancePercentage = (
  data: any[],
  category: 'more' | 'between' | 'less'
) => {
  return data.filter(({ present_percent }: { present_percent: string }) => {
    const attendance = parseFloat(present_percent);

    if (isNaN(attendance)) return false; // Exclude invalid or missing values

    switch (category) {
      case 'more':
        return attendance > avgLearnerAttendanceLimit;
      case 'between':
        return (
          attendance >= lowLearnerAttendanceLimit &&
          attendance <= avgLearnerAttendanceLimit
        ); // Medium attendance
      case 'less':
        return attendance < lowLearnerAttendanceLimit;
      default:
        return false;
    }
  });
};

export const accessGranted = (
  action: string,
  accessControl: { [key: string]: Role[] },
  currentRole: Role
): boolean => {
  if (accessControl[action]?.includes(currentRole)) {
    return true;
  }
  return false;
};

export const generateUsernameAndPassword = (
  stateCode: string,
  role: string,
  yearOfJoining: string
) => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(10000 + Math.random() * 90000).toString(); //NOSONAR
  const yearSuffix =
    yearOfJoining !== '' ? yearOfJoining?.slice(-2) : currentYear;
  const username =
    role === 'F'
      ? `FSC${stateCode}${yearSuffix}${randomNum}`
      : `SC${stateCode}${currentYear}${randomNum}`;
  const password = randomNum;

  return { username, password };
};

export const mapFieldIdToValue = (
  fields: CustomField[]
): { [key: string]: string } => {
  return fields?.reduce(
    (acc: { [key: string]: string }, field: CustomField) => {
      acc[field.fieldId] = field.value;
      return acc;
    },
    {}
  );
};

export const convertUTCToIST = (utcDateTime: string) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const date = new Date(utcDateTime);
  const dateTimeFormat = new Intl.DateTimeFormat('en-GB', options);
  const parts = dateTimeFormat.formatToParts(date);

  let hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const minute = parts.find((p) => p.type === 'minute')?.value;
  const dayPeriod = parts
    .find((p) => p.type === 'dayPeriod')
    ?.value?.toLowerCase();
  const day = parts.find((p) => p.type === 'day')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;

  if (hour === '00') {
    hour = '12';
  }

  const formattedDate = `${day} ${month}`;
  const formattedTime = `${hour}:${minute} ${dayPeriod}`;

  return { date: formattedDate, time: formattedTime };
};

export const convertToIST = (utcDate: string | number | Date) => {
  const date = new Date(utcDate);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const istDate = date.toLocaleString('en-GB', options);
  const [day, month, year] = istDate.split('/');
  return `${year}-${month}-${day}`;
};

export const convertLocalToUTC = (localDateTime: any) => {
  const localDate = new Date(localDateTime);
  const utcDateTime = localDate.toISOString();
  return utcDateTime;
};

export const getCurrentYearPattern = () => {
  const currentYear = new Date().getFullYear();

  // Build the dynamic part for the current century
  let regexPart = '';
  if (currentYear >= 2000 && currentYear < 2100) {
    const lastDigit = currentYear % 10;
    const middleDigit = Math.floor((currentYear % 100) / 10);

    regexPart = `20[0-${middleDigit - 1}][0-9]|20${middleDigit}[0-${lastDigit}]`;
  }

  // Full regex covering 1900–1999, 2000 to current year
  return `^(19[0-9]{2}|${regexPart})$`;
};

export const extractAddress = (
  fields: any[],
  stateLabel: string = 'STATES',
  districtLabel: string = 'DISTRICTS',
  blockLabel: string = 'BLOCKS',
  searchKey: string = 'label',
  returnKey: string = 'value',
  toPascalCase: (str: string) => string = (str) => str // Default to identity function if not provided
): string => {
  const stateName = getFieldValue(fields, searchKey, stateLabel, returnKey);
  const districtName = getFieldValue(
    fields,
    searchKey,
    districtLabel,
    returnKey
  );
  const blockName = getFieldValue(fields, searchKey, blockLabel, returnKey);

  const address = [stateName, districtName, blockName]
    .filter(Boolean)
    .map(toPascalCase)
    .join(', ');

  return address;
};

export function filterMiniProfileFields(customFieldsData: UpdateCustomField[]) {
  const filteredFields = [];
  for (const item of customFieldsData) {
    if (labelsToExtractForMiniProfile.includes(item.label ?? '')) {
      filteredFields.push({ label: item?.label, value: item?.value });
    }
  }
  return filteredFields;
}

export const getUserDetailsById = (data: any[], userId: any) => {
  const user = data?.find((user: { userId: any }) => user?.userId === userId);

  if (user) {
    return {
      status: user?.status,
      statusReason: user?.statusReason,
      cohortMembershipId: user?.cohortMembershipId,
    };
  }

  return null;
};

export const getEmailPattern = (): string => {
  return '^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$';
};

export const translateString = (t: any, label: string) => {
  return t(`FORM.${label}`) === `FORM.${label}`
    ? toPascalCase(label)
    : t(`FORM.${label}`);
};

export const getAfterDate = (selectedDate: string) => {
  const selected = dayjs.utc(selectedDate, 'YYYY-MM-DD');
  const afterDate = selected.subtract(1, 'day').hour(18).minute(30).second(0);
  return afterDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
};

export const getBeforeDate = (selectedDate: string) => {
  const selected = dayjs.utc(selectedDate, 'YYYY-MM-DD');
  const beforeDate = selected.hour(18).minute(29).second(59);
  return beforeDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
};

export const format2DigitDate = (dateStr: any) => {
  if (dateStr === undefined || dateStr === null) return '';
  const dateObj = parseISO(dateStr);

  // Format the date into "2 Feb, 2024" format
  return format(dateObj, 'd MMM, yyyy');
};

export const sortSessions = (sessionArray: any[]) => {
  if (!Array.isArray(sessionArray)) return [];

  return sessionArray.sort((a: any, b: any) => {
    const timeA = new Date(a?.startDateTime).getTime();
    const timeB = new Date(b?.startDateTime).getTime();
    return timeA - timeB; // Ascending order (earliest first)
  });
};

export const sortSessionsByTime = (sessionsArray: any) => {
  const passed: any = [];
  const live: any = [];
  const upcoming: any = [];
  const currentTime = new Date();

  sessionsArray?.forEach((item: any) => {
    const eventStart = new Date(item?.startDateTime);
    const eventEnd = new Date(item?.endDateTime);

    if (currentTime < eventStart) {
      upcoming.push(item);
    } else if (currentTime >= eventStart && currentTime <= eventEnd) {
      live.push(item);
    } else if (currentTime > eventEnd) {
      passed.push(item);
    }
  });
  const index = passed.length;
  return { sessionList: [...passed, ...live, ...upcoming], index };
};

// Helper function to get options by category
export const getOptionsByCategory = (frameworks: any, categoryCode: string) => {
  // Find the category by code
  const category = frameworks?.categories?.find(
    (category: any) => category?.code === categoryCode
  );

  // Return the mapped terms
  return category?.terms?.filter((term: any) => {
    if (term.status === 'Live') {
      return {
        name: term?.name,
        code: term?.code,
        associations: term?.associations,
      };
    }
  });
};

interface Association {
  identifier: string;
  code: string;
  name: string;
  category: string;
  status: string;
  [key: string]: any; // To include any additional fields
}

interface DataItem {
  name: string;
  code: string;
  associations: Association[];
}
export const getAssociationsByName = (
  data: DataItem[],
  name: string
): Association[] | [] => {
  const foundItem = data.find((item) => item.name === name);
  return foundItem ? foundItem.associations : [];
};

export const getAssociationsByCodeNew = (
  data: DataItem[],
  code: string
): Association[] | [] => {
  const foundItem = data?.find((item) => item?.name === code);
  return foundItem ? foundItem?.associations : [];
};

export const getAssociationsByCode = (
  data: DataItem[],
  code: string
): Association[] | [] => {
  const foundItem = data.find((item) => item.code === code);
  return foundItem ? foundItem.associations : [];
};

export const findCommonAssociations = (data1: any[], data2: any[]) => {
  if (!data1?.length) return data2;
  if (!data2?.length) return data1;

  return data1
    ?.map((item1) => {
      const item2 = data2?.find((item) => item?.code === item1?.code);
      if (item2) {
        const commonAssociations = item1?.associations?.filter((assoc1: any) =>
          item2?.associations?.some(
            (assoc2: any) => assoc1?.identifier === assoc2?.identifier
          )
        );
        if (commonAssociations?.length > 0) {
          return {
            name: item1?.name,
            code: item1?.code,

            associations: commonAssociations,
          };
        }
      }
      return null;
    })
    .filter(Boolean);
};

export const filterAndMapAssociationsNew = (
  category: string,
  options?: any[],
  associationsList?: any[],
  codeKey: string = 'code'
) => {
  if (!Array.isArray(options)) {
    console.error('Options is not an array:', options);
    return [];
  }

  if (!associationsList || associationsList?.length === 0) {
    return [];
  }

  return options
    .filter((option) => {
      const optionCode = option[codeKey];

      return associationsList?.some(
        (assoc) => assoc[codeKey] === optionCode && assoc?.category === category
      );
    })
    .map((option) => ({
      name: option?.name,
      code: option?.code,
      associations: option?.associations || [],
    }));
};

export const extractCategory = (data: any[] | any, category: string) => {
  const items = Array.isArray(data) ? data : [data];
  return items.flatMap((item) =>
    item.associations
      .filter(
        (association: { category: string }) => association.category === category
      )
      .map(
        ({
          name,
          code,
          identifier,
        }: {
          name: string;
          code: string;
          identifier: string;
        }) => ({
          name,
          code,
          identifier,
        })
      )
  );
};

export const findCommon = (data1: any[], data2: any[]) => {
  const data1Codes = new Set(data1.map((item) => item.code));
  return data2.filter((item) => data1Codes.has(item.code));
};

export function deepClone<T>(obj: T): T {
  // Check if structuredClone is available
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }

  // Fallback to JSON method for deep cloning
  return JSON.parse(JSON.stringify(obj));
}

export const updateStoreFromCohorts = (
  activeCohorts: any,
  blockObject: any
) => {
  const setDistrictCode = manageUserStore.getState().setDistrictCode;
  const setDistrictId = manageUserStore.getState().setDistrictId;
  const setStateCode = manageUserStore.getState().setStateCode;
  const setStateId = manageUserStore.getState().setStateId;
  const setBlockCode = manageUserStore.getState().setBlockCode;
  const setBlockId = manageUserStore.getState().setBlockId;
  const setBlockName = manageUserStore.getState().setBlockName;
  const setDistrictName = manageUserStore.getState().setDistrictName;
  const setStateName = manageUserStore.getState().setStateName;

  const district = activeCohorts?.[0]?.customField?.find(
    (item: any) => item?.label === 'DISTRICTS'
  );
  if (district) {
    setDistrictCode(district?.code);
    setDistrictId(district?.fieldId);
    setDistrictName(district?.value);
  }

  const state = activeCohorts?.[0]?.customField?.find(
    (item: any) => item?.label === 'STATES'
  );

  if (state) {
    setStateCode(state?.code);
    setStateId(state?.fieldId);
    setStateName(state?.value);
  }

  if (blockObject) {
    setBlockCode(blockObject?.code);
    setBlockId(blockObject?.fieldId);
    setBlockName(blockObject?.value);
  }
};

export function formatEndDate({ diffDays }: any) {
  // Check if structuredClone is available
  if (diffDays) {
    let remainingTime = '';
    if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;

      const months = Math.floor(remainingDays / 30.44);
      const days = Math.round(remainingDays % 30.44);

      remainingTime = `${years} year(s)${months > 0 ? `, ${months} month(s)` : ''}${days > 0 ? `,  ${days} day(s)` : ''}`;
    } else if (diffDays > 31) {
      const months = Math.floor(diffDays / 30.44);
      const days = Math.round(diffDays % 30.44);

      remainingTime = `${months} month(s) ${days > 0 ? ` , ${days} day(s)` : ''}`;
    } else {
      remainingTime = `${diffDays} day(s)`;
    }
    return remainingTime;
  }
  return '';
}

//TODO: Modify Helper with correct logic
export const calculateStageCounts = (
  data: { completedStep: any }[]
): BoardEnrollmentStageCounts => {
  const stagesCount: BoardEnrollmentStageCounts = {
    board: 0,
    subjects: 0,
    registration: 0,
    fees: 0,
    completed: 0,
  };

  const stageKeys: Record<number, keyof BoardEnrollmentStageCounts> = {
    0: 'board',
    1: 'subjects',
    2: 'registration',
    3: 'fees',
    4: 'completed',
  };

  data.forEach(({ completedStep }) => {
    const key = stageKeys[completedStep];
    if (key) stagesCount[key] += 1;
  });

  return stagesCount;
};

export function getCohortNameById(
  cohorts: { cohortId: string; name: string }[],
  cohortId: string
): string | null {
  const cohort = cohorts.find((c) => c.cohortId === cohortId);
  return cohort ? cohort.name : null;
}
// const isFieldFilled = (key: string, value: any): boolean => {
//   if (key === "SUBJECTS") {
//     return Array.isArray(value) && value.length > 0;
//   }
//   return value && value !== ""; // General check for other fields
// };

//  export const calculateStageCount = (formData: Record<string, any>): number =>
//  Object.entries(formData).reduce(
//    (count, [key, value]) => count + (isFieldFilled(key, value) ? 1 : 0),
//    0
//  );

export const getTelemetryForContent = (
  contentType: string,
  identifier: string
) => {
  const keys = Object.keys(localStorage);
  const telemetryEvents = keys
    .filter((key) => key.startsWith(`${contentType}_${identifier}`))
    .map((key) => JSON.parse(localStorage.getItem(key) || '{}'));

  return telemetryEvents;
};

export interface UserEntry {
  userId: string;
  name: string;
  memberStatus: string;
  createdAt: string;
  updatedAt: string;
  firstName?: string
}

export function getLatestEntries(
  nameUserIdArray: UserEntry[],
  selectedDate: string
): UserEntry[] {
  const filteredEntries: Record<string, UserEntry> = {};

  nameUserIdArray.forEach((entry) => {
    const { userId, updatedAt, createdAt } = entry;
    const updatedDate = new Date(updatedAt);
    updatedDate.setHours(0, 0, 0, 0);
    const selectDate = new Date(selectedDate);
    selectDate.setHours(0, 0, 0, 0);
    const createdDate = new Date(createdAt);
    createdDate.setHours(0, 0, 0, 0);

    // Only consider entries with updatedAt < selectedDate or createdDate <= selectDate
    if (updatedDate < selectDate || createdDate <= selectDate) {
      if (
        !filteredEntries[userId] ||
        new Date(filteredEntries[userId].updatedAt) < updatedDate
      ) {
        // Update the entry if it is newer
        filteredEntries[userId] = entry;
      }
    }
  });
  return Object.values(filteredEntries);
}

export const getUserFullName = (user?: {
  firstName?: string;
  lastName?: string;
  name?: string;
}): string => {
  let userData;
  if (user) {
    userData = user;
  } else {
    userData = localStorage.getItem('userData');
    userData = JSON.parse(userData || '{}');
  }

  if (userData?.firstName) {
    const lastName = userData?.lastName || '';
    return `${userData.firstName} ${lastName}`;
  } else if (userData?.name) {
    return userData.name;
  }

  return '';
};
export const calculateAge = (dob: any) => {
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1;
  }
  return age;
};

export const getBMG = (cohortData: any) => {
  if (cohortData) {
    if (cohortData?.customField?.length) {
      const medium = cohortData.customField.find(
        (item: CustomField) => item.label === 'MEDIUM'
      );

      const grade = cohortData.customField.find(
        (item: CustomField) => item.label === 'GRADE'
      );

      const board = cohortData.customField.find(
        (item: CustomField) => item.label === 'BOARD'
      );
      const bmg = {
        board: board?.value,
        medium: medium?.value,
        grade: grade?.value,
      };
      return bmg;
    }
  }
  return null;
};


export const getLastDayDate = (): string => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1); // Subtract 1 day
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getAssessmentType = (type: string) => {
  if (type === 'pre') {
    return AssessmentType.PRE_TEST;
  } else if (type === 'post') {
    return AssessmentType.POST_TEST;
  } else {
    return AssessmentType.OTHER;
  }
}
export const preserveLocalStorage = () => {
  const keysToKeep = [
    'preferredLanguage',
    'mui-mode',
    'mui-color-scheme-dark',
    'mui-color-scheme-light',
    'hasSeenTutorial',
  ];

  const valuesToKeep: { [key: string]: any } = {};

  keysToKeep.forEach((key: string) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      valuesToKeep[key] = value;
    }
  });

  localStorage.clear();

  keysToKeep.forEach((key: string) => {
    if (valuesToKeep[key] !== undefined) {
      localStorage.setItem(key, valuesToKeep[key]);
    }
  });
};
