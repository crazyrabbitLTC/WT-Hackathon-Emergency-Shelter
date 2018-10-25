import { combineReducers } from 'redux';
import { sessionReducer } from 'redux-react-session';
import { drizzleReducers } from 'drizzle';

const INITIAL_STATE = {
  isSubmitShelterDialogOpen: false,
  isSubmitEmergencyDialogOpen: false,
};

const registerHotelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_SUBMIT_SHELTER_DIALOG_OPEN':
      return {
        ...state,
        isSubmitShelterDialogOpen: action.payload,
      };
    default:
      return state;
  }
};

const registerEmergencyReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_SUBMIT_EMERGENCY_DIALOG_OPEN':
      return {
        ...state,
        isSubmitEmergencyDialogOpen: action.payload,
      };
    default:
      return state;
  }
};

const setTabReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_SELECTED_TAB':
      return {
        ...state,
        selectedTab: action.payload,
      };
    default:
      return state;
  }
};

// Add the sessionReducer
const rootReducer = combineReducers({
  session: sessionReducer,
  registerHotelReducer,
  registerEmergencyReducer,
  setTabReducer,
  ...drizzleReducers,
});

export default rootReducer;
