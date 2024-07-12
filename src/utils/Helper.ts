import FingerprintJS from 'fingerprintjs2';
import { Role, Status } from './app.constant';

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
  const [year, monthIndex, day] = dateString.split('-');
  const month = MONTHS[parseInt(monthIndex, 10) - 1];
  return `${day} ${month}, ${year}`;
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
  isMobile: boolean
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
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    clearTimeout(timeout!);
    if (immediate && !timeout) func.apply(context, args);
    timeout = setTimeout(() => {
      timeout = undefined;
      if (!immediate) func.apply(context, args);
    }, wait);
  };
};

//Function to convert names in capitalize case
export const toPascalCase = (name: string) => {
  return name
    .toLowerCase()
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
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const generateUUID = () => {
  var d = new Date().getTime();
  var d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
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

export const getFieldValue = (customField: any[], fieldName: any) => {
  const field = customField.find((field) => field.fieldname === fieldName);
  return field ? field.fieldvalues : 'N/A';
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
