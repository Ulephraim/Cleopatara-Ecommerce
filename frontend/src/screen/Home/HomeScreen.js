/** @format */

import { useEffect, useMemo, useReducer, useState, useContext } from 'react';
import logger from 'use-reducer-logger';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../../components/Products';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import navImg1 from '../../assets/img-1.png';
import navImg2 from '../../assets/img-2.png';
import './HomeScreen.css';
import { Store } from '../../Store';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Navbar/NavBar';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS_NEW':
      return { ...state, newProducts: action.payload, loading: false };
    case 'FETCH_SUCCESS_BEST':
      return { ...state, bestSellers: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, wishlist } = state;

  const [currentImage, setCurrentImage] = useState(0);
  const images = useMemo(() => [navImg1, navImg2], []);

  useEffect(() => {
    const changeImage = () => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    };
    const intervalId = setInterval(changeImage, 3000);
    return () => clearInterval(intervalId);
  }, [images]);

  const [{ loading, error, newProducts, bestSellers }, dispatch] = useReducer(
    logger(reducer),
    {
      newProducts: [],
      bestSellers: [],
      loading: true,
      error: '',
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const newProductsResult = await axios.get('/api/products/new-products');
        const bestSellersResult = await axios.get('/api/products/best-sellers');
        dispatch({
          type: 'FETCH_SUCCESS_NEW',
          payload: newProductsResult.data,
        });
        dispatch({
          type: 'FETCH_SUCCESS_BEST',
          payload: bestSellersResult.data,
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };

  const discoverMore = (e) => {
    e.preventDefault();

    navigate('/search');
  };

  const addToWishlistHandler = (product) => {
    const existItem = wishlist.find((x) => x._id === product._id);
    if (existItem) {
      ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: product });
    } else {
      ctxDispatch({ type: 'WISHLIST_ADD_ITEM', payload: product });
    }
  };

  return (
    <div>
      <NavBar />
      <Helmet>
        <title>Cleopatra-Home</title>
      </Helmet>

      <div className="nav-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slideshow img ${index + 1}`}
            className={index === currentImage ? 'active' : ''}
          />
        ))}
      </div>

      <div className="products-container">
        <div className="products-container-header">
          <h3>New Products</h3>
          <button className="container-dm" onClick={discoverMore}>
            <p>Discover More</p>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        <div className="products">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Row>
              {newProducts.map((product) => (
                <Col
                  key={product.slug}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-3 product-mb"
                >
                  <Product
                    product={product}
                    onAddToCart={addToCartHandler}
                    onAddToWishlist={addToWishlistHandler}
                    wishlist={wishlist}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>

      <div className="mid-cont">
        <div className="mid-cont-message">
          <h1>20K+</h1>
          <p>Featured Brands</p>
        </div>
        <div className="mid-cont-message">
          <h1>$5M</h1>
          <p>Products Sale</p>
        </div>
        <div className="mid-cont-message">
          <h1>96%</h1>
          <p>Client Satisfaction</p>
        </div>
      </div>

      <div className="products-container">
        <div className="products-container-header">
          <h3>Best Sellers</h3>
          <button className="container-dm" onClick={discoverMore}>
            <p>Discover More</p>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        <div className="products">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Row>
              {bestSellers.map((product) => (
                <Col
                  key={product.slug}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-3 product-mb"
                >
                  <Product
                    product={product}
                    onAddToCart={addToCartHandler}
                    onAddToWishlist={addToWishlistHandler}
                    wishlist={wishlist}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
