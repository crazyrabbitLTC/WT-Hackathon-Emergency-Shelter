// Import React Modules
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
// Import Redux
import { bindActionCreators } from 'redux';
import { setSelectedTab } from '../../../redux/actions';

// Import Scenes/Components
import Tab from './Tab/Tab';

class Tabs extends Component {
  constructor(props) {
    super(props);

    // Set inital state to select first tab
    this.state = {
      // selectedTabId: 1,
    };
  }

  componentDidMount() {
    // The following logic ensure the correct tab is selected on refresh
    const currentHref = `/${window.location.toString().split('/')[3]}`;
    const totalTabs = this.props.tabs.length;
    let currentTabIndex = 1;
    this.props.tabs.forEach((tab) => {
      if (tab.linkTo === currentHref) {
        this.setActiveTab(currentTabIndex);
        return;
      } else if (currentTabIndex === totalTabs) {
        this.setActiveTab(1);
      }
      currentTabIndex += 1;
    });
  }

  // Takes tab id as param and determines if that tab is active
  isActive(id) {
    return this.state.selectedTabId === id;
  }

  // Once tab is clicked, this is called to set active tab to that tab
  setActiveTab(selectedTabId) {
    console.log('SELECTED TAB', selectedTabId);
    this.setState({ selectedTabId });
    this.props.actions.setSelectedTab(selectedTabId);
  }

  render() {
    const total = this.props.tabs;
    const tabs = total.map((el, i) => {
      return <Tab
        key={ i }
        content={ el.name }
        isActive={ this.isActive(el.id) }
        onActiveTab={ this.setActiveTab.bind(this, el.id) }
        linkTo={ el.linkTo }
      />;
    });

    return <ul className="nav nav-tabs">
            { tabs }
          </ul>;
  }
}

Tabs.propTypes = {
  tabs: PropTypes.array.isRequired,
};

const mapStateToProps = state => {
  return {
    WTIndex: state.contracts.WTIndex,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      setSelectedTab,
    }, dispatch),
  };
};

// Basically: pass redux's global state into this component as props
// Using withRouter due to this issue:
// https://stackoverflow.com/questions/43895805/react-router-4-does-not-update-view-on-link-but-does-on-refresh
export default withRouter(drizzleConnect(Tabs, mapStateToProps, mapDispatchToProps));
