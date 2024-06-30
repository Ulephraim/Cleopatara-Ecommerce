/** @format */

import React from 'react';
import './Footer.css';
const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-container-1">
        <h5>Customer Service</h5>
        <p>Contact us</p>
        <p>Return policy & Exchanges</p>
        <p>FAQs</p>
        <p>Product recalls</p>
      </div>
      <div className="footer-container-2">
        <h5>About us</h5>
        <p>Brand delivery</p>
        <p>Terms and conditions</p>

        <p>Product recalls</p>
      </div>
      <div className="footer-container-3">
        <h5>Socials</h5>
        <div className="container-3-icons">
          <i class="fab fa-facebook foot-icon"></i>
          <i class="fab fa-twitter foot-icon"></i>
          <i class="fab fa-instagram foot-icon"></i>
        </div>
        <p>Sign up to our mailing list of VIP offers and new product alerts</p>
        <div className="footer-input">
          <input placeholder="Enter your email" />
          <button>
            Sign Up <i class="fas fa-envelope"></i>{' '}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Footer;
