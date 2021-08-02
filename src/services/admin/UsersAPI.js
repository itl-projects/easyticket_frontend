import axiosInstance from '../../config/axiosConfig';

export default class UserAPI {
  PATH = 'users';

  async listUsers(page, rowsPerPage) {
    try {
      const res = await axiosInstance.get(`${this.PATH}?page=${page}&limit=${rowsPerPage}`);
      return res;
    } catch (err) {
      return null;
    }
  }

  async addUser(data) {
    try {
      const res = await axiosInstance.post(this.PATH, data);
      return res;
    } catch (err) {
      return err;
    }
  }
}
