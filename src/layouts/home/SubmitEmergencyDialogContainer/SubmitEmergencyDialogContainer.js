// Import React Modules
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
// Import Matieral UI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// Import Redux
import { bindActionCreators } from 'redux';
import { setSubmitEmergencyDialogOpen } from '../../../redux/actions';
// Import Components
import FileUploader from '../../../components/FileUploader/FileUploader';
import Loader from '../../../components/Loader/Loader';
// Init IPFS
import SwarmAdapter from '@windingtree/off-chain-adapter-swarm';
const swarmOptions = { swarmProviderUrl: 'http://localhost:8500' }
const swarm = new SwarmAdapter(swarmOptions);

class SubmitEmergencyDialogContainer extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      title: '',
      description: '',
      fileSwarmHash: '',
      duration: 4000000,
      loadingSubmit: false,
    };
    this.contracts = context.drizzle.contracts;
    this.web3 = context.drizzle.web3;

    this.handleChange = this.handleChange.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.prepareFileForIpfs = this.prepareFileForIpfs.bind(this);
  }

  handleClose() {
    this.props.actions.setSubmitEmergencyDialogOpen(false);
  }

  async handleSubmit() {
    console.log('this.state.fileSwarmHash', this.state.fileSwarmHash);
    console.log('this.state.fileSwarmHash', this.state.fileSwarmHash.slice(35));
    console.log('this.web3.utils.fromAscii(this.state.fileSwarmHash.slice(10)),', this.web3.utils.fromAscii(this.state.fileSwarmHash.slice(15)));
    // Declare this transaction to be observed. We'll receive the stackId for reference.
    const stackId = await this.contracts.EmergencyShelterIndex.methods.createEmergency.cacheSend(
      this.state.fileSwarmHash,
      this.web3.utils.fromAscii(this.state.fileSwarmHash.slice(35)),
      this.state.duration,
      { from: this.props.accounts[0] },
    );
    this.contracts.EmergencyShelterIndex.methods.getEmergencyCount.cacheCall();

    // Use the dataKey to display the transaction status.
    if (this.props.transactionStack[stackId]) {
      const txHash = this.props.transactionStack[stackId];
      console.log('Transaction Hash: ', txHash);
    }
    this.setState({ loadingSubmit: false });
    this.props.history.push('/emergency-one');
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  captureFile(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new window.FileReader();
      reader.onload = (event) => {
        this.setState({
          fileContent: event.target.result,
          fileName: file.name,
        });
      };
      // reader.readAsText(new Blob([file], { // Use this is expecting text
      reader.readAsArrayBuffer(new Blob([file], { // use array buffer if expecting an image
        type: 'application/json',
      }));
    }
  }

  async saveToSwarm(reader) {
    const buffer = Buffer.from(reader.result);
    const swarmUpload = JSON.stringify({
      title: this.state.title,
      description: this.state.description,
      duration: this.state.duration,
    })
    try {
      var fileSwarmHash = await swarm.upload(swarmUpload);
      fileSwarmHash = fileSwarmHash.slice(10);
      console.log('fileSwarmHash', fileSwarmHash);
      this.setState({ fileSwarmHash: fileSwarmHash })
    } catch(err) {
      console.log(err);
    }
  }

  async prepareFileForIpfs() {
    this.handleClose();
    this.setState({ loadingSubmit: true });
    const blob = new File([this.state.fileContent], this.state.filename, { type: 'image/png' });
    const reader = new window.FileReader();
    reader.onloadend = async () => {
      await this.saveToSwarm(reader);
      this.handleSubmit();
    };
    await reader.readAsArrayBuffer(blob);
  }

  render() {
    return (
      <div >
        {
          this.state.loadingSubmit ?
            <div className="loadingIndicator">
              <Loader/>
            </div>
            :
            <Dialog
              open={this.props.isSubmitEmergencyDialogOpen}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Submit an Emergency</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Is there an emergency? 
                  <br></br><br></br>
                  <ol>
                    <li>Give it a title</li>
                    <li>Add a description</li>
                    <li>Press Upload to store it on Swarm and save its reference hash on the blockchain</li>
                  </ol>
                  Once the transaction is confirmed by Metamask, you will need to refresh the page manually, due
                  to a currently open Metamask issue with web3 1.0. 
                  <br></br><br></br>
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  name="title"
                  label="Emergency Title"
                  type="title"
                  fullWidth
                  onChange={this.handleChange}
                />
                <TextField
                  margin="dense"
                  id="description"
                  name="description"
                  label="Emergency Description"
                  type="description"
                  fullWidth
                  multiline
                  rowsMax="4"
                  onChange={this.handleChange}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="duration"
                  name="duration"
                  label="Emergency Duration (In seconds...lol)"
                  type="number"
                  fullWidth
                  onChange={this.handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={this.prepareFileForIpfs} color="primary">
                  Submit Shelter
                </Button>
              </DialogActions>
            </Dialog>
        }
      </div>
    );
  }
}

SubmitEmergencyDialogContainer.propTypes = {
  isSubmitEmergencyDialogOpen: PropTypes.any,
  WTIndex: PropTypes.obj,
  transactions: PropTypes.obj,
  transactionStack: PropTypes.array,
  accounts: PropTypes.array,
};

SubmitEmergencyDialogContainer.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = state => {
  console.log('state.registerEmergencyReducer', state.registerEmergencyReducer);
  return {
    isSubmitEmergencyDialogOpen: state.registerEmergencyReducer.isSubmitEmergencyDialogOpen,
    WTIndex: state.contracts.WTIndex,
    accounts: state.accounts,
    transactions: state.transactions,
    transactionStack: state.transactionStack,
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
export default withRouter(drizzleConnect(SubmitEmergencyDialogContainer, mapStateToProps, mapDispatchToProps));
