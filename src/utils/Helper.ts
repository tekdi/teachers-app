export const ATTENDANCE_ENUM = {
    PRESENT: 'present',
    ABSENT: 'absent',
    HALF_DAY: 'half-day',
    NOT_MARKED: 'notmarked',
    ON_LEAVE: 'on-leave'
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
    'December'
  ];
  
  export const formatDate = (dateString: string) => {
    const [year, monthIndex, day] = dateString.split('-');
    const month = MONTHS[parseInt(monthIndex, 10) - 1];
    return `${day} ${month}, ${year}`;
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
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = currentDate.getMonth();
    return monthNames[monthIndex];
};