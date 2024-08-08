import React, { useState } from 'react';
import { Form, Input, Button, message, Select, Checkbox, Typography, Alert } from 'antd';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../services/userAuthApi';
import { storeToken } from '../services/LocalStorageService';

const { Option } = Select;

const SignUp = ({ onSignUp }) => {
  const [registerUser, {isLoading}] = useRegisterUserMutation()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [server_error, setServerError] = useState({});
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onFinish = async (values) => {
    // values.preventDefault();
    const data = new FormData(values.currentTarget)
    const actualData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      password2: data.get('password2'),
      tc: data.get('tc'),
      role: data.get('role'),
    }
    const res = await registerUser(actualData)
    // console.log(res)
    if(res.error){
      // console.log(typeof(res.error.data.errors))
      console.log(res.error.data.errors)
      setServerError(res.error.data.errors)

      console.log('Form Data:', data);
console.log('Actual Data:', actualData);
    }
    if(res.data){
      console.log('Form Data:', data);
      console.log('Actual Data:', actualData);

      console.log(typeof(res.data))
      console.log(res.data)
      storeToken(res.data.token)
      navigate('/login')
    }
    // setLoading(true);
    // Simulate an API call to register the user (Replace with your backend logic)
    // try {
    //   await onSignUp(values); // Pass the registration function from the parent component
    //   message.success('Registration successful. You can now log in.');
    //   navigate('/login');
    // } catch (error) {
    //   message.error('Registration failed. Please try again.');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    
    <div style={{ maxWidth: '300px', margin: '0 auto' }}>
      {/* {server_error.non_field_errors ? console.log("local state", server_error.non_field_errors[0]) : ""} */}
      <h2>Sign Up</h2>
      <Form  onSubmitCapture={onFinish}>
        <Form.Item
          label="Username"
          name="name"
          // rules={[
          //   { required: true, message: 'Please input your username!' },
          //   { min: 4, message: 'Username must be at least 4 characters.' },
          // ]}
        >
          <Input name='name' />
        </Form.Item>
        {server_error.name ? <Typography style={{fontSize:12, color:'red'}}>{server_error.name[0]}</Typography> : ""}
        <Form.Item
          label="Email"
          name="email"
          // rules={[
          //   {
          //     type: 'email',
          //     message: 'The input is not valid E-mail!',
          //   },
          //   {
          //     required: true,
          //     message: 'Please input your E-mail!',
          //   },
          // ]}
        >
          <Input name='email' />
        </Form.Item>
        {server_error.email ? <Typography style={{fontSize:12, color:'red'}}>{server_error.email[0]}</Typography> : ""}
        <Form.Item
          label="Password"
          name="password"
          // rules={[
          //   { required: true, message: 'Please input your password!' },
          //   { min: 6, message: 'Password must be at least 6 characters.' },
          // ]}
        >
          <Input.Password name='password'  />
        </Form.Item>
        {server_error.password ? <Typography style={{fontSize:12, color:'red'}}>{server_error.password[0]}</Typography> : ""}
        <Form.Item
        label="Confirm Password"
        name="password2"
        dependencies={['password']}
        // rules={[
        //   {
        //     required: true,
        //   },
        //   ({ getFieldValue }) => ({
        //     validator(_, value) {
        //       if (!value || getFieldValue('password') === value) {
        //         return Promise.resolve();
        //       }
        //       return Promise.reject(new Error('The new password that you entered do not match!'));
        //     },
        //   }),
        // ]}
      >
        <Input.Password name='password2'  />
      </Form.Item>
      {server_error.password2 ? <Typography style={{fontSize:12, color:'red'}}>{server_error.password2[0]}</Typography> : ""}


      {/* <Form.Item>
          <Select name='role' initialValue="user">
            <Option value="user">User</Option>
            <Option value="trainer">Trainer</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>*/}
        <Form.Item>
          <select name="role" id="role" initialValue="user">
            <option value="user">User</option>
            <option value="trainer">Trainer</option>
            <option value="admin">Admin</option>
          </select>
        </Form.Item>

      <Form.Item 
      name="tc"
      valuePropName={true}
      >
        <Checkbox name='tc' value={true}>agree to terms and consitions?</Checkbox>
      </Form.Item>
      {server_error.tc ? <Typography style={{fontSize:12, color:'red'}}>{server_error.tc[0]}</Typography> : ""}

      
       
      {server_error.non_field_errors ? <Alert type='error' message={server_error.non_field_errors[0]} /> : ''}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sign Up
          </Button>
        </Form.Item>

        <div>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </Form>
    </div>
  );
};

export default SignUp;
