import axiosInstance from './Interceptor';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export async function get(
  url: string,
  headers: AxiosRequestConfig['headers'] = {}
): Promise<AxiosResponse> {
  return axiosInstance.get(url, { headers });
}

export async function post<T>(
  url: string,
  body: T,
  headers: AxiosRequestConfig['headers'] = {}
): Promise<AxiosResponse> {
  return axiosInstance.post(url, body, { headers });
}

export async function put<T>(
  url: string,
  body: T,
  headers: AxiosRequestConfig['headers'] = {}
): Promise<AxiosResponse> {
  return axiosInstance.put(url, body, { headers });
}

export async function patch<T>(
  url: string,
  body: T,
  headers: AxiosRequestConfig['headers'] = {}
): Promise<AxiosResponse> {
  return axiosInstance.patch(url, body, { headers });
}

export async function deleteApi<T>(
  url: string,
  body: T,
  headers: AxiosRequestConfig['headers'] = {}
): Promise<AxiosResponse> {
  return axiosInstance.delete(url, { data: body, headers });
}
