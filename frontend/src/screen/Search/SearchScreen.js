/** @format */

import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getError } from '../../utils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rating from '../../components/Rating';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Product from '../../components/Products';
import { LinkContainer } from 'react-router-bootstrap';
import './SearchScreen.css';
import { Store } from '../../Store';
import NavBar from '../../components/Navbar/NavBar';
import { API_BASE_URL } from '../../api';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },
  {
    name: '3stars & up',
    rating: 3,
  },
  {
    name: '2stars & up',
    rating: 2,
  },
  {
    name: '1stars & up',
    rating: 1,
  },
];

const categoryMessages = {
  all: 'Explore our extensive range of products across various categories.',
  Conditioner:
    "  Shop our extensive selection of hair conditioners from the best brands in the world and give your hair the nourishment it deserves. Our collection features luxurious products from Aweda (Estée Lauder), L'Oreal Paris (L'Oreal), Garnier (L'Oreal), Dove (Unilever), Clairol (P&G), Matrix from L'Oreal, Pantene from P&G, and Neutrogena from Johnson & Johnson. These top-rated conditioners are formulated to address various hair needs, from hydration and smoothing to repair and color protection. Keep your locks smooth, shiny, and healthy with our carefully selected conditioners, designed to bring out the best in your hair.",

  Treatments:
    "Revitalize your hair with our intensive hair treatments, specially formulated to repair, strengthen, and protect your locks. Our selection includes nourishing masks, reparative serums, and invigorating scalp treatments from renowned brands like Olaplex, Kerastase, and Moroccan Oil. These treatments penetrate deeply to address damage, enhance moisture, and improve overall hair health. Whether you're dealing with dryness, breakage, or color damage, our treatments offer targeted solutions to restore your hair's vitality and shine. Give your hair the care it deserves with our powerful and effective treatment options.",

  Organic:
    "Embrace the natural beauty with our comprehensive range of organic hair care products. Our organic shampoos, conditioners, and treatments are crafted with pure, natural ingredients, free from harmful chemicals and artificial additives. Enjoy the gentle yet effective care provided by brands like Avalon Organics, Acure, and SheaMoisture, which are committed to sustainability and eco-friendly practices. Our organic products not only nourish your hair but also support a healthier planet. Transform your hair care routine with our organic collection and experience the benefits of nature's finest ingredients.",

  Relaxers:
    "Achieve sleek, straight hair with our professional-grade hair relaxers, perfect for taming frizz and smoothing out curls. Our selection features trusted brands like Mizani, Dark and Lovely, and SoftSheen-Carson, which deliver salon-quality results in the comfort of your home. These gentle yet effective relaxers are designed to provide long-lasting straight hair while minimizing damage. Whether you have coarse, curly, or wavy hair, our relaxers help you achieve the smooth, manageable hair you've always desired. Enjoy the confidence of perfectly straight hair with our top-tier relaxers.",
  Shampoo:
    "  Transform your hair care routine with our extensive range of shampoos from leading brands. Our collection caters to all hair types and concerns, ensuring you find the perfect match for your needs. Whether you're looking to hydrate, volumize, clarify, or protect color, we have the ideal shampoo for you. Explore top brands like L'Oreal Paris, Head & Shoulders, Pantene, and Neutrogena, known for their innovative formulations and effective results. Keep your hair clean, fresh, and vibrant with our high-quality shampoos that promise to enhance your hair's health and beauty.",
  Styling:
    "Create stunning hairstyles with our professional styling products, designed to help you achieve any look with ease. From volumizing mousses and texturizing sprays to strong-hold gels and heat protectants, our collection includes everything you need for perfect styling. Brands like TRESemmé, Redken, and Paul Mitchell offer high-quality solutions that cater to every hair type and style preference. Whether you're aiming for sleek and smooth, bouncy curls, or beachy waves, our styling products provide the tools to make your vision a reality. Elevate your hairstyling game with our expertly curated range.",

  Accessories:
    "Discover our premium range of hair accessories designed to elevate your style and add a touch of elegance to any look. Our curated selection includes everything from chic hairbands and elegant clips to trendy scrunchies and versatile hair ties. Whether you're dressing up for a special occasion or looking for everyday essentials, our collection has the perfect accessory for you. Shop top brands like Goody, Scunci, and Conair to ensure you're always stepping out in style. With our hair accessories, you can effortlessly transform your look and express your unique personality.",
};

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;
  const brand = sp.get('brand') || 'all';

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      products: [],
    });
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/products/brands`);
        setBrands(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/products/search?page=${page}&query=${query}&category=${category}&brand=${brand}&price=${price}&rating=${rating}&order=${order}&pageSize=12`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };

    fetchData();
  }, [category, error, order, page, price, query, rating, brand]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/products/categories`
        );
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const [categoryMessage, setCategoryMessage] = useState(categoryMessages.all);

  useEffect(() => {
    setCategoryMessage(categoryMessages[category] || categoryMessages.all);
  }, [category]);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  const toggleDropdown = (dropdown) => {
    if (dropdown === 'department') setIsDepartmentOpen(!isDepartmentOpen);
    if (dropdown === 'price') setIsPriceOpen(!isPriceOpen);
    if (dropdown === 'rating') setIsRatingOpen(!isRatingOpen);
    if (dropdown === 'brand') setIsBrandOpen(!isBrandOpen);
  };

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory =
      filter.category !== undefined ? filter.category : category || 'all';
    const filterQuery =
      filter.query !== undefined ? filter.query : query || 'all';
    const filterBrand =
      filter.brand !== undefined ? filter.brand : brand || 'all';
    const filterRating =
      filter.rating !== undefined ? filter.rating : rating || 'all';
    const filterPrice =
      filter.price !== undefined ? filter.price : price || 'all';
    const sortOrder =
      filter.order !== undefined ? filter.order : order || 'newest';
    const filterPageSize = filter.pageSize || 12;

    const queryString = `?category=${filterCategory}&query=${filterQuery}&brand=${filterBrand}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}&pageSize=${filterPageSize}`;

    return {
      pathname: '/search',
      search: queryString,
    };
  };

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, wishlist } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `${API_BASE_URL}/api/products/${product._id}`
    );

    if (data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
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
        <title>Search Products</title>
      </Helmet>

      <div className="search-container-1">
        <div className="search-col-1">
          <Col className="text-start">
            Sort by :
            <select
              value={order}
              onChange={(e) =>
                navigate(getFilterUrl({ order: e.target.value }))
              }
            >
              <option value="newest">Newest Arrivals</option>
              <option value="lowest">Price: Low to High</option>
              <option value="highest">Price: High to Low</option>
              <option value="toprated">Avg. Customer Reviews</option>
            </select>
          </Col>
          <div className="filter-p">
            <p>Filter by: </p>
          </div>

          <div
            className="dropdown-header"
            onClick={() => toggleDropdown('brand')}
          >
            <p>Brand</p>
            <Button variant="light">{isBrandOpen ? '-' : '+'}</Button>
          </div>
          {isBrandOpen && (
            <div className="department-list">
              <ul>
                <li>
                  <Link
                    className={'all' === brand ? 'text-bold' : ''}
                    to={getFilterUrl({ brand: 'all' })}
                  >
                    Any
                  </Link>
                </li>
                {brands.map((b) => (
                  <li key={b}>
                    <Link
                      className={b === brand ? 'text-bold' : ''}
                      to={getFilterUrl({ brand: b })}
                    >
                      {b}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            className="dropdown-header"
            onClick={() => toggleDropdown('price')}
          >
            <p>Price</p>
            <Button variant="light">{isPriceOpen ? '-' : '+'}</Button>
          </div>
          {isPriceOpen && (
            <div className="department-list">
              <ul>
                <li>
                  <Link
                    className={'all' === price ? 'text-bold' : ''}
                    to={getFilterUrl({ price: 'all' })}
                  >
                    Any
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <Link
                      to={getFilterUrl({ price: p.value })}
                      className={p.value === price ? 'text-bold' : ''}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            className="dropdown-header"
            onClick={() => toggleDropdown('rating')}
          >
            <p>Customer Reviews</p>
            <Button variant="light">{isRatingOpen ? '-' : '+'}</Button>
          </div>
          {isRatingOpen && (
            <div className="department-list">
              <ul>
                {ratings.map((r) => (
                  <li key={r.name}>
                    <Link
                      to={getFilterUrl({ rating: r.rating })}
                      className={
                        `${r.rating}` === `${rating}` ? 'text-bold' : ''
                      }
                    >
                      <Rating caption={' & up'} rating={r.rating}></Rating>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to={getFilterUrl({ rating: 'all' })}
                    className={rating === 'all' ? 'text-bold' : ''}
                  >
                    <Rating caption={' & up'} rating={0}></Rating>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="search-col-2">
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div>
              <Row className="filter-products-row-hd">
                <Col className="filter-products-col-hd">
                  <div>
                    {countProducts === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
              </Row>
              <div className="filter-products-row">
                {products.map((product) => (
                  <div
                    className="filter-products-col"
                    key={product.slug}
                    sm={6}
                    md={4}
                    lg={3}
                  >
                    <Product
                      product={product}
                      onAddToCart={addToCartHandler}
                      onAddToWishlist={addToWishlistHandler}
                      wishlist={wishlist}
                    />
                  </div>
                ))}
              </div>

              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      id="pagenumb-btn"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </div>
          )}
          <div className="search-message">
            <h2>
              About {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <p>{categoryMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
