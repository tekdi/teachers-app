import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const MENTOR_DETAILS = {
  MENTOR_NAME: 'Mentor',
  MENTOR_OPTIONS: ['Shivan Mathur', 'Vivek kasture', 'Rohan Nene', 'Sanket Jadhav'],
};

export const fetchUserData = async (): Promise<any> => {
  if (MENTOR_DETAILS) {
    return MENTOR_DETAILS;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/userList`);
    return response?.data?.surveyAvailable || false;
  } catch (error) {
    console.error('Error fetching survey data:', error);
    return false;
  }
};
