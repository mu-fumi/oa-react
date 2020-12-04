import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * 这个不穿的话会拦截全局提示报错信息，传了的话会把错误信息返回
     */
    ignoreErr?: boolean;
    /**
     * 这个不穿的话，针对401 登录失效 提示报错信息
     */
    ignoreAllErr?: boolean;
  }

  export interface AxiosResponse<T> {
    code: number;
    result: T;
    msg: string;
  }
}
