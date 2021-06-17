import React, { useState } from 'react';

import styles from './TabBar.module.scss';

const TAB_NAME_ARRAY = ['Dashboard', 'Invest'];

export default function TabBar(props) {
  const { onChangeTabItemName } = props;

  const [selectedTabItem, setSelectedTabItem] = useState(TAB_NAME_ARRAY[0]);

  const onClickTabItemName = tabName => {
    const onClickTabItem = () => {
      setSelectedTabItem(tabName);
      if (onChangeTabItemName) {
        onChangeTabItemName(tabName);
      }
    };
    return onClickTabItem;
  };

  // Each component should have a corresponding css style.
  const tabItemActiveStyle = tabName => {
    if (tabName !== selectedTabItem) {
      return '';
    }
    return styles.itemActive;
  };

  // Render single tab item with a tab name.
  const renderTabItem = tabName => {
    return (
      <div
        key={tabName}
        className={[styles.item, tabItemActiveStyle(tabName)].join(' ')}
        onClick={onClickTabItemName(tabName)}
      >
        <p className={styles.itemLabel}>{tabName}</p>
      </div>
    );
  };

  const tabItemList = TAB_NAME_ARRAY.map(tabName => renderTabItem(tabName));

  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.container}>{tabItemList}</div>
    </div>
  );
}

export { TAB_NAME_ARRAY };
