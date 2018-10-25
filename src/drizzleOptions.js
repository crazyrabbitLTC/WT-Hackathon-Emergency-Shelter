import WTIndex from './../build/contracts/WTIndex.json'
// import Hotel from './../build/contracts/hotel/Hotel.json'

// const drizzleOptions = {
//   web3: {
//     block: false,
//     fallback: {
//       type: 'ws',
//       url: 'ws://127.0.0.1:8545'
//     }
//   },
//   contracts: [
//     ComplexStorage,
//     SimpleStorage,
//     TutorialToken
//   ],
//   events: {
//     SimpleStorage: ['StorageSet']
//   },
//   polls: {
//     accounts: 1500
//   }
// }

const drizzleOptions = {
  // web3: {
  //   block: false,
  //   fallback: {
  //     type: 'ws',
  //     url: 'ws://127.0.0.1:754',
  //   },
  // },
  contracts: [
    WTIndex,
    // Hotel,
  ],
  events: {
    WTIndex: {
      eventName: 'HotelRegistered',
      eventOptions: {
        fromBlock: 0, // ideally contract creation block, but listen for events from block '0' to 'latest'
      },
    },
  },
  polls: {},
};

export default drizzleOptions