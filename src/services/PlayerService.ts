import axios from 'axios';
import { URL_CONFIG } from '../utils/url.config';

export const fetchContent = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.CONTENT_READ}${identifier}`;
    const FIELDS = URL_CONFIG.PARAMS.CONTENT_GET;
    const LICENSE_DETAILS = URL_CONFIG.PARAMS.LICENSE_DETAILS;
    const MODE = 'edit';
    const response = await axios.get(
      `${API_URL}?fields=${FIELDS}&mode=${MODE}&licenseDetails=${LICENSE_DETAILS}`
    );
    return response?.data?.result?.content;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const fetchBulkContents = async (identifiers: string[]) => {
  try {
    const options = {
      request: {
        filters: {
          identifier: identifiers,
        },
        fields: [
            "name",
            "appIcon",
            "medium",
            "subject",
            "resourceType",
            "contentType",
            "organisation",
            "topic",
            "mimeType",
            "trackable",
            "gradeLevel"
        ],
      }
    }
    const response = await axios.post(URL_CONFIG.API.COMPOSITE_SEARCH, options);
    const result = response?.data?.result;
    if (response?.data?.result?.QuestionSet?.length) {
      // result.content = [...result.content, ...result.QuestionSet];
      const contents = result?.content ? [...result.content, ...result.QuestionSet] : [...result.QuestionSet]
      result.content = contents;
    }

    return result.content;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const getHierarchy = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.HIERARCHY_API}${identifier}`;
    const response = await axios.get(API_URL);
    return response?.data?.result?.content || response?.data?.result;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const getQumlData = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.QUESTIONSET_READ}${identifier}`;
    const FIELDS = URL_CONFIG.PARAMS.HIERARCHY_FEILDS;
    const response = await axios.get(`${API_URL}?fields=${FIELDS}`);
    return response?.data?.result?.content || response?.data?.result;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};
