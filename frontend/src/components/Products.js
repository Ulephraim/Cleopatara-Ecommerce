/** @format */

import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

const Product = React.memo(({ product, onAddToCart, inWishlistBar }) => {
  const { name, image, price, slug } = product;
  const { state, dispatch } = useContext(Store);
  const {
    wishlist: { wishlistItems },
  } = state;

  const isInWishlist =
    Array.isArray(wishlistItems) &&
    wishlistItems.some((item) => item._id === product._id);

  const addToWishlistHandler = () => {
    const existItem = wishlistItems.find((x) => x._id === product._id);
    if (existItem) {
      dispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: product });
    } else {
      dispatch({ type: 'WISHLIST_ADD_ITEM', payload: product });
    }
  };

  if (!slug || !image) {
    return null; // or render a placeholder if necessary
  }

  return (
    <Card className="product-card">
      <Link to={`/product/${slug}`}>
        <img src={image} className="card-img" alt={name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${slug}`}>
          <Card.Title>{name}</Card.Title>
        </Link>
        <Card.Text>${price}</Card.Text>
        <div className="card-btn">
          {inWishlistBar ? (
            <Button
              className="wishlist-button"
              onClick={() => onAddToCart(product)}
            >
              Add to bag <i className="fas fa-shopping-bag card-icon"></i>
            </Button>
          ) : (
            <>
              <Button
                className="card-icon-button"
                onClick={() => addToWishlistHandler(product)}
              >
                <i
                  className={`${
                    isInWishlist ? 'fas grad-s' : 'far'
                  } fa-heart card-icon`}
                ></i>
              </Button>
              <Button
                className="card-icon-button"
                onClick={() => onAddToCart(product)}
              >
                <i className="fas fa-shopping-bag card-icon"></i>
              </Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
});

export default Product;
