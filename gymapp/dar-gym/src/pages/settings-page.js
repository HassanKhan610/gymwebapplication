import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  SecurityScanOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import ChangePassword from './change-password';
import TrainerProfileForm from './update-trainer-profile';
import {useDispatch} from 'react-redux';

import { setUserInfo, unSetUserInfo } from '../features/userSlice';
import { useGetLoggedUserQuery } from '../services/userAuthApi';
import {useSelector} from 'react-redux'

const { Sider, Content } = Layout;


const SettingsPage = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('user'); // Default selected menu item

  const handleMenuClick = (menuItem) => {
    setSelectedMenuItem(menuItem.key);
  };
  const {access_token} = useSelector(state => state.auth)
  const [current, setCurrent] = useState('1');
  const {data, isSuccess} = useGetLoggedUserQuery(access_token)
  const dispatch = useDispatch();
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


  return (
    <Layout style={{ minHeight: '150vh' }}>
      <Sider width={200} theme="dark" style={{ background: '#001529', padding: '16px' }}>
      <div style={{ color: 'white', fontSize: '20px', textAlign: 'center', marginBottom: '16px' }}>
        SAILOR's GYM
      </div>
        <Menu
          mode="vertical"
          selectedKeys={[selectedMenuItem]}
          onClick={handleMenuClick}
          style={{background:'#de813a'}}
        >
            
        {userData.role === 'trainer' ?
          <Menu.Item key="user" icon={<UserOutlined />}>
            User Settings
          </Menu.Item>
          : <></>
        }
          <Menu.Item key="security" icon={<SecurityScanOutlined />}>
            Security Settings
          </Menu.Item>
          <Menu.Item key="notifications" icon={<NotificationOutlined />}>
            Notification Settings
          </Menu.Item>
        </Menu>
      </Sider>
      <Content>
        {userData.role === 'trainer' ? selectedMenuItem === 'user' && <TrainerProfileForm /> : <></>}
        {selectedMenuItem === 'security' && <ChangePassword />}
        {/* {selectedMenuItem === 'notifications' && <NotificationComponent />} */}
      </Content>
    </Layout>
  );
};

export default SettingsPage;
