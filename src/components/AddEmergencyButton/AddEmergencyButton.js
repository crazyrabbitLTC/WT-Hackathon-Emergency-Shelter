// Import React Modules
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
// Import Matieral UI
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
// Import Redux
import { bindActionCreators } from 'redux';
import { setSubmitEmergencyDialogOpen } from '../../redux/actions';

// Import Scenes

// Import Components

class AddEmergencyButton extends Component {
  constructor(props) {
    super(props);
    this.handleAddEmergencyClick = this.handleAddEmergencyClick.bind(this);
  }

  handleAddEmergencyClick() {
    console.log('Clicked', this.props.actions);
    this.props.actions.setSubmitEmergencyDialogOpen(true);
  }

  render() {
    return (
      <div className="createEmergency-button">
        <h4>Submit an Emergency</h4>
        <br></br>
        <Button variant="fab" color="primary" aria-label="Add" onClick={this.handleAddEmergencyClick}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

AddEmergencyButton.propTypes = {
  isSubmitEmergencyDialogOpen: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    isSubmitEmergencyDialogOpen: state.isSubmitEmergencyDialogOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      setSubmitEmergencyDialogOpen,
    }, dispatch),
  };
};

// Basically: pass redux's global state into this component as props
// Using withRouter due to this issue:
// https://stackoverflow.com/questions/43895805/react-router-4-does-not-update-view-on-link-but-does-on-refresh
export default withRouter(drizzleConnect(AddEmergencyButton, mapStateToProps, mapDispatchToProps));
