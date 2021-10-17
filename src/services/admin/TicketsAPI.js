import axiosInstance from '../../config/axiosConfig';

export default class TicketAPI {
  PATH = 'tickets';

  async listTickets(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/list-tickets`, data);
      return res;
    } catch (err) {
      return null;
    }
  }

  async addTicket(data) {
    try {
      const res = await axiosInstance.post(this.PATH, data);
      return res;
    } catch (err) {
      return err;
    }
  }

  async addBulkTicket(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/create-bulk`, data);
      return res;
    } catch (err) {
      return err;
    }
  }

  async updateTicket(id, data) {
    try {
      const res = await axiosInstance.patch(`${this.PATH}/${id}`, data);
      return res;
    } catch (err) {
      return err;
    }
  }

  async removeTicket(id) {
    try {
      const res = await axiosInstance.delete(`${this.PATH}/${id}`);
      return res;
    } catch (err) {
      return err;
    }
  }
}
