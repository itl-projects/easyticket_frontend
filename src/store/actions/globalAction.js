export const SET_REGISTRATION_STATUS = 'SET_REGISTRATION_STATUS';
export const REMOVE_REGISTRATION_STATUS = 'REMOVE_REGISTRATION_STATUS';

export const setRegistrationStatus = (status) => ({
  type: SET_REGISTRATION_STATUS,
  status
});

export const removeRegistrationStatus = () => ({
  type: REMOVE_REGISTRATION_STATUS
});
