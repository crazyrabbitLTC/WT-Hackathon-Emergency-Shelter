// Import React Modules
import React, { Component } from 'react';

// Import assets

// Import Scenes
import Tabs from './Tabs/Tabs';

// Import Services

class TabBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userImage: null,
      userName: null,
      userRole: null,
      activeTab: null,
    };
  }

  render() {
    const tabs = [
      { id: 1, name: 'Wildfires in California', linkTo: '/emergency-one' },
      { id: 2, name: 'Tsunami in Thailand', linkTo: '/emergency-two' },
      { id: 3, name: 'Hurricane in Puerto Rico', linkTo: '/emergency-two' },
    ];

    return (
      <div>
        <Tabs tabs={tabs} />
      </div>
    );
  }
}

TabBar.propTypes = {
};

export default TabBar;





// // Import React Modules
// import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
// import { drizzleConnect } from 'drizzle-react';
// import PropTypes from 'prop-types';
// // Import Redux
// import { bindActionCreators } from 'redux';
// // Import Components
// import Tabs from './Tabs/Tabs';

// import axios from 'axios';
// const Hotel = require('../../../build/contracts/Hotel.json');

// class TabBar extends Component {
//   constructor(props, context) {
//     super(props);
//     this.contracts = context.drizzle.contracts;
//     this.web3 = context.drizzle.web3;

//     this.state = {
//       userImage: null,
//       userName: null,
//       userRole: null,
//       activeTab: null,
//       EmergencyByManagerByIndex: [],
//     };
//   }

//   componentDidUpdate(prevProps, prevState) {
//     console.log('prevProps', prevProps);
//     console.log('props', this.props);
//     console.log('prevState', prevState);
//     console.log('state', this.state);
//     // First initialization w/ shelterContract in props
//     if (prevProps.EmergencyShelterIndex.initialized === false && this.props.EmergencyShelterIndex.initialized === true) {
//       // Get number of shelters so that you can loop through and get each product details
//       this.getShelterCounter().then(() => {
//         // Loop through shelters, requesting data for each shelter. Get dataKey which directs to each shelter data and save datakeys
//         this.getDataKeysBasedOnShelterCounter();

//         // Using array of datakeys, loop through shelters and get data for each shelter using each respective dataKey
//         this.getSheltersFromDataKeys();
//       });
//     }

//     // // Subesquent initializations w/ shelterContract in props that meet the below criteria
//     // // Ensure we don't get caught in infinite loop, so only run get shelter functions if shelter array is less than the shelter counter (based on the selected tab)
//     // if (this.props.EmergencyShelterIndex.initialized === true &&
//     //     prevProps.EmergencyShelterIndex.initialized === true &&
//     //     (this.state.EmergencyByManagerByIndex.length < (this.state.sheltersLengthBasedOnTab ? this.state.sheltersLengthBasedOnTab : this.state.getEmergencyCount))
//     // ) {
//     //   console.log('HI');
//     //   // Get number of shelters so that you can loop through and get each product details
//     //   this.getShelterCounter().then(() => {
//     //     // Loop through shelters, requesting data for each shelter. Get dataKey which directs to each shelter data and save datakeys
//     //     this.getDataKeysBasedOnShelterCounter();

//     //     // Using array of datakeys, loop through shelters and get data for each shelter using each respective dataKey
//     //     this.getSheltersFromDataKeys();
//     //   });
//     // }

//     if (this.props.EmergencyShelterIndex.initialized === true && prevProps.EmergencyShelterIndex.initialized === true && prevState.EmergencyByManagerByIndex.length !== this.state.EmergencyByManagerByIndex.length) {
//       // Get number of shelters so that you can loop through and get each product details
//       this.getShelterCounter().then(() => {
//         // Loop through shelters, requesting data for each shelter. Get dataKey which directs to each shelter data and save datakeys
//         this.getDataKeysBasedOnShelterCounter();

//         // Using array of datakeys, loop through shelters and get data for each shelter using each respective dataKey
//         this.getSheltersFromDataKeys();
//       });
//     }

//     //  if (this.props.EmergencyShelterIndex.initialized === true) {
//     //   this.contracts.EmergencyShelterIndex.methods.shelters(0).call().then((shelterData) => {
//     //   });
//     // }
//   }

//   // Get number of shelters so that you can loop through and get each product details
//   getShelterCounter() {
//     console.log('HEREEE');
//     return new Promise(resolve => {
//       this.contracts.EmergencyShelterIndex.methods.getEmergencyCount().call().then((getEmergencyCountResponse) => {
//         console.log('getEmergencyCountResponse', getEmergencyCountResponse);
//         this.setState({
//           getEmergencyCount: getEmergencyCountResponse,
//         });
//         resolve('getEmergencyCount Resolved');
//       });
//     });
//   }

//   // Loop through shelters, requesting data for each shelter. Get dataKey which directs to each shelter data and save datakeys
//   getDataKeysBasedOnShelterCounter() {
//     const dataKeys = [];
//     for (let i = 1; i < this.state.getEmergencyCount; i += 1) {
//       const dataKey = this.contracts.EmergencyShelterIndex.methods.EmergencyByManagerByIndex.cacheCall(i);
//       dataKeys.push(dataKey);
//     }
//     this.setState({
//       dataKeys,
//     });
//   }

//   // Using array of datakeys, loop through shelters and get data for each shelter using each respective dataKey
//   async getSheltersFromDataKeys() {
//     // This does not work. Only for mapping or comparying keys/indexes. Need another way to determine if shelter has been added.
//     // Could do array but this is slow.
//     // MAYBE create a new array each time this function is called and replace state array INSTEAD of appending to it. That could work.
//     // The best solution would be to have a consistent array, and then only check for updates on that array.
//     // Get all shelters at init and create/set array
//     // Then on event, update append to that array with new shelter.
//     // Using array of datakeys, loop through shelters and get data for each shelter using each respective dataKey
//     const sheltersCopy = [];
//     console.log('this.state.dataKeys', this.state.dataKeys);
//     console.log('this.props.EmergencyShelterIndex.EmergencyByManagerByIndex', this.props.EmergencyShelterIndex.EmergencyByManagerByIndex);
//     for (const dataKey of this.state.dataKeys) {
//       if (dataKey in this.props.EmergencyShelterIndex.EmergencyByManagerByIndex) {
//         const shelterAddress = this.props.EmergencyShelterIndex.EmergencyByManagerByIndex[dataKey].value;
//         console.log('shelterAddress', shelterAddress);

//         console.log('this.web3', this.web3);
//         // const contractConfig = {
//         //   contractName: shelterAddress,
//         //   web3Contract: new this.web3.eth.Contract(Hotel)
//         // }
//         var hotelContractInstance = await new this.web3.eth.Contract(Hotel.abi, shelterAddress);
//         console.log('hotelContractInstance', hotelContractInstance);
//         const shelterUri = await hotelContractInstance.methods.dataUri().call();
//         console.log('shelterUriNew', shelterUri);
//         // await this.context.drizzle.addContract(contractConfig);
//         // console.log('this.props.contracts', this.props.contracts);

//         var shelterData = await this.getShelterDataFromSwarmUri(shelterUri);
//         shelterData.shelterUri = shelterUri;
//         sheltersCopy.push(shelterData);
//       }
//     }
//     console.log('sheltersCopy', sheltersCopy);
//     this.setState({
//       EmergencyByManagerByIndex: sheltersCopy,
//       sheltersLengthBasedOnTab: sheltersCopy.length,
//     });
//   }

//   async getShelterDataFromSwarmUri(shelterUri) {
//       try {
//         const res = await axios.get(`http://localhost:8500/bzz-raw:/${shelterUri}`);
//         console.log('res', res.data);
//         return JSON.parse(res.data);
//       } catch (error) {
//         return error;
//       }
//   }

//   render() {
//     const tabs = this.state.EmergencyByManagerByIndex.map( (emergency, index) => {
//       return {
//         id: index,
//         name: emergency.title,
//         linkTo: '/all-shelters'
//       }
//     })
//     // [
//     //   { id: 1, name: 'Your Shelter', linkTo: '/your-shelter' },
//     //   { id: 2, name: 'All Shelters', linkTo: '/all-shelters' },
//     // ];

//     return (
//       <div>
//         <Tabs tabs={tabs} />
//       </div>
//     );
//   }
// }


// TabBar.contextTypes = {
//   drizzle: PropTypes.object,
// };

// TabBar.propTypes = {
//   EmergencyShelterIndex: PropTypes.obj,
//   selectedTab: PropTypes.integer,
//   accounts: PropTypes.array,
// };

// const mapStateToProps = state => {
//   return {
//     EmergencyShelterIndex: state.contracts.EmergencyShelterIndex,
//     Hotel: state.contracts.Hotel,
//     contracts: state.contracts,
//     selectedTab: state.setTabReducer.selectedTab,
//     accounts: state.accounts,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     actions: bindActionCreators({
//     }, dispatch),
//   };
// };

// // Basically: pass redux's global state into this component as props
// // Using withRouter due to this issue:
// // https://stackoverflow.com/questions/43895805/react-router-4-does-not-update-view-on-link-but-does-on-refresh
// export default withRouter(drizzleConnect(TabBar, mapStateToProps, mapDispatchToProps));
