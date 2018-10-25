import { sessionService } from 'redux-react-session';

import {
  SET_SUBMIT_SHELTER_DIALOG_OPEN,
  SET_SUBMIT_EMERGENCY_DIALOG_OPEN,
  SET_SELECTED_TAB,
} from './types';

/*
 * action creators
 */

export function setSubmitShelterDialogOpen(isOpen) {
  return {
    type: SET_SUBMIT_SHELTER_DIALOG_OPEN,
    payload: isOpen,
  };
}

export function setSubmitEmergencyDialogOpen(isOpen) {
  return {
    type: SET_SUBMIT_EMERGENCY_DIALOG_OPEN,
    payload: isOpen,
  };
}


export function setSelectedTab(selectedTab) {
  return {
    type: SET_SELECTED_TAB,
    payload: selectedTab,
  };
}

/*
 * Redux-react-session actions
 */

// This action is in a unique format based on redux-react-session
export function loginSucceeded(role, agency, agencyId, jwt, hashOfSsn) {
  return () => {
    return sessionService.saveSession({ jwt }).then(() => {
      sessionService.saveUser({ role, agency, agencyId, jwt, hashOfSsn }).then(() => {
      }).catch(err => console.error(err));
    }).catch(err => console.error(err));
  };
}

export function logout(history) {
  return () => {
    sessionService.deleteSession();
    sessionService.deleteUser();
    history.push('/login');
  };
}

