import React from 'react';

const Tooltip = ({ title = '', children }) => {
  return (
    <span
      className="icon"
      data-tooltip={title}
      data-variation="small"
      data-inverted
    >
      {children}
    </span>
  );
};

export default Tooltip;
