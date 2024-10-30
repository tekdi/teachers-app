import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { tenantId } from '../../app.config';

export const getFormRead = async (
  context: string,
  contextType: string
): Promise<any> => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/form/read`,
        {
          params: {
            context,
            contextType,
          },
          paramsSerializer: (params) => {
            return Object.entries(params)
              .map(([key, value]) => `${key}=${value}`)
              .join('&');
          },
          headers: { tenantId: tenantId, Authorization : `Bearer ${token}`},
        }
      );
      const sortedFields = response?.data?.result.fields?.sort(
        (a: { order: string }, b: { order: string }) =>
          parseInt(a.order) - parseInt(b.order)
      );
      const formData = {
        formid: response?.data?.result?.formid,
        title: response?.data?.result?.title,
        fields: sortedFields,
      };
      return formData;
    }
  } catch (error) {
    console.error('error in getting cohort details', error);
    throw error;
  }
};

const useFormRead = (context: string, contextType: string) => {
  return useQuery({
    queryKey: ['formRead', context, contextType],
    queryFn: () => getFormRead(context, contextType),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export { useFormRead };
