import axios from 'axios';
import { MOCK_SURVEY_CONFIG } from '@/components/youthNet/tempConfigs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const USE_MOCK = MOCK_SURVEY_CONFIG.surveyAvailable;

export const fetchSurveyData = async (): Promise<boolean> => {
  if (USE_MOCK) {
    return MOCK_SURVEY_CONFIG.surveyAvailable;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/survey`);
    return response?.data?.surveyAvailable || false;
  } catch (error) {
    console.error('Error fetching survey data:', error);
    return false;
  }
};
