import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Typography, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../services/userAuthApi';
import { getToken, storeToken } from '../services/LocalStorageService';
import { setUserToken } from '../features/authSlice';
import {useDispatch} from 'react-redux';


const SignIn = ({ onLogin }) => {
  const [loginUser, {isLoading}] = useLoginUserMutation();
  const [server_error, setServerError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const onFinish = async (values) => {
    const data = new FormData(values.currentTarget)
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    }
    const res = await loginUser(actualData)
    // console.log(res)
    if(res.error){
      // console.log(typeof(res.error.data.errors))
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
    }
    if(res.data){
      // console.log(typeof(res.data))
      let {access_token} = getToken()
      dispatch(setUserToken({access_token: access_token}))
      console.log(res.data)
      storeToken(res.data.token)
      navigate('/');
    }
  };

  //refreshing
  let {access_token} = getToken()
  useEffect(()=>{
    dispatch(setUserToken({access_token: access_token}))
  }, [access_token, dispatch])
  //   setLoading(true);
  //   // Simulate an API call to authenticate the user (Replace with your backend logic)
  //   try {
  //     await onLogin(values); // Pass the login function from the parent component
  //      console.log('Received values of form: ', values);
  //     message.success('Login successful.');
  //     navigate('/');
  //   } catch (error) {
  //     message.error('Login failed. Please check your credentials.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto' }}>
      <h2>Log In</h2>
      <Form name="login" onSubmitCapture={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          // rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input name='email' />
        </Form.Item>
        {server_error.email ? <Typography style={{fontSize:12, color:'red'}}>{server_error.email[0]}</Typography> : ""}
        <Form.Item
          label="Password"
          name="password"
          // rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password name='password' />
        </Form.Item>
        {server_error.password ? <Typography style={{fontSize:12, color:'red'}}>{server_error.password[0]}</Typography> : ""}
        <Form.Item>
        {server_error.non_field_errors ? <Alert type='error' message={server_error.non_field_errors[0]} /> : ''}
          <Button type="primary" htmlType="submit" loading={loading}>
            Log In
          </Button>

        <div>
          <Link to="/sendpasswordresetemail">Forgot Password?</Link>
        </div>
        </Form.Item>

        <div>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </Form>
    </div>
  );
};

export default SignIn;
