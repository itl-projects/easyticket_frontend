import axiosInstance from '../../config/axiosConfig';

export default class ProfileAPI {
  PATH = 'agent-profile';

  async updateProfileInfo(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/update-profile-info`, data);
      return res;
    } catch (err) {
      return null;
    }
  }

  async toggleTicketLogo() {
    try {
      const res = await axiosInstance.get(`${this.PATH}/toggle-ticket-logo`);
      return res;
    } catch (err) {
      return null;
    }
  }

  async changeProfileImage(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/upload-profile-image`, data);
      return res;
    } catch (err) {
      return null;
    }
  }

  async changePassword(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/change-password`, data);
      return res;
    } catch (err) {
      return null;
    }
  }
}
