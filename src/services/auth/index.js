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
