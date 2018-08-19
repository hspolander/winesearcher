import React from 'react';
import { Link } from 'react-router-dom';

import './logo.scss';

const Logo = () => (
  <div className="banner-logo">
    <Link to="/">
      <img id="winereviewer-logo" src="./img/winereviewer.png" alt="Wineglasses" />
    </Link>
  </div>
);

export default Logo;

