import { scheduleEventParam } from '@/utils/Interfaces';
import { post } from './RestClient';

export const AssesmentListService = async ({
  filters,
}: scheduleEventParam): Promise<any> => {
  const apiUrl: string = 'http://3.109.46.84:4000/event/v1/list';
  try {
    const response = await post(apiUrl, { filters });
    return response?.data;
  } catch (error) {
    console.error('error in getting event List Service list', error);
    return error;
  }
};
