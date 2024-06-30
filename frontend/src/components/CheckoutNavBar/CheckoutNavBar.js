/** @format */

import React from 'react';
import './CheckoutNavbar.css';
import { Link } from 'react-router-dom';

import logoImg from '../../assets/logo-text.png';

const CheckoutNavBar = () => {
  return (
    <div className="checkout-nav">
      <Link className="checkout-nav-brand" to="/">
        <img src={logoImg} alt="logo-text" className="checknav-brand-img" />
      </Link>
    </div>
  );
};

export default CheckoutNavBar;
