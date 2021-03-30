import React from 'react';

import { ReactComponent as QuestionMark } from 'resources/icons/QuestionMark.svg';
import Tooltip from '../Tooltip';

const Hint = ({ text = '' }) => {
  return (
    <Tooltip title={text}>
      <QuestionMark />
    </Tooltip>
  );
};

export default Hint;
