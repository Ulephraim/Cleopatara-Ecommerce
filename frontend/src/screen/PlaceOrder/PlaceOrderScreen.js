/** @format */

import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';

import { Helmet } from 'react-helmet-async';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Store } from '../../Store';
import { Link, useNavigate } from 'react-router-dom';
import LoadingBox from '../../components/LoadingBox';
import Breadcrumb from '../../components/BreadCrumb';
import CheckoutNavBar from '../../components/CheckoutNavBar/CheckoutNavBar';
import './PlaceOrderScreen.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };

    case 'CREATE_SUCCESS':
      return { ...state, loading: false };

    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const PlaceOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <>
      <CheckoutNavBar />
      <div className="placeorder-container">
        <Helmet>
          <title>Preview Order</title>
        </Helmet>
        <Breadcrumb />
        <h3 className="my-3">Preview Order</h3>

        <div className="placeorder-row">
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <strong>Name: </strong> {cart.shippingAddress.firstName}{' '}
                  {cart.shippingAddress.lastName}
                  <br />
                  <strong>Address: </strong>
                  <span> {cart.shippingAddress.address}, </span>
                  <span> {cart.shippingAddress.companyName}, </span>
                  <span> {cart.shippingAddress.address}, </span>
                  <span> {cart.shippingAddress.suite}, </span>
                  <span> {cart.shippingAddress.city}, </span>
                  <span> {cart.shippingAddress.country}, </span>
                  <span> {cart.shippingAddress.countryState}, </span>
                  <span> {cart.shippingAddress.postalCode}, </span>
                  <span> {cart.shippingAddress.phoneNumber}</span>
                </Card.Text>
                <Link className="edit-tag" to="/shipping">
                  Edit
                </Link>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="mb-3">
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Method: </strong> {cart.paymentMethod}
                </Card.Text>
                <Link className="edit-tag" to="/shipping">
                  {' '}
                  Edit
                </Link>
              </Card.Body>
            </Card>
            <br />
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Items</Card.Title>
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={8}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          ></img>
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={2}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={2}>${item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <Link className="edit-tag" to="/cart">
                  {' '}
                  Edit
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${cart.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${cart.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${cart.taxPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Order Total</strong>
                      </Col>
                      <Col>
                        {' '}
                        <strong>${cart.totalPrice.toFixed(2)}</strong>{' '}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        type="button"
                        onClick={PlaceOrderHandler}
                        disabled={cart.cartItems.length === 0}
                      >
                        Place Order
                      </Button>
                    </div>
                    {loading && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </div>
      </div>
    </>
  );
}
