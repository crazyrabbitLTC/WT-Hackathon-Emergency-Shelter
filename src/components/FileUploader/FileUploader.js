// Import React Modules
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

class SubmitShelterDialogContainer extends Component {
  render() {
    return (
      <div >
        <input type="file" id="myFile" onChange={this.props.captureFile}/>
        <br></br>
      </div>
    );
  }
}

SubmitShelterDialogContainer.propTypes = {
  isSubmitShelterDialogOpen: PropTypes.boolean,
  captureFile: PropTypes.func,
};

// Basically: pass redux's global state into this component as props
// Using withRouter due to this issue:
// https://stackoverflow.com/questions/43895805/react-router-4-does-not-update-view-on-link-but-does-on-refresh
export default withRouter(drizzleConnect(SubmitShelterDialogContainer));
