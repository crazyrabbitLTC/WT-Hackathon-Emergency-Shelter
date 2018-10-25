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
      { id: 1, name: 'Your Shelter', linkTo: '/your-shelter' },
      { id: 2, name: 'All Shelters', linkTo: '/all-shelters' },
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
