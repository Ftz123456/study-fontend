import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { getToken } from '@/utils/auth';
import { useUserStore } from '@/store';
import router from '@/router';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['X-CSRF-TOKEN'] = token;
      // config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    // if the custom code is not 20000, it is judged as an error.
    // if (response.status !== 200) {
    //   Message.error({
    //     content: res.msg || 'Error',
    //     duration: 5 * 1000,
    //   });
    //   window.location.reload();
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (
    //     // [50008, 50012, 50014].includes(res.code) &&
    //     [401, 403].includes(response.status) &&
    //     response.config.url !== '/api/user/info'
    //   ) {
    //     Modal.error({
    //       title: 'Confirm logout',
    //       content:
    //         'You have been logged out, you can cancel to stay on this page, or log in again',
    //       okText: 'Re-Login',
    //       async onOk() {
    //         const userStore = useUserStore();
    //         await userStore.logout();
    //         window.location.reload();
    //       },
    //     });
    //   }
    //   return Promise.reject(new Error(res.msg || 'Error'));
    // }
    return response;
    // return response.data;
  },
  (error) => {
    const { response } = error;
    console.log('error', error);

    if (response.status === 401) {

      router.push({
        name: 'login',
      });

    }
    else {
      Message.error({
        content: error.response.data.msg || 'Request Error',
        duration: 5 * 1000,
      });
      // return Promise.reject(error);
    }
    // if (
    //   [50008, 50012, 50014].includes(response.data.code) &&
    //   response.config.url !== '/api/user/info'
    // ) {
    //   Modal.error({
    //     title: '请重新登录',
    //     content: response.data.data,
    //     okText: '重新登录',
    //     async onOk() {
    //       const userStore = useUserStore();
    //       await userStore.logout();
    //       window.location.reload();
    //     },
    //   });
    // } else {
    //   Message.error({
    //     content: error.response.data.msg || 'Request Error',
    //     duration: 5 * 1000,
    //   });
    //   // return Promise.reject(error);
    // }
    return Promise.reject(error);
  }
);
