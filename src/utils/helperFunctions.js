import { store as notifincationStore } from 'react-notifications-component';
import { format, intervalToDuration } from 'date-fns';
import { AIRLINES } from './constants';
import AIRPORTS from '../data/airports.json';

export const successMessage = (message) => {
  notifincationStore.addNotification({
    title: 'Success!',
    message,
    type: 'success',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true
    }
  });
};

export const errorMessage = (message) => {
  notifincationStore.addNotification({
    title: 'Failed!',
    message,
    type: 'danger',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true
    }
  });
};

export const infoMessage = (message) => {
  notifincationStore.addNotification({
    title: 'Info!',
    message,
    type: 'info',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true
    }
  });
};

export const warningMessage = (message) => {
  notifincationStore.addNotification({
    title: 'Warning!',
    message,
    type: 'warning',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true
    }
  });
};

export const getFormattedDate = (_date) => format(new Date(_date), 'dd/MM/yyyy HH:mm');
export const getAirlineNameById = (id) =>
  AIRLINES.filter((el) => el.id === id).length > 0
    ? AIRLINES.filter((el) => el.id === id)[0].label
    : 'Not Available';

export const getAirportNameById = (id) =>
  AIRPORTS.filter((el) => el.ID === id).length > 0
    ? `${AIRPORTS.filter((el) => el.ID === id)[0].value}`
    : 'Not Available';

export const getUserRoleName = (role) => {
  if (role === 1) return 'Agent';
  if (role === 2) return 'Admin';
  return 'Supplier';
};

export const getDateDuration = (startDate, endDate) => {
  const { days, hours, minutes } = intervalToDuration({
    start: new Date(startDate),
    end: new Date(endDate)
  });
  let result = '';
  if (days) result += `${days} day `;
  if (hours) result += `${hours} hrs `;
  if (minutes) result += `${minutes} min`;
  return result;
};
