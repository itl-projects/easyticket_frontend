import axiosInstance from '../../config/axiosConfig';

export default class CreditRequestAPI {
  PATH = 'credits';

  async getCreditRequests(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/agent-credits`, data);
      return res;
    } catch (err) {
      return null;
    }
  }

  async sendCreditRequest(data) {
    try {
      const res = await axiosInstance.post(this.PATH, data);
      return res;
    } catch (err) {
      return err;
    }
  }
}
