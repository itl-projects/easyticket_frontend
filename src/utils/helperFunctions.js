import { store as notifincationStore } from 'react-notifications-component';
import { intervalToDuration } from 'date-fns';
import { format, zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { AIRLINES, USER_ROLES } from './constants';
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
      duration: 8000,
      onScreen: true
    }
  });
};

export function getTimeZoneDate(date) {
  return zonedTimeToUtc(date, 'Asia/Kolkata');
}

export const getFormattedDate = (_date) =>
  format(utcToZonedTime(new Date(_date), 'Asia/Kolkata'), 'dd/MM/yyyy HH:mm', {
    timeZone: 'Asia/Kolkata'
  });
export const getAirlineNameById = (id) =>
  AIRLINES.filter((el) => el.id === id).length > 0
    ? AIRLINES.filter((el) => el.id === id)[0].label
    : 'Not Available';

export const getAirportNameById = (id) =>
  AIRPORTS.filter((el) => el.ID === id).length > 0
    ? `${AIRPORTS.filter((el) => el.ID === id)[0].value}`
    : 'Not Available';

export const getUserRoleName = (role) => {
  switch (role) {
    case USER_ROLES.USER:
      return 'Agent';
    case USER_ROLES.SUPPLIER:
      return 'Supplier';
    case USER_ROLES.ADMIN:
      return 'Admin';
    default:
      return 'Unknown';
  }
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

export const formatPrice = (price) => {
  price = price.toString();
  let lastThree = price.substring(price.length - 3);
  const otherNumbers = price.substring(0, price.length - 3);
  if (otherNumbers !== '') lastThree = `,${lastThree}`;
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
};

export const getAirPortIDByCode = (code) =>
  AIRPORTS.filter((el) => el.value === code).length > 0
    ? `${AIRPORTS.filter((el) => el.value === code)[0].ID}`
    : '';
