import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Typography, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useChangeUserPasswordMutation } from '../services/userAuthApi';
import { getToken, storeToken } from '../services/LocalStorageService';
import { setUserToken } from '../features/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import { useSendPasswordResetEmailMutation } from '../services/userAuthApi';



const SendPasswordResetEmail = () => {
  const [sendPasswordResetEmail, {isLoading}] = useSendPasswordResetEmailMutation();
  const [server_error, setServerError] = useState({});
  const [server_msg, setServerMsg] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const onFinish = async (values) => {
    const data = new FormData(values.currentTarget)
    const actualData = {
      email: data.get('email'),
    }
    const res = await sendPasswordResetEmail(actualData)
    if(res.error){
      console.log(typeof (res.error.data.errors))
      console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
      setServerMsg({})
    }
    if(res.data){
      console.log(typeof (res.data))
      console.log(res.data)
      
      setServerError({})
      setServerMsg(res.data)
      document.getElementById("password-reset-email-form").reset();
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
      <h2>Reset Password</h2>
      <Form name="login" onSubmitCapture={onFinish} id='password-reset-email-form'>
        <Form.Item
          label="Email"
          name="email"
          // rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input name='email' />
        </Form.Item>
        {server_error.email ? <Typography style={{fontSize:12, color:'red'}}>{server_error.email[0]}</Typography> : ""}
        <Form.Item>
        {server_error.non_field_errors ? <Alert type='error' message={server_error.non_field_errors[0]} /> : ''}
        {server_msg.msg ? <Alert type='success' message={server_msg.msg} /> : ''}
          <Button type="primary" htmlType="submit" loading={loading}>
            Send Email
          </Button>
        </Form.Item>

        {/* <div>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div> */}
      </Form>
    </div>
  );
};

export default SendPasswordResetEmail;
