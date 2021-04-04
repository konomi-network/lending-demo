import React from 'react';
import { Popup } from 'semantic-ui-react';

import { ReactComponent as QuestionMark } from 'resources/icons/QuestionMark.svg';

const Hint = ({ text = '' }) => {
  return (
    <Popup
      basic
      content={text}
      trigger={<QuestionMark />}
      size="mini"
      style={{
        background: '#181B59',
        borderRadius: 9,
        border: 'none',
        padding: 12,
        width: 200,
        fontSize: 14,
        color: '#D1CCCC',
      }}
    ></Popup>
  );
};

export default Hint;
