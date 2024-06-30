/** @format */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screen/Home/HomeScreen';
import ProtectedRoute from './components/ProtectedRoutes';
import AdminRoute from './components/AdminRoute';
import CartScreen from './screen/Cart/CartScreen';
import SearchScreen from './screen/Search/SearchScreen';
import SigninScreen from './screen/SignIn/SigninScreen';
import SignupScreen from './screen/SignUp/SignupScreen';
import ProfileScreen from './screen/Profile/ProfileScreen';
import PlaceOrderScreen from './screen/PlaceOrder/PlaceOrderScreen';
import OrderScreen from './screen/Order/OrderScreen';
import OrderHistoryScreen from './screen/Order/OrderHistoryScreen';
import ShippingAddressScreen from './screen/Shipping/ShippingAddressScreen';
import DashboardScreen from './screen/Dashboard/DashboardScreen';
import OrderListScreen from './screen/Order/OrderListScreen';
import UserListScreen from './screen/User/UserListScreen';
import ProductListScreen from './screen/Product/ProductListScreen';
import ProductScreen from './screen/Product/ProductScreen';
import ProductEditScreen from './screen/Product/ProductEditScreen';
import UserEditScreen from './screen/User/UserEditScreen';

import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="site-container">
        <ToastContainer position="bottom-center" limit={1} />

        <main>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }
            />

            <Route path="/shipping" element={<ShippingAddressScreen />} />

            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardScreen></DashboardScreen>
                </AdminRoute>
              }
            ></Route>

            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <OrderListScreen />
                </AdminRoute>
              }
            ></Route>

            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>
              }
            ></Route>

            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>
              }
            ></Route>

            <Route
              path="/admin/product/:id"
              element={
                <AdminRoute>
                  <ProductEditScreen />
                </AdminRoute>
              }
            ></Route>

            <Route
              path="/admin/user/:id"
              element={
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>
              }
            ></Route>

            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>

        <footer>
          <Footer />
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
