import React, { useState } from 'react';

import './TabBar.scss';

const TAB_NAME_ARRAY = [ "Dashboard", "Invest" ];

export default function TabBar (props) {
  const { onChangeTabItemName } = props;

  const [selectedTabItem, setSelectedTabItem] = useState("Dashboard");

  const onClickTabItemName = (tabName) => {
    const onClickTabItem = () => {
      setSelectedTabItem(tabName);
      if (onChangeTabItemName) {
        onChangeTabItemName(tabName);
      }
    };
    return onClickTabItem;
  }

  // component can be "icon", "label" and "marker"
  // Each component should have a corresponding css style.
  const tabItemActiveStyle = (tabName, component) => {
    if (tabName !== selectedTabItem) {
      return "";
    }
    return `TabBar-item-${component}-active`;
  }

  // Render single tab item with a tab name.
  const renderTabItem = (tabName) => {
    return (
      <div
        key={tabName}
        className="TabBar-item-container"
        onClick={onClickTabItemName(tabName)}>
        <div className="TabBar-item">
          <p className={`TabBar-item-label ${tabItemActiveStyle(tabName, "label")}`}>{tabName}</p>
        </div>
        <div className={`TabBar-marker ${tabItemActiveStyle(tabName, "marker")}`}></div>
      </div>
    );
  }

  const tabItemList = TAB_NAME_ARRAY.map(tabName => renderTabItem(tabName));

  return (
    <div style={{position: "relative"}}>
      <div className="TabBar-container">
        {tabItemList}
      </div>
    </div>
  );
}

export { TAB_NAME_ARRAY };
