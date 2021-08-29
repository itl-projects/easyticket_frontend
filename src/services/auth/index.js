import axiosInstance from '../../config/axiosConfig';

const PATH = 'auth';

export async function loginUser(data) {
  try {
    const res = await axiosInstance.post(PATH, data);
    return res;
  } catch (err) {
    return null;
  }
}

export async function registerUser(data) {
  try {
    const res = await axiosInstance.post(`${PATH}/register`, data);
    return res;
  } catch (err) {
    return null;
  }
}
