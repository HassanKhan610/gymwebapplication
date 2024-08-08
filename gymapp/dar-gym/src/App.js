import {Button} from 'antd';
import HomePage from './pages/home-page';
import AboutPage from './pages/about-page';
import PricePage from './pages/price-page';
import {Routes, Route, Router, Navigate, useNavigate} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import './App.css';
import ProductsPage from './pages/products-page';
import TrainersPage from './pages/trainers-page';
import SignIn from './pages/signin-page';
import SignUp from './pages/signup-page';
import TrainerProfile from './components/trainerprofile/trainerprofile';
import trainers from './components/trainerprofile/trainerJSON';
import Navbar from './components/navbar/Navbar';
import { removeToken } from './services/LocalStorageService';
import {useSelector} from 'react-redux'
import ChangePassword from './pages/change-password';
import SendPasswordResetEmail from './pages/send-password-reset-email';
import ResetPassword from './pages/reset-password';
import SettingsPage from './pages/settings-page';
import Success from './components/successurl/paymentsuccess';



import { getToken } from './services/LocalStorageService';
import {useDispatch} from 'react-redux';
import { useGetLoggedUserQuery } from './services/userAuthApi';

import { setUserInfo, unSetUserInfo } from './features/userSlice';

import Cart from './components/products/cart';
import Failure from './components/successurl/PaymentFailure';
function App() {
  const navigate = useNavigate();
  // const {access_token} = getToken();
  const {access_token} = useSelector(state => state.auth)
  const [current, setCurrent] = useState('1');
  const dispatch = useDispatch();
  const {data, isSuccess} = useGetLoggedUserQuery(access_token)
  const [userData, setUserData] = useState({role: ""})
  //store user data in local state
  useEffect(()=>{
    if (data && isSuccess) {
      setUserData({
        role: data.role
      })
    }
  }, [data, isSuccess])
  console.log(data)

  //store user data in redux store
  useEffect(()=>{
    if (data && isSuccess) {
      dispatch(setUserInfo({
        role: data.role
      }))
    }
  }, [data, isSuccess, dispatch])
  console.log(data)

  
  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  
  return (
    <div className="App">
      {/* <Navbar loggedIn={loggedIn} username={username} onLogout={handleLogout} /> */}
      <Navbar loggedIn={loggedIn} username={username} />
      <Routes>
        <Route path="/" element={access_token ? <HomePage /> : <Navigate to="/login" />} />
        {/* <Route path="/settings" element={access_token ? <ChangePassword /> : <Navigate to="/login" />} /> */}
        <Route path="/settings/:id" element={access_token ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/sendpasswordresetemail" element={<SendPasswordResetEmail />} />
        <Route path="api/user/reset/:id/:token" element={<ResetPassword />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/price" element={access_token ? <PricePage /> : <Navigate to="/login" />} />
        <Route path="/prods" element={<ProductsPage />} />

        {/* <Route
          path="/trainers"
          element={
            access_token ? (
              userData.role === 'trainer' ? <TrainersPage /> : <ProductsPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        /> */}
        <Route path="/trainers" element={<TrainersPage />} />
        
        <Route path="/trainers/:id" element={<TrainerProfile   />} />


        <Route path="/login" element={!access_token ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={<SignUp  />} />
        <Route path="/cart" element={access_token ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
      </Routes>
    </div>
  );
}

export default App;
