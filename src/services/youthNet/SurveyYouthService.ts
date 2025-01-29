import axios from 'axios';
import { MOCK_SURVEY_CONFIG } from '@/components/youthNet/tempConfigs';
import { studentListDetails } from '@/components/youthNet/tempConfigs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const USE_MOCK = MOCK_SURVEY_CONFIG.surveyAvailable;
const USE_STUDENT_MOCK = studentListDetails;

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

export const fetchStudentData = async (): Promise<any> => {
  if (USE_STUDENT_MOCK) {
    return USE_STUDENT_MOCK;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/studentList`);
    return response?.data?.surveyAvailable || false;
  } catch (error) {
    console.error('Error fetching survey data:', error);
    return false;
  }
};
