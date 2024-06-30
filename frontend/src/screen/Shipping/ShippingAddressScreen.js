/** @format */

import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
import Breadcrumb from '../../components/BreadCrumb';
import './ShippingAddressScreen.css';
import CheckoutNavBar from '../../components/CheckoutNavBar/CheckoutNavBar';

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'Paypal'
  );

  const [firstName, setFirstName] = useState(shippingAddress.firstName || '');
  const [lastName, setLastName] = useState(shippingAddress.lastName || '');
  const [companyName, setCompanyName] = useState(
    shippingAddress.companyName || ''
  );
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [suite, setSuite] = useState(shippingAddress.suite || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [countryState, setCountryState] = useState(
    shippingAddress.countryState || ''
  );
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress.phoneNumber || ''
  );

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        firstName,
        lastName,
        companyName,
        address,
        suite,
        city,
        country,
        countryState,
        postalCode,
        phoneNumber,
      },
    });

    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        firstName,
        lastName,
        companyName,
        address,
        suite,
        city,
        country,
        countryState,
        postalCode,
        phoneNumber,
      })
    );
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };
  return (
    <>
      <CheckoutNavBar />
      <div className="shipping-main-container">
        <Helmet>
          <title>Shipping Address</title>
        </Helmet>
        <Breadcrumb />

        <div className="container small-container">
          <h3 className="my-3">Shipping Address</h3>
          <Form onSubmit={submitHandler}>
            <Form.Group className="form-row mg-btm" controlId="fullName">
              <Form.Control
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Form.Control
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mg-btm" controlId="company_name">
              <Form.Control
                placeholder="Company Name [Optional]"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                // required
              />
            </Form.Group>
            <Form.Control
              className="mg-btm"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <Form.Control
              className="mg-btm"
              placeholder="Apartment, Suite etc. [optional]"
              value={suite}
              onChange={(e) => setSuite(e.target.value)}
              // required
            />

            <Form.Group controlId="city" className="mg-btm">
              <Form.Control
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-row mg-btm" controlId="postalCode">
              <Form.Control
                placeholder="Country/Region"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
              <Form.Control
                placeholder="State"
                value={countryState}
                onChange={(e) => setCountryState(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-row mg-btm" controlId="country">
              <Form.Control
                placeholder="ZIP Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
              <Form.Control
                placeholder="Phone number [optional]"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                // required
              />
            </Form.Group>

            <div className="payment-method">
              <p className="my-3"> Payment Method</p>
            </div>

            <div className="form-check-cont">
              <Form.Check
                type="radio"
                id="PayPal"
                label="PayPal"
                value="PayPal"
                checked={paymentMethodName === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Form.Check
                type="radio"
                id="Stripe"
                label="Stripe"
                value="Stripe"
                checked={paymentMethodName === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>

            <div className="form-btn-cont">
              <Button className="next-btn" type="submit">
                Continue
              </Button>
              <Button className="prev-btn">
                <Link to="/cart">Return to cart</Link>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
