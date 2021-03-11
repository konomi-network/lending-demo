import React, { useState } from 'react';

import './TabBar.css';

// import {ReactComponent as DashboardActiveIcon} from './resources/img/dashboard_blue.svg';
// import {ReactComponent as InvestActiveIcon} from './resources/img/invest_blue.svg';
// import {ReactComponent as ExchangeActiveIcon} from './resources/img/exchange_blue.svg';
// import {ReactComponent as TransactionsActiveIcon} from './resources/img/transactions_blue.svg';

// import {ReactComponent as DashboardInactiveIcon} from './resources/img/dashboard_gray.svg';
// import {ReactComponent as InvestIncactiveIcon} from './resources/img/invest_gray.svg';
// import {ReactComponent as ExchangeIncactiveIcon} from './resources/img/exchange_gray.svg';
// import {ReactComponent as TransactionsInactiveIcon} from './resources/img/transactions_gray.svg';

// const TAB_NAME_ARRAY = [ "Dashboard", "Invest", "Exchange", "Transactions" ];
const TAB_NAME_ARRAY = [ "Dashboard", "Invest" ];

// const tabIconMap = {
//   Dashboard: [ DashboardInactiveIcon, DashboardActiveIcon ],
//   Invest: [ InvestIncactiveIcon, InvestActiveIcon ],
//   Exchange: [ ExchangeIncactiveIcon, ExchangeActiveIcon ],
//   Transactions: [ TransactionsInactiveIcon, TransactionsActiveIcon ],
// };

function TabBar (props) {
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

  // Render tab item icon.
  // const renderIcon = (tabName) => {
  //   const iconIndex = tabName === selectedTabItem ? 1 : 0;
  //   const IconComponent = tabIconMap[tabName][iconIndex];
  //   return (
  //     <div className={`TabBar-item-icon-container ${tabItemActiveStyle(tabName, "icon")}`}>
  //       <IconComponent className="TabBar-item-icon" />
  //     </div>
  //   );
  // }

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

export { TabBar, TAB_NAME_ARRAY };
