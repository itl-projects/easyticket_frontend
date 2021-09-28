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

  async changeUserActiveStatus(userId, status) {
    try {
      const res = await axiosInstance.patch(`${this.PATH}/changeAccountStatus/${userId}`, {
        status
      });
      return res;
    } catch (err) {
      return err;
    }
  }

  async getUsersCounts() {
    try {
      const res = await axiosInstance.get(`${this.PATH}/get-active-users`);
      return res;
    } catch (err) {
      return null;
    }
  }

  async addMarkupToUser(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/markup`, data);
      return res;
    } catch (err) {
      return null;
    }
  }

  async findUserByUsername(search) {
    try {
      const res = await axiosInstance.get(`${this.PATH}/match-user/${search}`);
      return res;
    } catch (err) {
      return null;
    }
  }

  async removeUserMarkup(id) {
    try {
      const res = await axiosInstance.delete(`${this.PATH}/markup/${id}`);
      return res;
    } catch (err) {
      return null;
    }
  }
}
