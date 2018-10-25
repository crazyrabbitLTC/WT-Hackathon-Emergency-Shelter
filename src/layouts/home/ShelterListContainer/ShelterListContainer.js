// Import React Modules
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
// Import Redux
import { bindActionCreators } from 'redux';
// Import Components
import TabBar from '../../../components/TabBar/TabBar';
import ShelterItem from '../../../components/ShelterItem/ShelterItem';
import axios from 'axios';
const Hotel = require('../../../../build/contracts/Hotel.json');

class ShelterListContainer extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    this.web3 = context.drizzle.web3;
    this.state = {
      getHotelsLength: 0,
      dataKeys: [],
      hotels: [],
    };
  }

  componentDidMount() {
    console.log('Contract:', this.contracts.WTIndex.events.HotelRegistered);
    this.contracts.WTIndex.events.HotelRegistered({/* eventOptions */}, (error, event) => {
      console.log(error, event);
    });
  }

  componentDidUpdate(prevProps) {
    // First initialization w/ shelterContract in props
    if (prevProps.WTIndex.initialized === false && this.props.WTIndex.initialized === true) {
      // Get number of shelters so that you can loop through and get each product details
      this.getShelterCounter().then(() => {
        // Loop through shelters, requesting data for each shelter. Get dataKey which directs to each shelter data and save datakeys
        this.getDataKeysBasedOnShelterCounter();

        // Using array of datakeys, loop through shelters and get data for each shelter using each respective dataKey
        this.getSheltersFromDataKeys();
      });
    }

    // Subesquent initializations w/ shelterContract in props that meet the below criteria
    // Ensure we don't get caught in infinite loop, so only run get shelter functions if shelter array is less than the shelter counter (based on the selected tab)
    if (this.props.WTIndex.initialized === true &&
        prevProps.WTIndex.initialized === true &&
        (this.state.hotelslength < (this.state.sheltersLengthBasedOnTab ? this.state.sheltersLengthBasedOnTab : this.state.getHotelsLength))
    ) {
      console.log('HI');
      // Get number of shelters so that you can loop through and get each product details
      this.getShelterCounter().then(() => {
        // Loop through shelters, requesting data for each shelter. Get dataKey which directs to each shelter data and save datakeys
        this.getDataKeysBasedOnShelterCounter();

        // Using array of datakeys, loop through shelters and get data for each shelter using each respective dataKey
        this.getSheltersFromDataKeys();
      });
    }

    if (this.props.WTIndex.initialized === true && prevProps.WTIndex.initialized === true && prevProps.selectedTab !== this.props.selectedTab) {
      // Get number of shelters so that you can loop through and get each product details
      this.getShelterCounter().then(() => {
        // Loop through shelters, requesting data for each shelter. Get dataKey which directs to each shelter data and save datakeys
        this.getDataKeysBasedOnShelterCounter();

        // Using array of datakeys, loop through shelters and get data for each shelter using each respective dataKey
        this.getSheltersFromDataKeys();
      });
    }

  }

  // Get number of shelters so that you can loop through and get each product details
  getShelterCounter() {
    console.log('HEREEE');
    return new Promise(resolve => {
      this.contracts.WTIndex.methods.getHotelsLength().call().then((getHotelsLengthResponse) => {
        console.log('getHotelsLengthResponse', getHotelsLengthResponse);
        this.setState({
          getHotelsLength: getHotelsLengthResponse,
        });
        resolve('getHotelsLength Resolved');
      });
    });
  }

  // Loop through shelters, requesting data for each shelter. Get dataKey which directs to each shelter data and save datakeys
  getDataKeysBasedOnShelterCounter() {
    const dataKeys = [];
    for (let i = 1; i < this.state.getHotelsLength; i += 1) {
      const dataKey = this.contracts.WTIndex.methods.hotels.cacheCall(i);
      dataKeys.push(dataKey);
    }
    this.setState({
      dataKeys,
    });
  }

  // Using array of datakeys, loop through shelters and get data for each shelter using each respective dataKey
  async getSheltersFromDataKeys() {
    // This does not work. Only for mapping or comparying keys/indexes. Need another way to determine if shelter has been added.
    // Could do array but this is slow.
    // MAYBE create a new array each time this function is called and replace state array INSTEAD of appending to it. That could work.
    // The best solution would be to have a consistent array, and then only check for updates on that array.
    // Get all shelters at init and create/set array
    // Then on event, update append to that array with new shelter.
    // Using array of datakeys, loop through shelters and get data for each shelter using each respective dataKey
    const sheltersCopy = [];
    console.log('this.state.dataKeys', this.state.dataKeys);
    console.log('this.props.WTIndex.hotels', this.props.WTIndex.hotels);
    for (const dataKey of this.state.dataKeys) {
      if (dataKey in this.props.WTIndex.hotels) {
        const shelterAddress = this.props.WTIndex.hotels[dataKey].value;
        if (this.filterShelterBySelectedTab(shelterAddress)) {
          console.log('shelterAddress', shelterAddress);

          console.log('this.web3', this.web3);
          // const contractConfig = {
          //   contractName: shelterAddress,
          //   web3Contract: new this.web3.eth.Contract(Hotel)
          // }
          var hotelContractInstance = await new this.web3.eth.Contract(Hotel.abi, shelterAddress);
          console.log('hotelContractInstance', hotelContractInstance);
          const shelterUri = await hotelContractInstance.methods.dataUri().call();
          console.log('shelterUriNew', shelterUri);
          // await this.context.drizzle.addContract(contractConfig);
          // console.log('this.props.contracts', this.props.contracts);

          var shelterData = await this.getShelterDataFromSwarmUri(shelterUri);
          shelterData.shelterUri = shelterUri;
          sheltersCopy.push(shelterData);
        }
      }
    }
    console.log('sheltersCopy', sheltersCopy);
    this.setState({
      hotels: sheltersCopy,
      sheltersLengthBasedOnTab: sheltersCopy.length,
    });
  }

  filterShelterBySelectedTab(shelter) {
    const currAccount = this.props.accounts[0];
    // If tab is on "Your Shelters" and shelter is not owned by "you" return false
    if ((this.props.selectedTab === 2 || this.props.selectedTab === 3) && shelter.owner !== currAccount) {
      return false;
    }
    return true;
  }

  async getShelterDataFromSwarmUri(shelterUri) {
    console.log('HEREEEEEEEEE');
      try {
        const res = await axios.get(`http://localhost:8500/bzz-raw:/${shelterUri}`);
        console.log('res', res.data);
        return JSON.parse(res.data);
      } catch (error) {
        return error;
      }
  }

  render() {
    const shelterListItems = this.state.hotels.map((shelter) => {
      return <ShelterItem key={shelter.id} shelter={shelter}/>;
    });
    return (
      <div>
        <h1 className="page-title">Current Emergencies in the World</h1>
        <h2 className="page-subtitle">Select an emergency to view current shelters and offer your own shelter</h2>
        <TabBar/>
        {
          this.state.hotels.length === 0 ?
            <p>There are curently no shelters with that criteria in the system. Please submit a new piece of shelter using the button below!</p>
            :
            <div>
              {shelterListItems}
            </div>
        }
      </div>
    );
  }
}

ShelterListContainer.contextTypes = {
  drizzle: PropTypes.object,
};

ShelterListContainer.propTypes = {
  WTIndex: PropTypes.obj,
  selectedTab: PropTypes.integer,
  accounts: PropTypes.array,
};

const mapStateToProps = state => {
  return {
    WTIndex: state.contracts.WTIndex,
    Hotel: state.contracts.Hotel,
    contracts: state.contracts,
    selectedTab: state.setTabReducer.selectedTab,
    accounts: state.accounts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
    }, dispatch),
  };
};

// Basically: pass redux's global state into this component as props
// Using withRouter due to this issue:
// https://stackoverflow.com/questions/43895805/react-router-4-does-not-update-view-on-link-but-does-on-refresh
export default withRouter(drizzleConnect(ShelterListContainer, mapStateToProps, mapDispatchToProps));
