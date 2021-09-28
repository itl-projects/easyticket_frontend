import { SET_USER_DATA, REMOVE_USER_DATA, UPDATE_USER_DATA } from '../actions/authAction';

const initialState = {
  user: null,
  idToken: null
};

export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        user: action.data.user,
        idToken: action.data.token
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        user: action.data
      };
    case REMOVE_USER_DATA:
      return {
        ...state,
        user: null,
        idToken: null
      };
    default:
      return state;
  }
}
