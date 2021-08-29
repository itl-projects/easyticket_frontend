import { SET_REGISTRATION_STATUS, REMOVE_REGISTRATION_STATUS } from '../actions/globalAction';

const initialState = {
  registrationStatus: null
};

export default function GlobalReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REGISTRATION_STATUS:
      return {
        ...state,
        registrationStatus: action.status
      };
    case REMOVE_REGISTRATION_STATUS:
      return {
        ...state,
        registrationStatus: null
      };
    default:
      return state;
  }
}
