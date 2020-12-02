import axios, {
    AxiosRequestConfig,
    AxiosResponse,
    AxiosInstance,
    AxiosPromise,
    AxiosInterceptorManager,
} from 'axios';
import { history } from 'umi';
import { message as messageBox } from 'antd';
import { stringify } from 'querystring';
import qs from 'qs'
import { ls } from '@/utils/utils'


interface HztlAxiosRequestConfig extends AxiosRequestConfig {
    ignoreErr?: boolean; // 后端报错单独处理
    ignoreAllErr?: boolean; // 屏蔽所有错误
}

interface HztlAxiosResponse<T = any> extends AxiosResponse<T> {
    config: HztlAxiosRequestConfig;
}

interface HztlAxiosInstance extends AxiosInstance {
    (config: HztlAxiosRequestConfig): AxiosPromise;
    (url: string, config?: HztlAxiosRequestConfig): AxiosPromise;
    interceptors: {
        request: AxiosInterceptorManager<HztlAxiosRequestConfig>;
        response: AxiosInterceptorManager<HztlAxiosResponse>;
    };
    getUri(config?: HztlAxiosRequestConfig): string;
    request<T = any, R = HztlAxiosResponse<T>>(
        config: HztlAxiosRequestConfig,
    ): Promise<R>;
    get<T = any, R = HztlAxiosResponse<T>>(
        url: string,
        config?: HztlAxiosRequestConfig,
    ): Promise<R>;
    delete<T = any, R = HztlAxiosResponse<T>>(
        url: string,
        config?: HztlAxiosRequestConfig,
    ): Promise<R>;
    head<T = any, R = HztlAxiosResponse<T>>(
        url: string,
        config?: HztlAxiosRequestConfig,
    ): Promise<R>;
    options<T = any, R = HztlAxiosResponse<T>>(
        url: string,
        config?: HztlAxiosRequestConfig,
    ): Promise<R>;
    post<T = any, R = HztlAxiosResponse<T>>(
        url: string,
        data?: any,
        config?: HztlAxiosRequestConfig,
    ): Promise<R>;
    put<T = any, R = HztlAxiosResponse<T>>(
        url: string,
        data?: any,
        config?: HztlAxiosRequestConfig,
    ): Promise<R>;
    patch<T = any, R = HztlAxiosResponse<T>>(
        url: string,
        data?: any,
        config?: HztlAxiosRequestConfig,
    ): Promise<R>;
}


const codeMessage: { [propName: number]: string } = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};


const request: HztlAxiosInstance = axios.create({
    withCredentials: true,
    timeout: 6000 // 请求超时时间
});

request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const whiteUrl: string[] = ['/user/admin_login']


request.interceptors.request.use(
    (config: HztlAxiosRequestConfig) => {
        var token: string = ls.get('token')
        if (config.method === 'post') {
            config.data = qs.stringify(config.data)
        }
        if (!whiteUrl.includes(config.url!)) {
            config.headers['token'] = token
        }
        return ({
            ...config,
            url: config.url,
            baseURL: process.env.APP_API_BASE_URL + '/v1',
        });
    },
    error => {
        return Promise.reject(error);
    },
);

request.interceptors.response.use(
    res => {
        const { data, config } = res;
        const { ignoreErr, ignoreAllErr } = config;
        const { code } = data;
        if (code == 200) {
            return Promise.resolve(res.data);
        }
        if (code === 401) {
            if (!ignoreAllErr) {
                history.replace({
                    pathname: '/user/login',
                    search: stringify({
                        redirect: window.location.href,
                    }),
                });
            }
        } else if (!ignoreErr) {
            messageBox.warning(res.data.msg);
        }
        return Promise.reject(res.data);
    },
    error => {
        const { response } = error;
        if (response && response.status) {
            const { status } = response;
            messageBox.error(`${codeMessage[status]} 请求错误 ${status}`);
        } else if (!response) {
            messageBox.error('网络异常，无法连接服务器');
        }
        return Promise.reject(response);
    },
);

export default request;
