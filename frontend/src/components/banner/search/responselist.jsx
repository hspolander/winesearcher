import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import './search.scss';

class Responselist extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, data) {
    const item = data[e.target.dataset.id];
    const path = `/reviews/${item.table}/${item.property}/${item.value}`;
    this.props.history.push(path);
  }

  render() {
    const data = this.props.responselist;
    const list = [];
    for (let i = 0; i < data.length; i += 1) {
      list.push(
        <li
          className="autocomplete-item" key={i}
          onClick={e => this.handleClick(e, data)}
          data-id={i}
        >
          {data[i].value}
        </li>);
    }
    return (
      <ul>{list}</ul>
    );
  }
}
Responselist.propTypes = {
  responselist: PropTypes.array,
  history: PropTypes.object,
};

export default withRouter(Responselist);
