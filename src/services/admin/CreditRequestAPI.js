import axiosInstance from '../../config/axiosConfig';

export default class CreditRequestAPI {
  PATH = 'credits-admin';

  async sendFundToUser(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/add-fund/`, data);
      return res;
    } catch (err) {
      return err;
    }
  }

  async getCreditRequests(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/requests`, data);
      return res;
    } catch (err) {
      return null;
    }
  }

  async approveCreditRequest(id) {
    try {
      const res = await axiosInstance.patch(`${this.PATH}/approve/${id}`);
      return res;
    } catch (err) {
      return err;
    }
  }

  async declineCreditRequest(id) {
    try {
      const res = await axiosInstance.patch(`${this.PATH}/decline/${id}`);
      return res;
    } catch (err) {
      return err;
    }
  }

  async settleCreditRequest(id) {
    try {
      const res = await axiosInstance.patch(`${this.PATH}/settle/${id}`);
      return res;
    } catch (err) {
      return err;
    }
  }
}
