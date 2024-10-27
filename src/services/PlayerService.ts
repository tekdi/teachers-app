import { URL_CONFIG } from '../utils/url.config';
import axios from 'axios';

export const fetchContent = async (identifier: any) => {
  try {
    const API_URL = `${process.env.NEXT_PUBLIC_WORKSPACE_BASE_URL}${URL_CONFIG.API.CONTENT_READ}${identifier}`;
    const FIELDS = URL_CONFIG.PARAMS.CONTENT_GET;
    const LICENSE_DETAILS = URL_CONFIG.PARAMS.LICENSE_DETAILS;
    const MODE = 'edit';
    const response = await axios.get(
      `${API_URL}?fields=${FIELDS}&mode=${MODE}&licenseDetails=${LICENSE_DETAILS}`
    );
    console.log('response =====>', response);
    return response.data.result.content;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};
