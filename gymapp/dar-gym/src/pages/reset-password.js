import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Typography, Alert } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useChangeUserPasswordMutation } from '../services/userAuthApi';
import { getToken, storeToken } from '../services/LocalStorageService';
import { setUserToken } from '../features/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import { useResetPasswordMutation } from '../services/userAuthApi';



const ResetPassword = () => {
  const [resetPassword] = useResetPasswordMutation();
  const [server_error, setServerError] = useState({});
  const [server_msg, setServerMsg] = useState({});
  const {id, token} = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {access_token} = getToken();


  const onFinish = async (values) => {
    const data = new FormData(values.currentTarget)
    const actualData = {
      password: data.get('password'),
      password2: data.get('password2'),
    }
    const res = await resetPassword({actualData, id, token})
    if(res.error){
      setServerError(res.error.data.errors)
      setServerMsg({})
    }
    if(res.data){
      setServerError({})
      setServerMsg(res.data)
      document.getElementById("password-reset-form").reset();
      setTimeout(()=>{
        navigate("/login")
      }, 3000)
    }
  };

  //refreshing
  // let {access_token} = getToken()
  // useEffect(()=>{
  //   dispatch(setUserToken({access_token: access_token}))
  // }, [access_token, dispatch])
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

  //getting user data from redux store
  // const myData = useSelector(state => state.user)
  // console.log("change password", myData)
  return (
    <div style={{ maxWidth: '300px', margin: '0 auto' }}>
      <h2>Change Password</h2>
      <Form name="login" onSubmitCapture={onFinish} id='password-reset-form'>
        <Form.Item
          label="Password"
          name="password"
          // rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password name='password' />
        </Form.Item>
        {server_error.password ? <Typography style={{fontSize:12, color:'red'}}>{server_error.password[0]}</Typography> : ""}
        <Form.Item
          label="Password"
          name="password2"
          // rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password name='password2' />
        </Form.Item>
        {server_error.password2 ? <Typography style={{fontSize:12, color:'red'}}>{server_error.password2[0]}</Typography> : ""}
        <Form.Item>
        {server_error.non_field_errors ? <Alert type='error' message={server_error.non_field_errors[0]} /> : ''}
        {server_msg.msg ? <Alert type='success' message={server_msg.msg} /> : ''}
          <Button type="primary" htmlType="submit" loading={loading}>
            Change Password
          </Button>
        </Form.Item>

        {/* <div>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div> */}
      </Form>
    </div>
  );
};

export default ResetPassword;
