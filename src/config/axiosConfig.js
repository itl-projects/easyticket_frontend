import axios from 'axios';

import { store } from '../store';

const axiosInstance = axios.create({
  baseURL: 'https://easyticketapi.herokuapp.com/api/v1/'
});

// This allows you to intercept the request before it is sent and alter headers or anyting else that is passed to the axios config.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.idToken;
    if (token) config.headers.common.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // if (errorResponse.status !== 401) {
    //             return Promise.reject(error);
    //         }
    // return axios.post('/api/refresh_token', {
    //             'refresh_token': this._getToken('refresh_token')
    //         }).then(response => {
    //             saveToken();
    //             error.response.config.headers['Authorization'] = 'Bearer ' + response.data.access_token;
    //             return axios(error.response.config);
    //         }).catch(error => {
    //             destroyToken();
    //             this.router.push('/login');
    //             return Promise.reject(error);
    //         }).finally(createAxiosResponseInterceptor);
    console.log(`Interceptor Request Error${error.status}`);

    return Promise(error);
  }
);

// This allows you to intercept the response and check the status and error messages and if ncessary reject the promise.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(`Interceptor Response Error${error.response.status}`);
    if (error.response.status === 400) {
      return error.response;
    }
    return null;
  }
);

export default axiosInstance;
