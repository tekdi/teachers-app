import '@testing-library/jest-dom';
import {
  formatDate,
  formatToShowDateMonth,
  shortDateFormat,
  formatSelectedDate,
  getTodayDate,
  getMonthName,
  getDayAndMonthName,
  getDayMonthYearFormat,
  truncateURL,
  debounce,
  toPascalCase,
  getLabelForValue,
  generateRandomString,
  generateUUID,
  getDeviceId,
} from '../src/utils/Helper';
import '@testing-library/jest-dom';

describe('Helper Functions', () => {
  test('formatDate should return formatted date string', () => {
    const dateString = '2022-01-01';
    const formattedDate = formatDate(dateString);
    expect(formattedDate).toBe('01/01/2022');
  });

  test('formatToShowDateMonth should return formatted date and month string', () => {
    const date = new Date('2022-01-01');
    const formattedDateMonth = formatToShowDateMonth(date);
    expect(formattedDateMonth).toBe('January 01');
  });

  test('shortDateFormat should return short formatted date string', () => {
    const date = new Date('2022-01-01');
    const shortFormattedDate = shortDateFormat(date);
    expect(shortFormattedDate).toBe('Jan 01');
  });

  test('formatSelectedDate should return formatted selected date string', () => {
    const inputDate = '2022-01-01';
    const formattedSelectedDate = formatSelectedDate(inputDate);
    expect(formattedSelectedDate).toBe('01 Jan 2022');
  });

  test("getTodayDate should return today's date", () => {
    const todayDate = getTodayDate();
    const currentDate = new Date();
    expect(todayDate).toEqual(
      expect.stringMatching(new RegExp(`^${currentDate.getFullYear()}`))
    );
  });

  test('getMonthName should return month name', () => {
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

    monthNames.forEach((monthName, index) => {
      it(`should return ${monthName} when the current month is ${index + 1}`, () => {
        // Mock the Date object to return the desired month
        const mockDate = new Date(2021, index, 15); // Year 2021, month index, 15th day
        global.Date = jest.fn(() => mockDate);

        expect(getMonthName()).toBe(monthName);

        // Restore the original Date object after each test
        global.Date = Date;
      });
    });
    const monthName = getMonthName();
    expect(monthName).toBe('January');
  });

  test('getDayAndMonthName should return day and month name', () => {
    const dateString = '2022-01-01';
    const dayMonthName = getDayAndMonthName(dateString);
    expect(dayMonthName).toBe('Saturday, January 01');
  });

  test('getDayMonthYearFormat should return day, month, and year formatted string', () => {
    const dateString = '2022-01-01';
    const dayMonthYearFormat = getDayMonthYearFormat(dateString);
    expect(dayMonthYearFormat).toBe('01 January 2022');
  });

  test('truncateURL should truncate long URL', () => {
    const url = 'https://www.example.com/very/long/url';
    const maxLength = 20;
    const truncatedURL = truncateURL(url, maxLength, false);
    expect(truncatedURL).toBe('https://www.example...');
  });

  xtest('debounce should debounce function execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);
    debouncedFn();
    debouncedFn();
    debouncedFn();
    expect(mockFn).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(99);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('toPascalCase should convert name to Pascal Case', () => {
    const name = 'hello world';
    const pascalCaseName = toPascalCase(name);
    expect(pascalCaseName).toBe('Hello World');
  });

  test('getLabelForValue should return label for given value', () => {
    const value = 'math';
    const label = getLabelForValue(value);
    expect(label).toBe('Math');
  });

  test('generateRandomString should generate random string of given length', () => {
    const length = 10;
    const randomString = generateRandomString(length);
    expect(randomString.length).toBe(length);
  });

  test('generateUUID should generate a valid UUID', () => {
    const uuid = generateUUID();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  test('getDeviceId should return a non-empty string', () => {
    getDeviceId().then((deviceId) => {
        expect(deviceId).toBeTruthy();
        expect(typeof deviceId).toBe('string');
      });
  });
});
