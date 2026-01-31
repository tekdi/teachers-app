import { fetchAttendanceStats } from './helperAttendanceStatApi';
import { getLearnerAttendanceStatus } from '../services/AttendanceService';
import { formatSelectedDate } from './Helper';
import { LearnerAttendanceProps } from './Interfaces';

// Mock the AttendanceService module
jest.mock('../services/AttendanceService', () => ({
  getLearnerAttendanceStatus: jest.fn(),
}));

// Mock the Helper module
jest.mock('./Helper', () => ({
  formatSelectedDate: jest.fn(),
}));

describe('helperAttendanceStatApi', () => {
  describe('fetchAttendanceStats', () => {
    const mockClassId = 'class-123';
    const mockUserId = 'user-456';
    const mockFormattedDate = '2026-01-31';
    const mockAttendanceList = [
      { date: '2026-01-31', status: 'present' },
      { date: '2026-01-30', status: 'absent' },
    ];

    let localStorageGetItemSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      // Use fake timers for date mocking
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-31T10:00:00Z'));

      // Mock localStorage
      localStorageGetItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockClassId);

      // Mock formatSelectedDate from Helper
      (formatSelectedDate as jest.Mock).mockReturnValue(mockFormattedDate);

      // Mock getLearnerAttendanceStatus service
      (getLearnerAttendanceStatus as jest.Mock).mockResolvedValue({
        data: {
          attendanceList: mockAttendanceList,
        },
      });

      // Spy on console.error
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    // =============================
    // HAPPY PATH TESTS
    // =============================

    it('should fetch attendance stats successfully with valid userId', async () => {
      const result = await fetchAttendanceStats(mockUserId);

      expect(result).toEqual(mockAttendanceList);
      expect(localStorageGetItemSpy).toHaveBeenCalledWith('classId');
      expect(formatSelectedDate).toHaveBeenCalledTimes(2);
      expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: {
            contextId: mockClassId,
            fromDate: mockFormattedDate,
            toDate: mockFormattedDate,
            scope: 'student',
            userId: mockUserId,
          },
        })
      );
    });

    it('should use current date for attendance request', async () => {
      await fetchAttendanceStats(mockUserId);

      const callArgs = (formatSelectedDate as jest.Mock).mock.calls[0][0];
      expect(callArgs).toBeInstanceOf(Date);
      expect(callArgs.getTime()).toBe(new Date('2026-01-31T10:00:00Z').getTime());
    });

    // =============================
    // EDGE CASE: Empty/Invalid userId
    // =============================

    it('should handle empty string userId', async () => {
      const result = await fetchAttendanceStats('');

      expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            userId: '',
          }),
        })
      );
      expect(result).toEqual(mockAttendanceList);
    });

    it('should handle null userId (type coercion)', async () => {
      await fetchAttendanceStats(null as any);

      expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            userId: null,
          }),
        })
      );
    });

    it('should handle undefined userId', async () => {
      await fetchAttendanceStats(undefined as any);

      expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            userId: undefined,
          }),
        })
      );
    });

    // =============================
    // EDGE CASE: localStorage returns null
    // =============================

    it('should use empty string when localStorage.getItem returns null', async () => {
      localStorageGetItemSpy.mockReturnValue(null);

      await fetchAttendanceStats(mockUserId);

      expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            contextId: '',
          }),
        })
      );
    });

    it('should use empty string when localStorage.getItem returns undefined', async () => {
      localStorageGetItemSpy.mockReturnValue(undefined);

      await fetchAttendanceStats(mockUserId);

      expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            contextId: '',
          }),
        })
      );
    });

    // =============================
    // EDGE CASE: API Response Variations
    // =============================

    it('should return undefined when response.data is null', async () => {
      (getLearnerAttendanceStatus as jest.Mock).mockResolvedValue({
        data: null,
      });

      const result = await fetchAttendanceStats(mockUserId);

      expect(result).toBeUndefined();
    });

    it('should return undefined when response.data is undefined', async () => {
      (getLearnerAttendanceStatus as jest.Mock).mockResolvedValue({
        data: undefined,
      });

      const result = await fetchAttendanceStats(mockUserId);

      expect(result).toBeUndefined();
    });

    it('should return undefined when response is null', async () => {
      (getLearnerAttendanceStatus as jest.Mock).mockResolvedValue(null);

      const result = await fetchAttendanceStats(mockUserId);

      expect(result).toBeUndefined();
    });

    it('should return undefined when attendanceList is missing', async () => {
      (getLearnerAttendanceStatus as jest.Mock).mockResolvedValue({
        data: {},
      });

      const result = await fetchAttendanceStats(mockUserId);

      expect(result).toBeUndefined();
    });

    it('should handle empty attendanceList array', async () => {
      (getLearnerAttendanceStatus as jest.Mock).mockResolvedValue({
        data: {
          attendanceList: [],
        },
      });

      const result = await fetchAttendanceStats(mockUserId);

      expect(result).toEqual([]);
    });

    // =============================
    // ERROR HANDLING TESTS
    // =============================

    it('should catch and log API errors without throwing', async () => {
      const mockError = new Error('Network error');
      (getLearnerAttendanceStatus as jest.Mock).mockRejectedValue(mockError);

      const result = await fetchAttendanceStats(mockUserId);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching attendance stats:',
        mockError
      );
      expect(result).toBeUndefined();
    });

    it('should handle API timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      (getLearnerAttendanceStatus as jest.Mock).mockRejectedValue(timeoutError);

      const result = await fetchAttendanceStats(mockUserId);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle API 404 errors', async () => {
      const notFoundError = { status: 404, message: 'Not Found' };
      (getLearnerAttendanceStatus as jest.Mock).mockRejectedValue(notFoundError);

      const result = await fetchAttendanceStats(mockUserId);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching attendance stats:',
        notFoundError
      );
      expect(result).toBeUndefined();
    });

    it('should handle API 500 errors', async () => {
      const serverError = { status: 500, message: 'Internal Server Error' };
      (getLearnerAttendanceStatus as jest.Mock).mockRejectedValue(serverError);

      const result = await fetchAttendanceStats(mockUserId);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle non-Error objects thrown by API', async () => {
      (getLearnerAttendanceStatus as jest.Mock).mockRejectedValue('String error');

      const result = await fetchAttendanceStats(mockUserId);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching attendance stats:',
        'String error'
      );
      expect(result).toBeUndefined();
    });

    // =============================
    // INTEGRATION TESTS
    // =============================

    it('should call formatSelectedDate with the same date instance twice (from/to)', async () => {
      await fetchAttendanceStats(mockUserId);

      expect(formatSelectedDate).toHaveBeenCalledTimes(2);
      
      const firstCallDate = (formatSelectedDate as jest.Mock).mock.calls[0][0];
      const secondCallDate = (formatSelectedDate as jest.Mock).mock.calls[1][0];
      
      // Both calls should use the same date instance
      expect(firstCallDate).toEqual(secondCallDate);
    });

    it('should construct correct LearnerAttendanceProps object', async () => {
      await fetchAttendanceStats(mockUserId);

      const expectedRequest: LearnerAttendanceProps = {
        filters: {
          contextId: mockClassId,
          fromDate: mockFormattedDate,
          toDate: mockFormattedDate,
          scope: 'student',
          userId: mockUserId,
        },
      };

      expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(expectedRequest);
    });

    // =============================
    // BOUNDARY TESTS
    // =============================

    it('should handle very long userId strings', async () => {
      const longUserId = 'a'.repeat(1000);

      await fetchAttendanceStats(longUserId);

      expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            userId: longUserId,
          }),
        })
      );
    });

    it('should handle special characters in userId', async () => {
      const specialUserId = 'user@#$%^&*()_+-=[]{}|;:,.<>?';

      await fetchAttendanceStats(specialUserId);

      expect(getLearnerAttendanceStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            userId: specialUserId,
          }),
        })
      );
    });

    it('should handle numeric userId (type coercion)', async () => {
      const numericUserId = 12345 as any;

      await fetchAttendanceStats(numericUserId);

      expect(getLearnerAttendanceStatus).toHaveBeenCalled();
    });

    // =============================
    // ASYNC BEHAVIOR TESTS
    // =============================

    it('should wait for async operation to complete', async () => {
      let asyncCompleted = false;

      (getLearnerAttendanceStatus as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              asyncCompleted = true;
              resolve({ data: { attendanceList: mockAttendanceList } });
            }, 100);
          })
      );

      const promise = fetchAttendanceStats(mockUserId);
      
      expect(asyncCompleted).toBe(false);
      
      jest.runAllTimers();
      await promise;
      
      expect(asyncCompleted).toBe(true);
    });
  });
});
