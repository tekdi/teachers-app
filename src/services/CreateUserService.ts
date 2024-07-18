import { get } from "./RestClient";

export const getFormRead = async (context: string, contextType: string): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/form/read?context=${context}&contextType=${contextType}`;
  try {
    let response = await get(apiUrl);

    const sortedFields = response?.data?.result.fields?.sort((a: { order: string; }, b: { order: string; }) => parseInt(a.order) - parseInt(b.order));
    const formData = {
      formid: response?.data?.result?.formid,
      title: response?.data?.result?.title,
      fields: sortedFields
    };
    return formData;

  } catch (error) {
    console.error('error in getting cohort details', error);
    // throw error;
  }
};
