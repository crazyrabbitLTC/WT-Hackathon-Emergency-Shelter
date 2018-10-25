// Import React Modules
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
// Import Assets
import linkIcon from '../../assets/link.png';

class ShelterItem extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    this.state = {
      shelterIdFromParams: this.props.match.params.shelterId,
      shelterIpfs: this.props.shelter ? this.props.shelter.ipfs : '',
      shelterTitle: this.props.shelter ? this.props.shelter.description.name : '',
      shelterDescription: this.props.shelter ? this.props.shelter.description.description : '',
      shelterEmail: this.props.shelter ? this.props.shelter.description.contacts.general.email : '',
      shelterNeighborhood: this.props.shelter ? this.props.shelter.description.address.neighborhood : '',
      shelterMaxOccupancy: this.props.shelter ? this.props.shelter.description.roomTypes.abcd.occupancy.max : '',
      shelterId: this.props.shelter ? this.props.shelter.id : '',
      shelterUri: this.props.shelter ? this.props.shelter.shelterUri : '',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.WTIndex.initialized === false && this.props.WTIndex.initialized === true) {
      this.getShelterIpfsFromShelterId();
      this.getShelterCounter();
    }
    if (this.props.WTIndex.initialized === true && prevState.shelterIpfs === '') {
      this.getShelterIpfsFromShelterId();
      this.getShelterCounter();
    }
  }

  getShelterIpfsFromShelterId() {
    this.contracts.WTIndex.methods.shelters(this.state.shelterIdFromParams).call().then((shelterData) => {
      this.setState({
        shelterIpfs: shelterData.ipfs,
        shelterTitle: shelterData.title,
        shelterDescription: shelterData.description,
        shelterId: shelterData.id,
      });
    });
  }

  getShelterCounter() {
    this.contracts.WTIndex.methods.getHotelsLength().call().then((getHotelsLengthResponse) => {
      this.setState({
        getHotelsLength: getHotelsLengthResponse,
      });
    });
  }

  render() {
    const renderLinkIcon = () => {
      return <Link to={`/shelter/${this.state.shelterId}`} target="_blank">
        <img className="mr-3" src={linkIcon} width="30" alt="Direct link to this piece of shelter" title="Direct link to this piece of shelter"/>
      </Link>;
    };
    return (
      <div>
        {
          this.state.shelterId >= this.state.getHotelsLength ?
            <p>Sorry! There are no shelters in our system with this id. Please <Link to="/">return home </Link> </p>
            :
            <div>
              <img className="w-100" src={this.state.buffer}/>
              <div className="row d-block mt-3">
                <div>
                  <h3 className="shelterTitle ml-3 mb-3">{this.state.shelterTitle}</h3>
                </div>
                <div>
                  <h6 className="ml-3">{this.state.shelterDescription}</h6>
                </div>
                <div>
                  <h6 className="ml-3"><a target="_blank" href={`mailto:${this.state.shelterEmail}`}>{this.state.shelterEmail}</a></h6>
                </div>
                <div>
                  <h6 className="ml-3">{this.state.shelterNeighborhood}</h6>
                </div>
                <div>
                  <h6 className="ml-3">Max Occupancy: {this.state.shelterMaxOccupancy}</h6>
                </div>
                <p className="ml-3">Swarm URI: <a target="_blank" href={`http://localhost:8500/bzz-raw:/${this.state.shelterUri}`}>{`http://localhost:8500/bzz-raw:/${this.state.shelterUri}`}</a></p>
              </div>
            </div>
        }
      </div>
    );
  }
}

ShelterItem.contextTypes = {
  drizzle: PropTypes.object,
};

ShelterItem.propTypes = {
  shelter: PropTypes.object.isRequired,
  WTIndex: PropTypes.obj,
};

const mapStateToProps = state => {
  return {
    WTIndex: state.contracts.WTIndex,
  };
};

// Basically: pass redux's global state into this component as props
// Using withRouter due to this issue:
// https://stackoverflow.com/questions/43895805/react-router-4-does-not-update-view-on-link-but-does-on-refresh
export default withRouter(drizzleConnect(ShelterItem, mapStateToProps));
