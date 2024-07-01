/** @format */

import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import './NavBar.css';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Store } from '../../Store';
import Button from 'react-bootstrap/Button';
import { getError } from '../../utils';
import axios from 'axios';
import SearchBox from '../SearchBox';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { ToastContainer, toast } from 'react-toastify';
import logoImg from '../../assets/logo-text.png';
import Product from '../Products';
import { API_BASE_URL } from '../../api';

const NavBar = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [categories, setCategories] = useState([]);
  const [navbarTransparent, setNavbarTransparent] = useState(true);
  const [scrolledOnce, setScrolledOnce] = useState(false);
  const [activeCategory, setActiveCategory] = useState(''); // State to keep track of active category

  const location = useLocation();

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

  useEffect(() => {
    if (location.pathname === '/') {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setNavbarTransparent(false);
          setScrolledOnce(true);
        } else if (!scrolledOnce) {
          setNavbarTransparent(true);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setNavbarTransparent(false); // Ensure navbar is solid for other pages
    }
  }, [location.pathname, scrolledOnce]);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [cartBarIsOpen, setCartBarIsOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarIsOpen(!sidebarIsOpen);
  };
  const toggleCartBar = () => {
    setCartBarIsOpen(!cartBarIsOpen);
  };
  const handleCategoryClick = (category) => {
    setActiveCategory(category); // Set clicked category as active
    setSidebarIsOpen(false); // Close sidebar on category click
  };

  const {
    wishlist: { wishlistItems },
  } = state;
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

  const removeWishlistItemHandler = (item) => {
    ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: item });
  };
  return (
    <div className="d-flex flex-column main-nav">
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <Navbar
          className={`d-nav-bar ${navbarTransparent ? 'transparent' : 'solid'}`}
          expand="lg"
        >
          <Container className="d-nav-bar-container">
            <Button className="sidebar-btn" onClick={toggleSidebar}>
              <i className="fas fa-bars left-icon"></i>
            </Button>
            <div className="profile-container">
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title="Admin"
                  id="admin-nav-dropdown"
                  className="custom-nav-dropdown"
                >
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              {userInfo ? (
                <div className="user-p-container">
                  <i className="far fa-user left-icon"></i>
                  <NavDropdown
                    title={userInfo.name}
                    id="basic-nav-dropdown"
                    className="custom-nav-dropdown"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item> Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="/signout"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                </div>
              ) : (
                <Link className="nav-link" to="/signin">
                  Sign In
                </Link>
              )}
            </div>
            <Link className="nav-brand" to="/">
              <img src={logoImg} alt="logo-text" className="nav-brand-img" />
            </Link>
            <Nav className="nav-left">
              <SearchBox />
              <button
                className="nav-left-icon"
                onClick={(e) => {
                  e.preventDefault();
                  toggleCartBar();
                }}
              >
                <i className="far fa-heart left-icon"></i>
              </button>
              <Link to="/cart" className="nav-left-icon">
                <i className="fas fa-shopping-bag left-icon"></i>
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger" className="cart-badge">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
            </Nav>
          </Container>
          <Container className="nav-category-cont">
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{
                    pathname: '/search',
                    search: `?category=${encodeURIComponent(category)}`,
                  }}
                  onClick={() => handleCategoryClick(category)}
                  className={`navLink ${
                    activeCategory === category ? 'selected' : ''
                  }`}
                >
                  <Link>{category}</Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Container>
        </Navbar>
        {sidebarIsOpen && (
          <div className="pop-up">
            <div className={`side-nav ${sidebarIsOpen ? 'active' : ''}`}>
              <div className="closebtn-container">
                <strong className="sidenav-close" onClick={toggleSidebar}>
                  &times;
                </strong>
              </div>

              <div className="profile-container-side-nav">
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown
                    title="Admin"
                    id="admin-nav-dropdown"
                    className="custom-nav-dropdown"
                  >
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/products">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orders">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/users">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
                {userInfo ? (
                  <div className="user-p-container">
                    <i className="far fa-user left-icon"></i>
                    <NavDropdown
                      title={userInfo.name}
                      id="basic-nav-dropdown"
                      className="custom-nav-dropdown"
                    >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item> Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="/signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  </div>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
              </div>

              <Nav.Item className="sidenav-head">
                <strong>Categories</strong>
              </Nav.Item>
              {categories.map((category) => (
                <Nav.Item key={category} className="sidenav-category">
                  <LinkContainer
                    to={{
                      pathname: '/search',
                      search: `?category=${encodeURIComponent(category)}`,
                    }}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))}
            </div>
          </div>
        )}

        {cartBarIsOpen && (
          <div className="pop-up">
            <div className={`cart-Bar ${cartBarIsOpen ? 'active' : ''}`}>
              <div className="p-cartbar">
                <Button className="cartbar-btn" onClick={toggleCartBar}>
                  <i class="fas fa-times"></i>
                </Button>
                <p>Your Wishlist</p>
              </div>
              <p className="p-edit-wishlist">
                Edit, Manage and share your wishlist
              </p>
              <button className="share-wishlist-btn">
                Share your wishlist
              </button>

              <div className="wishlist-product-cont">
                {wishlistItems.length === 0 ? (
                  <div>No items in the wishlist.</div>
                ) : (
                  <div className="wishlist-product">
                    {wishlistItems.map((item) => (
                      <div className="wishlist-product-item">
                        <Button
                          className="wishlist-product-btn"
                          onClick={() => removeWishlistItemHandler(item)}
                        >
                          <i class="fas fa-times"></i>
                        </Button>
                        <Product
                          key={item._id}
                          product={item}
                          onAddToCart={addToCartHandler}
                          inWishlistBar={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      {location.pathname === '/' && navbarTransparent && (
        <div className="nav-message">
          <p>New Customers Save 10%</p>
        </div>
      )}
    </div>
  );
};

export default NavBar;
