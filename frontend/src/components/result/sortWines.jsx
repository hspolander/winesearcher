import React from 'react';
import PropTypes from 'prop-types';

import './sortWines.scss';

const SortWines = props => (
  <div className="input-div search">
    <span>Sortera på:</span>
    <select onChange={props.sortWines}>
      <option value="" />
      <option value="color">Färg</option>
      <option value="country">Land</option>
      <option value="name">Namn</option>
      <option value="producer">Producent</option>
      <option value="year">År</option>
    </select>
  </div>
);
SortWines.propTypes = {
  sortWines: PropTypes.func.isRequired,
};


export default SortWines;
