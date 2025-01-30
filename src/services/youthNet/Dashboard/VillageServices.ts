import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const DISTRICT_DETAILS = {
  DISTRICT_NAME: 'District',
  DISTRICT_OPTIONS: ['Pune', 'District 2', 'District 3', 'District 4'],
};

const BLOCK_DETAILS = {
  BLOCK_NAME: 'Block',
  BLOCK_OPTIONS: ['Shivneri', 'Block 2', 'Block 3', 'Block 4'],
};

export const fetchDistrictData = async (): Promise<any> => {
  if (DISTRICT_DETAILS) {
    return DISTRICT_DETAILS;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/villageList`);
    return response?.data?.surveyAvailable || false;
  } catch (error) {
    console.error('Error fetching survey data:', error);
    return false;
  }
};

export const fetchBlockData = async (): Promise<any> => {
  if (BLOCK_DETAILS) {
    return BLOCK_DETAILS;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/villageList`);
    return response?.data?.surveyAvailable || false;
  } catch (error) {
    console.error('Error fetching survey data:', error);
    return false;
  }
};
