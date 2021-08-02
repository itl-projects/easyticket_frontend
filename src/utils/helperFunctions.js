import { store as notifincationStore } from 'react-notifications-component';

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
    type: 'failed',
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
