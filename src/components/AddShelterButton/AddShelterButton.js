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
import { setSubmitShelterDialogOpen } from '../../redux/actions';

// Import Scenes

// Import Components

class AddShelterButton extends Component {
  constructor(props) {
    super(props);
    this.handleAddShelterClick = this.handleAddShelterClick.bind(this);
  }

  handleAddShelterClick() {
    console.log('Clicked', this.props.actions);
    this.props.actions.setSubmitShelterDialogOpen(true);
  }

  render() {
    return (
      <div className="registerHotel-button mt-3">
        <Button variant="fab" color="primary" aria-label="Add" onClick={this.handleAddShelterClick}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

AddShelterButton.propTypes = {
  isSubmitShelterDialogOpen: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    isSubmitShelterDialogOpen: state.isSubmitShelterDialogOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      setSubmitShelterDialogOpen,
    }, dispatch),
  };
};

// Basically: pass redux's global state into this component as props
// Using withRouter due to this issue:
// https://stackoverflow.com/questions/43895805/react-router-4-does-not-update-view-on-link-but-does-on-refresh
export default withRouter(drizzleConnect(AddShelterButton, mapStateToProps, mapDispatchToProps));
