import { assesmentListServiceParam } from '@/utils/Interfaces';
import { post } from './RestClient';

export const AssesmentListService = async ({
  sort,
  pagination,
  filters,
}: assesmentListServiceParam): Promise<any> => {
  // const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/tracking-assesment/list`;
  const apiUrl: string =
    'https://tracking-pratham.tekdinext.com/api/v1/tracking-assesment/list';
  try {
    console.log('data', apiUrl, pagination, filters, sort);
    const response = await post(apiUrl, { pagination, filters, sort });
    return response?.data;
  } catch (error) {
    console.error('error in getting Assesment List Service list', error);
    return error;
  }
};
