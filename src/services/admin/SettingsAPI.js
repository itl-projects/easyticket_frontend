import axiosInstance from '../../config/axiosConfig';

export default class SettingsAPI {
  PATH = 'settings';

  MARKUP_PATH = 'markup';

  async addMarkup(data) {
    try {
      const res = await axiosInstance.post(this.MARKUP_PATH, data);
      return res;
    } catch (err) {
      return err;
    }
  }

  async getMarkups(page, limit) {
    try {
      const res = await axiosInstance.get(`${this.MARKUP_PATH}?page=${page}&limit=${limit}`);
      return res;
    } catch (err) {
      return err;
    }
  }

  async getAllMarkups() {
    try {
      const res = await axiosInstance.get(`${this.MARKUP_PATH}/get-all`);
      return res;
    } catch (err) {
      return err;
    }
  }
}
