import { scheduleEventParam } from '@/utils/Interfaces';
import { post } from './RestClient';

export const AssesmentListService = async ({
  filters,
}: scheduleEventParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_EVENT_BASE_URL}/list`;
  try {
    const response = await post(apiUrl, { filters });
    return response?.data;
  } catch (error) {
    console.error('error in getting event List Service list', error);
    return error;
  }
};
