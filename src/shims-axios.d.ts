import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    ignoreErr?: boolean;
    ignoreAllErr?: boolean;
  }

  export interface AxiosResponse<T> {
    code: number;
    result: T;
    msg: string;
  }
}
