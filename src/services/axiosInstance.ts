import axios from 'axios';
import { CURRENT_ENV_URL } from '../config/environment_config';
import { CustomError } from '../utils/customError';
import { router } from '@/router/index';

// 创建一个 Axios 实例
const axiosInstance = axios.create({
    baseURL: CURRENT_ENV_URL, // 替换为你的 API 基础 URL
    withCredentials: true, //跨域请求时发送cookie
    timeout: 5000, // 请求超时时间
    headers: {
        // 'Content-Type': 'application/json',
    },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    config => {

        // 在发送请求之前添加 accessToken
        const accessToken = localStorage.getItem('accessToken');

        config.headers['Authorization'] = accessToken;
        config.headers['username'] = 'xianyu';

        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    response => {
        // 对响应数据进行处理
        // 后端返回的数据格式如下：
        // {
        //     accessToken: '新的访问Token',
        //     refreshToken: '新的刷新Token'
        // }


        // 刷新本地存的token
        // if (data.accessToken || data.refreshToken) {
        //     if (data.accessToken) {
        //         localStorage.setItem('accessToken', data.accessToken);
        //     }
        // }
        if (response.data.code !== '200') {

            if (response.data.code == 401) {
                router.push('/')
            }

            throw new CustomError(response.data.message, response.data.code);
        }

        return response;
    },
    error => {

        // 对响应错误进行处理
        if (error.response) {
            console.log(error.response);
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            const errorCode = error.response.data.code;
            // const errorMessage = findErrorMessage(errorCode);
            throw new CustomError(error.response.data.message, errorCode);
            // 可以在这里根据错误代码执行不同的错误处理逻辑

        } else if (error.request) {
            // 请求已发出，但没有收到响应
            throw new CustomError("网络错误");
        } else {
            // 发送请求时出了点问题
            throw new CustomError("请求错误:" + error.message);
        }
        // return Promise.reject(error);
    }
);

export default axiosInstance;