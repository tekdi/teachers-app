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

export const shortDateFormat = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatSelectedDate = (inputDate: string) => {
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
  const monthNames = [
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
  const monthIndex = currentDate.getMonth();
  return monthNames[monthIndex];
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

export const formatSelectedDate = (inputDate: string) => {
  let date = new Date(inputDate);
  let year = date.getFullYear();
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);
  let formattedDate = year + '-' + month + '-' + day;
  console.log(formattedDate);
  return formattedDate;
};