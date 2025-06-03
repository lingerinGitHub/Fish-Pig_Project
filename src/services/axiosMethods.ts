import axiosInstance from './axiosInstance';


// export const fetchChatInfo = async () => {
//   try {
//     const response = await axiosInstance.get('/chat/info');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching chat info:', error);
//     throw error;
//   }
// };


// 封装 GET 请求
export const get = (url: string, params = {}) => {
  return axiosInstance.get(url, {
    params
  });
};

// 封装 POST 请求
export const post = (url: string, data = {}) => {
  return axiosInstance.post(url, data);
};

export const fish_post = (url: string, data = {}, params = {}) => {
  return axiosInstance.post(url, data, {
    params, headers: {
      'Authorization': `${localStorage.getItem('token')}`
    }
  });
};

// 封装 PUT 请求
export const put = (url: string, data = {}) => {
  return axiosInstance.put(url, data);
}
// 其他 API 请求可以在这里继续封装


// 发送 GET 请求
// get('/user/profile')
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(customError => {
//     console.error(customError.message);
//     // 显示错误消息
//   });

// // 发送 POST 请求
// post('/user/login', { username: 'example', password: 'password' })
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(customError => {
//     const errorCode = error.response.data.code;
//     const errorMessage = findErrorMessage(errorCode);
//     console.error(errorMessage);
//     // 显示错误消息
//   });