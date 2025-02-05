import { SendCredentialsRequest } from '@/utils/Interfaces';
import { post, get } from './RestClient';
import { toPascalCase } from '@/utils/Helper';
import axios from 'axios';

export const sendCredentialService = async ({
  isQueue,
  context,
  key,
  replacements,
  email,
  push
}: SendCredentialsRequest): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/notification/send`;
  try {
    const response = await post(apiUrl, {
      isQueue,
      context,
      key,
      replacements,
      email,
      push
    });
    return response?.data?.result;
  } catch (error) {
    console.error('error in sending mail', error);
    return error;
  }
};


export const sendEmailOnFacilitatorCreation = async (
  name: string,
  username: string,
  password: string,
  email: string
) => {
  const replacements = {
    '{FirstName}': toPascalCase(name),
    '{UserName}': username,
    '{Password}': password,
    "{appUrl}": window.location.origin,
  };

  const sendTo = {
    receipients: [email],
  };

  return sendCredentialService({
    isQueue: false,
    context: 'USER',
    key: 'onFacilitatorCreated',
    replacements,
    email: sendTo,
  });
};

export const sendEmailOnLearnerCreation = async (
  name: string,
  username: string, 
  password: string,
  email: string,
  learnerName: string
) => {
  const replacements = {
    '{FirstName}': toPascalCase(name),
    '{UserName}': username,
    '{Password}': password,
    '{LearnerName}': toPascalCase(learnerName),
    "{appUrl}": window.location.origin,
  };

  const sendTo = {
    receipients: [email],
  };

  return sendCredentialService({
    isQueue: false,
    context: 'USER',
    key: 'onLearnerCreated',
    replacements,
    email: sendTo,
  });
};

// Push App Notification

export const UpdateDeviceNotification = async (
  userData: { deviceId: string, action: string },
  userId: string,
  headers: { tenantId: any; Authorization: string }
): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/update/${userId}`;

  try {
    const response = await axios.patch(apiUrl, { userData }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating device notification:', error);
    throw error;
  }
};



export const readUserId = async (
  userId?: string | string[],
  fieldValue?: boolean
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/v1/read/${userId}?fieldvalue=false`;
  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};


export const sendNotification = async ({
  isQueue,
  context,
  key,
  push
}: SendCredentialsRequest): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/notification/send`;
  try {
    const response = await post(apiUrl, {
      isQueue,
      context,
      key,
      push
    });
    return response?.data?.result;
  } catch (error) {
    console.error('Error in sending notification', error);
    return error;
  }
};


