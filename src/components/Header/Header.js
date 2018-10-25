// Import React Modules
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';
// Import Assets
import redCircle from '../../assets/red-circle.png';
import greenCircle from '../../assets/green-circle.png';

// Import Services
// import web3Service from '../../services/web3Service'
// import checkAccountStatus from '../../services/checkAccountService'

// Import Assets
// import userProfileIcon from '../../assets/userProfileIcon_gray.png'

// Import Styles
import './header.scss';

class Header extends Component {
  // constructor(props) {
  //   super(props)

  //   this.state = {
  //     web3: null,
  //     newProdutContractInstance: null,
  //     account: "",
  //     accountStatus: ""
  //   };
  // };

  // componentWillMount() {
  //    web3Service.getWeb3Service().then(() => {
  //     this.setState({
  //       newProductContractInstance: web3Service.getNewProductContractInstance(),
  //     });

  //     web3Service.getCurrentAccount().then( (accountResult) => {
  //       const accountStatus = checkAccountStatus(accountResult);
  //       this.setState({
  //         account: accountResult,
  //         accountStatus: accountStatus
  //       });
  //     });
  //    });
  // };

  render() {
    return (
    <div className="header">
        <nav className="navbar navbar-expand-md fixed-top navbar-dark header-navbar">
          <a className="navbar-brand" href="/">Winding Tree Emergency Shelter Index</a>
          <button className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            {
              // <ul className="navbar-nav mr-auto">
              //   <li className="nav-item active">
              //   <Link className="nav-link" to='/new-product'>Add a Product<span className="sr-only">(current)</span></Link>
              //   </li>
              //   <li className="nav-item active">
              //     <Link className="nav-link" to='/search'>Search</Link>
              //   </li>
              // </ul>
            }
          <span className="header-navbar-text align-middle ml-auto">
            <h4 className="white">Current Account: <span className="header-navbar-text-account">{this.props.accounts[0]}</span></h4>
          </span>
          <span className="header-navbar-text align-middle d-flex">
            <h4 className="pr-2 pt-2 white">Web3 Status:</h4>
            { this.props.web3.status === 'initialized' ?
              <img className="statusCircle" src={greenCircle} width="20px" height="20px"/>
              :
              <img className="statusCircle" src={redCircle} width="20px" height="20px"/> }
          </span>
          </div>
        </nav>
    </div>
    );
  }
}


Header.propTypes = {
  accounts: PropTypes.object.isRequired,
  web3: PropTypes.object.isRequired,
  // role: PropTypes.string.isRequired,
  // agency: PropTypes.string.isRequired,
  // notificationCount: PropTypes.number,
  // ssnLastSearched: PropTypes.string,
  // queryStringLastSearched: PropTypes.string,
};

// LoadingContainer.contextTypes = {
//   drizzle: PropTypes.object
// }
/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
  };
};

export default drizzleConnect(Header, mapStateToProps);
