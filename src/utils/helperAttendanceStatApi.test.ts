import { fetchAttendanceStats } from './helperAttendanceStatApi';
import { getLearnerAttendanceStatus } from '../services/AttendanceService';
import { formatSelectedDate } from './Helper';
import { LearnerAttendanceProps } from './Interfaces';

// Mock external dependencies
jest.mock('../services/AttendanceService', () => ({
  getLearnerAttendanceStatus: jest.fn(),
}));

jest.mock('./Helper', () => ({
  formatSelectedDate: jest.fn(),
}));

describe('fetchAttendanceStats', () => {
  const classId = 'class-123';
  const userId = 'user-456';
  const formattedDate = '2026-01-31';

  const attendanceList = [
    { date: '2026-01-31', status: 'present' },
    { date: '2026-01-30', status: 'absent' },
  ];

  let localStorageSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Freeze time so date-based logic is predictable
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-31T10:00:00Z'));

    // Mock localStorage value
    localStorageSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(classId);

    // Mock helper date formatter
    (formatSelectedDate as jest.Mock).mockReturnValue(formattedDate);

    // Mock API success response
    (getLearnerAttendanceStatus as jest.Mock).mockResolvedValue({
      data: { attendanceList },
    });

    // Silence console errors during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });


  // Happy path
  

  it('returns attendance list when API succeeds', async () => {
    const result = await fetchAttendanceStats(userId);

    expect(result).toEqual(attendanceList);
    expect(localStorageSpy).toHaveBeenCalledWith('classId');
    expect(formatSelectedDate).toHaveBeenCalledTimes(2);
    expect(getLearnerAttendanceStatus).toHaveBeenCalled();
  });

  it('uses current system date for the request', async () => {
    await fetchAttendanceStats(userId);

    const dateArg = (formatSelectedDate as jest.Mock).mock.calls[0][0];
    expect(dateArg.getTime()).toBe(
      new Date('2026-01-31T10:00:00Z').getTime()
    );
  });


  
  // UserId edge cases
 

  it('handles empty userId', async () => {
    const result = await fetchAttendanceStats('');

    expect(result).toEqual(attendanceList);
    expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({ userId: '' }),
      })
    );
  });

  it('handles null and undefined userId', async () => {
    await fetchAttendanceStats(null as any);
    await fetchAttendanceStats(undefined as any);

    expect(getLearnerAttendanceStatus).toHaveBeenCalled();
  });


  // localStorage edge cases
 

  it('defaults contextId to empty string if classId is missing', async () => {
    localStorageSpy.mockReturnValue(null);

    await fetchAttendanceStats(userId);

    expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({ contextId: '' }),
      })
    );
  });

  
  // API response edge cases
  

  it('returns undefined for invalid or empty API responses', async () => {
    (getLearnerAttendanceStatus as jest.Mock).mockResolvedValueOnce({ data: null });
    expect(await fetchAttendanceStats(userId)).toBeUndefined();

    (getLearnerAttendanceStatus as jest.Mock).mockResolvedValueOnce({});
    expect(await fetchAttendanceStats(userId)).toBeUndefined();
  });

  it('returns empty array when attendance list is empty', async () => {
    (getLearnerAttendanceStatus as jest.Mock).mockResolvedValue({
      data: { attendanceList: [] },
    });

    const result = await fetchAttendanceStats(userId);
    expect(result).toEqual([]);
  });

 
  // Error handling


  it('logs error and returns undefined on API failure', async () => {
    const error = new Error('Network error');
    (getLearnerAttendanceStatus as jest.Mock).mockRejectedValue(error);

    const result = await fetchAttendanceStats(userId);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching attendance stats:',
      error
    );
    expect(result).toBeUndefined();
  });

  it('handles non-Error exceptions gracefully', async () => {
    (getLearnerAttendanceStatus as jest.Mock).mockRejectedValue('Some error');

    const result = await fetchAttendanceStats(userId);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

 
  // Integration sanity check
  

  it('builds correct API request payload', async () => {
    await fetchAttendanceStats(userId);

    const expectedRequest: LearnerAttendanceProps = {
      filters: {
        contextId: classId,
        fromDate: formattedDate,
        toDate: formattedDate,
        scope: 'student',
        userId,
      },
    };

    expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(expectedRequest);
  });

  
  // Async behavior
 

  it('waits for async API call to complete', async () => {
    let finished = false;

    (getLearnerAttendanceStatus as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            finished = true;
            resolve({ data: { attendanceList } });
          }, 100);
        })
    );

    const promise = fetchAttendanceStats(userId);
    expect(finished).toBe(false);

    jest.runAllTimers();
    await promise;

    expect(finished).toBe(true);
  });
});
