// Import React Modules
import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';

// Import Scenes
import ShelterListContainer from './ShelterListContainer/ShelterListContainer';
import SubmitShelterDialogContainer from './SubmitShelterDialogContainer/SubmitShelterDialogContainer';
import SubmitEmergencyDialogContainer from './SubmitEmergencyDialogContainer/SubmitEmergencyDialogContainer';

// Import Components
import Header from '../../components/Header/Header';
import AddShelterButton from '../../components/AddShelterButton/AddShelterButton';
import AddEmergencyButton from '../../components/AddEmergencyButton/AddEmergencyButton';
import ShelterItem from '../../components/ShelterItem/ShelterItem';

class Home extends Component {
  constructor(props) {
    super(props);
    this.handleAddShelterClick = this.handleAddShelterClick.bind(this);
  }

  handleAddShelterClick() {
    console.log('Clicked');
  }

  render() {
    return (
      <div className="row h-100">
        <Header/>
        <AddEmergencyButton/>
        <div className="main-content col-md-6 col-sm-10 offset-md-3 p-5">
          <Switch>
            <Route exact path="/" component={ShelterListContainer}/>
            <Route exact path="/emergency-one" component={ShelterListContainer}/>
            <Route exact path="/emergency-two" component={ShelterListContainer}/>
            <Route exact path="/shelter/:shelterId" component={ShelterItem}/>
          </Switch>
          <AddShelterButton/>
          <SubmitShelterDialogContainer/>
          <SubmitEmergencyDialogContainer/>
        </div>
      </div>
    );
  }
}

// Basically: pass redux's global state into this component as props
// Using withRouter due to this issue:
// https://stackoverflow.com/questions/43895805/react-router-4-does-not-update-view-on-link-but-does-on-refresh
export default withRouter(drizzleConnect(Home));
