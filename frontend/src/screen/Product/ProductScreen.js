/** @format */

import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Rating from '../../components/Rating';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { getError } from '../../utils';
import { Store } from '../../Store';

import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import './Product.css';
import Breadcrumb from '../../components/BreadCrumb';
import NavBar from '../../components/Navbar/NavBar';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReviews: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReviews: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReviews: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_SUGGESTED_REQUEST':
      return { ...state, loadingSuggested: true };
    case 'FETCH_SUGGESTED_SUCCESS':
      return {
        ...state,
        suggestedProducts: action.payload,
        loadingSuggested: false,
      };
    case 'FETCH_SUGGESTED_FAIL':
      return {
        ...state,
        loadingSuggested: false,
        errorSuggested: action.payload,
      };
    default:
      return state;
  }
};

function ProductScreen() {
  const reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [showReviews, setShowReviews] = useState(false);

  const params = useParams();
  const { slug } = params;

  const [
    {
      product,
      loadingCreateReviews,

      suggestedProducts,
    },
    dispatch,
  ] = useReducer(reducer, {
    product: { reviews: [], description: '' },
    loading: true,
    error: '',
    loadingSuggested: false,
    errorSuggested: '',
    suggestedProducts: [],
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, wishlist } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });

        // Fetch suggested products based on the main product's category
        dispatch({ type: 'FETCH_SUGGESTED_REQUEST' });
        const suggestedResult = await axios.get(
          `/api/products/category/${result.data.category}`
        );
        dispatch({
          type: 'FETCH_SUGGESTED_SUCCESS',
          payload: suggestedResult.data,
        });

        const existItem = cart.cartItems.find((x) => x._id === result.data._id);
        const initialQuantity = existItem ? existItem.quantity : 1;
        setQuantity(initialQuantity);
        setTotalPrice(initialQuantity * result.data.price);
        // setStockStatus(
        //   result.data.countInStock > 0 ? 'In Stock' : 'Out of Stock'
        // );
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        dispatch({ type: 'FETCH_SUGGESTED_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug, cart.cartItems]);

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const newQuantity = existItem ? existItem.quantity + quantity : quantity;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < newQuantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: newQuantity },
    });
    // navigate('/cart');
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * product.price);
    // setStockStatus(
    //   newQuantity <= product.countInStock ? 'In Stock' : 'Out of Stock'
    // );
    updateCartHandler(product, newQuantity);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({
        type: 'REFRESH_PRODUCT',
        payload: product,
      });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  const toggleReviews = () => {
    setShowReviews(!showReviews);
  };

  const wishlistItems = wishlist.wishlistItems;

  const addToWishlistHandler = (product) => {
    const isWishlisted = wishlistItems.find((item) => item._id === product._id);
    if (isWishlisted) {
      ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: product });
      toast.info('Removed from wishlist');
    } else {
      ctxDispatch({ type: 'WISHLIST_ADD_ITEM', payload: product });
      toast.success('Added to wishlist');
    }
  };

  return (
    <>
      <NavBar />
      <div className="s-product-container">
        <>
          <div className="product-row-1-1">
            <Breadcrumb />
          </div>
          <Row className="product-row-1">
            <Col className="product-col-1">
              <img
                className="img-large"
                src={product.image}
                alt={product.name}
              ></img>
            </Col>
            <Col className="product-col-2">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Helmet>
                    <title>{product.name}</title>
                  </Helmet>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
                </ListGroup.Item>

                <ListGroup.Item className="price-cont">
                  ${totalPrice.toFixed(2)}
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="desc-tg"> Description:</div>

                  {product.description ? (
                    <ul>
                      {product.description.split('\n').map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No description available.</p>
                  )}
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item className="product-button-container">
                    <div className="order-btn">
                      {quantity > 1 ? (
                        <div className="qty-container">
                          <div className="qty-container-2">
                            <Button
                              className="qty-btn-minus"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                const newQty = quantity > 1 ? quantity - 1 : 1;
                                handleQuantityChange(newQty);
                              }}
                              disabled={quantity === 1}
                            >
                              <i className="fas fa-minus"></i>
                            </Button>{' '}
                            <span className="qty-span">{quantity}</span>
                            <Button
                              className="qty-btn-plus"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                const newQty =
                                  quantity < product.countInStock
                                    ? quantity + 1
                                    : quantity;
                                handleQuantityChange(newQty);
                              }}
                              disabled={quantity === product.countInStock}
                            >
                              <i className="fas fa-plus"></i>
                            </Button>
                          </div>
                          <div className="qty-container-1">
                            {quantity} items added
                          </div>
                        </div>
                      ) : (
                        <Button
                          className="bag-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCartHandler();
                          }}
                        >
                          Add to Bag{' '}
                          <i className="fas fa-shopping-bag left-icon"></i>
                        </Button>
                      )}
                    </div>
                    <div
                      className="order-btn"
                      onClick={(e) => {
                        addToWishlistHandler(product);
                      }}
                    >
                      <Button className="wishlist-btn">
                        Add to wishlist{' '}
                        <i className="far fa-heart left-icon"></i>
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="share-item">
                  <p>SHARE THIS</p>
                  <div className="share-cont-3-icons">
                    <i class="fab fa-facebook foot-icon"></i>
                    <i class="fab fa-twitter foot-icon"></i>
                    <i class="fab fa-instagram foot-icon"></i>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <div className="my-rev">
            <div className="customer-rev-cont">
              <h3 ref={reviewsRef}>Customer Reviews</h3>

              <button className="submit-btn" onClick={toggleReviews}>
                {showReviews ? 'Hide Reviews' : 'Read Reviews'}
              </button>
            </div>
            {showReviews && (
              <div className="review-cont">
                {product.reviews?.length === 0 && (
                  <MessageBox>There is no review</MessageBox>
                )}

                <ListGroup variant="flush">
                  {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating rating={review.rating} caption=" "></Rating>
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}

            <div className="my-3">
              {userInfo ? (
                <form onSubmit={submitHandler}>
                  <h5>Add a review</h5>
                  <Form.Group className="rating-cont" controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="1">1- Poor</option>
                      <option value="2">2- Fair</option>
                      <option value="3">3- Good</option>
                      <option value="4">4- Very good</option>
                      <option value="5">5- Excellent</option>
                    </Form.Control>
                  </Form.Group>

                  <Form
                    as="textarea"
                    className="comment-form"
                    placeholder="Why do you recommend?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <div className="mb-3">
                    <Button
                      disabled={loadingCreateReviews}
                      className="submit-btn"
                      type="submit"
                    >
                      Submit
                    </Button>
                    {loadingCreateReviews && <LoadingBox></LoadingBox>}
                  </div>
                </form>
              ) : (
                <MessageBox>
                  Please{' '}
                  <Link to={`/signin?redirect=/product/${product.slug}`}>
                    Sign In
                  </Link>{' '}
                  to write a review
                </MessageBox>
              )}
            </div>
            <div className="suggested-products">
              <h3>You May Also Like</h3>

              {suggestedProducts.length > 0 && (
                <Row>
                  {suggestedProducts.slice(0, 4).map((suggestedProduct) => {
                    const isWishlisted = wishlistItems.some(
                      (item) => item._id === suggestedProduct._id
                    );
                    return (
                      <Col
                        key={suggestedProduct._id}
                        sm={6}
                        md={4}
                        lg={3}
                        className="suggst-itm"
                      >
                        <Card>
                          <Link to={`/product/${suggestedProduct.slug}`}>
                            <img
                              src={suggestedProduct.image}
                              className="card-img-top"
                              alt={suggestedProduct.name}
                            />
                          </Link>
                          <Card.Body>
                            <Link to={`/product/${suggestedProduct.slug}`}>
                              <Card.Title>{suggestedProduct.name}</Card.Title>
                            </Link>

                            <Card.Text>${suggestedProduct.price}</Card.Text>
                            <div className="suggested-products-btn">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToCartHandler(suggestedProduct);
                                }}
                              >
                                <i className="fas fa-shopping-bag left-icon"></i>
                              </Button>

                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToWishlistHandler(suggestedProduct);
                                }}
                                className={
                                  isWishlisted
                                    ? 'wishlist-buttn active'
                                    : 'wishlist-buttn'
                                }
                              >
                                <i
                                  className={
                                    isWishlisted
                                      ? 'fas fa-heart grad-h'
                                      : 'far fa-heart'
                                  }
                                ></i>
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </div>
          </div>
        </>
      </div>
    </>
  );
}

export default ProductScreen;
