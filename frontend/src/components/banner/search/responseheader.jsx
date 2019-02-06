import React from 'react';
import PropTypes from 'prop-types';

import './search.scss';

const Responseheader = props => (
  <p>{props.responseheader}</p>
);
Responseheader.propTypes = {
  responseheader: PropTypes.string,
};

export default Responseheader;
