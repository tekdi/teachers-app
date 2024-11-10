import { URL_CONFIG } from '../utils/url.config';
import axios from 'axios';

export const fetchContent = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.CONTENT_READ}${identifier}`;
    const FIELDS = URL_CONFIG.PARAMS.CONTENT_GET;
    const LICENSE_DETAILS = URL_CONFIG.PARAMS.LICENSE_DETAILS;
    const MODE = 'edit';
    const response = await axios.get(
      `${API_URL}?fields=${FIELDS}&mode=${MODE}&licenseDetails=${LICENSE_DETAILS}`
    );
    console.log('response =====>', response);
    return response?.data?.result?.content;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const getHierarchy = async (identifier: any) => {
  try {
    const API_URL = `${URL_CONFIG.API.HIERARCHY_API}${identifier}`;
    const response = await axios.get(API_URL);
    console.log('response =====>', response);
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
    console.log('response =====>', response);
    return response?.data?.result?.content || response?.data?.result;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};
