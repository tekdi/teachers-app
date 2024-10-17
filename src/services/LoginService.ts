import axios from 'axios';
import { post } from './RestClient';

interface LoginParams {
  username: string;
  password: string;
}

interface RefreshParams {
  refresh_token: string;
}

export const login = async ({
  username,
  password,
}: LoginParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;

  try {
    const response = await post(apiUrl, { username, password });
    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};

export const refresh = async ({
  refresh_token,
}: RefreshParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`;
  try {
    const response = await post(apiUrl, { refresh_token });
    return response?.data;
  } catch (error) {
    console.error('error in login', error);
    throw error;
  }
};

export const logout = async (refreshToken: string): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`;
  try {
    const response = await post(apiUrl, { refresh_token: refreshToken });
    return response;
  } catch (error) {
    console.error('error in logout', error);
    throw error;
  }
};

export const resetPassword = async (
  newPassword: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`;
  try {
    const response = await post(apiUrl, { newPassword });
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
    throw error;
  }
};

export const forgotPasswordAPI = async (
  newPassword: any  , token: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/forgot-password`;
  try {
    const response = await post(apiUrl, { newPassword, token });
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
    throw error;
  }
};


export const resetPasswordLink = async (
  username: any , redirectUrl : any ): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/password-reset-link`;
  try {
    const response = await post(apiUrl, { username  , redirectUrl:process.env.NEXT_PUBLIC_BASE_LOGIN_URL });
    return response?.data;
  } catch (error) {
    console.error('error in reset', error);
    throw error;
  }
};



// export const successfulNotification = async (
//   isQueue:boolean,
//   context: any,
//   key: any,
//   email: any
// ): Promise<any> => {
//   const apiUrl: string =   `${process.env.NEXT_PUBLIC_NOTIFICATION_BASE_URL}/notification/send`;
//   try {
//     const response = await post(apiUrl, { isQueue, context, key, email });
//     console.log(email);
//     return response?.data;
//   } catch (error) {
//     console.error('error in reset', error);
//     throw error;
//   }
// };




