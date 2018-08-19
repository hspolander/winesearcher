import React from 'react';
import { withRouter } from 'react-router-dom';

import './search.scss';

class Responselist extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, data) {
    data = data[e.target.dataset.id];
    const path = `/reviews/${data.table}/${data.property}/${data.value}`;
    this.props.history.push(path);
  }

  render() {
    const data = this.props.responselist;
    const list = [];
    for (var i = 0; i < data.length; i++) {
      list.push(
        <li className="autocomplete-item" key={i} onClick={(e) => this.handleClick(e, data)}
        data-id={i}>{data[i].value}</li>);
    }
    return (
      <ul>{list}</ul>
    );
  }
}

export default withRouter(Responselist);