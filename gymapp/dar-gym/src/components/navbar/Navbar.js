import React, { useEffect, useState } from 'react';
import { Layout, Menu, Drawer, Dropdown, Button } from 'antd';
import { MenuOutlined, DownOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/45671.jpg';
import { getToken, removeToken } from '../../services/LocalStorageService';
import {useDispatch, useSelector} from 'react-redux';
import { useGetLoggedUserQuery } from '../../services/userAuthApi';

import './navbar.css';
import { unSetUserToken } from '../../features/authSlice';
import { setUserInfo, unSetUserInfo } from '../../features/userSlice';

const items = [
  {
    label: (
      <Link to="/">
        Home
      </Link>
    ),
    key: '1',
  },
  {
    label: (
      <Link to="/about">
        About
      </Link>
    ),
    key: '2',
  },
  {
    label: (
      <Link to="/prods">
        Products
      </Link>
    ),
    key: '3',
  },
  {
    label: (
      <Link to="/price">
        Price
      </Link>
    ),
    key: '4',
  },
  {
    label: (
      <Link to="/trainers">
        Trainers
      </Link>
    ),
    key: '5',
  },
  {
    label: (
      <Link to="/login">
        Login
      </Link>
    ),
    key: '6',
  },
  {
    label: (
      <Link to="/signup">
        SignUp
      </Link>
    ),
    key: '7',
  },
];

const { Header } = Layout;

function Navbar({ loggedIn, username }) {
  // const cartItems = useSelector(state => state.cart.items);
  const totalQuantity = useSelector((state) =>
  state.cart.reduce((total, item) => total + item.quantity, 0)
);


  const navigate = useNavigate();
  const {access_token} = getToken();
  const [current, setCurrent] = useState('1');
  const dispatch = useDispatch();
  const {data, isSuccess} = useGetLoggedUserQuery(access_token)
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    id: "",
  })
  const handleLogout = () => {
    dispatch(unSetUserInfo({name: "", email: ""}))
    dispatch(unSetUserToken({access_token: null}))
    removeToken()
    navigate('/login')
    // setLoggedIn(false);
    // setUsername('');
  };
  
  
  //store user data in local state
  useEffect(()=>{
    if (data && isSuccess) {
      setUserData({
        email: data.email,
        name: data.name,
        id: data.id
      })
    }
  }, [data, isSuccess])
  console.log(data)

  const handleSettings = () => {
    navigate(`/settings/${userData.id}`);
    // setLoggedIn(false);
    // setUsername('');
  };
  
  //store user data in redux store
  useEffect(()=>{
    if (data && isSuccess) {
      dispatch(setUserInfo({
        email: data.email,
        name: data.name
      }))
    }
  }, [data, isSuccess, dispatch])
  console.log(data)

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
 

    const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
      <Menu.Item key="settings" onClick={handleSettings}>
        Settings
      </Menu.Item>
    </Menu>
  );

  return (
    <>
    {/* <Header style={{ backgroundColor: '#fff', boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
          </div>
        </Col>
        <Col>
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
            <Menu.Item key="1">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/about">About</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/Price">Price</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col>
            <Menu theme="light" mode="horizontal" style={{ lineHeight: '64px', display: 'flex', justifyContent: 'flex-end' }}>
                <Menu.Item key="4">
                <Link to="/login">Login</Link>
                </Menu.Item>
                <Menu.Item key="5">
                <Link to="/signup">Signup</Link>
                </Menu.Item>
            </Menu>
        </Col>
      </Row>
    </Header> */}
    <Header className="header">
    <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
          </div>
        {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className='nav-links' >
          <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/about">About</Link></Menu.Item>
          <Menu.Item key="3"><Link to="/prods">Products</Link></Menu.Item>
          <Menu.Item key="4"><Link to="/price">Price</Link></Menu.Item>
          <Menu.Item key="5"><Link to="/trainers">Trainers</Link></Menu.Item>
          <Menu.Item key="6"><Link to="/login">Login</Link></Menu.Item>
          <Menu.Item key="7"><Link to="/signup">Signup</Link></Menu.Item>
        </Menu> */}
        {access_token ? (
          <>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className='nav-links' >
          <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/about">About</Link></Menu.Item>
          <Menu.Item key="3"><Link to="/prods">Products</Link></Menu.Item>
          <Menu.Item key="4"><Link to="/price">Price</Link></Menu.Item>
          <Menu.Item key="5"><Link to="/trainers">Trainers</Link></Menu.Item>
          <Menu.Item key="6">
          <Dropdown overlay={menu}>
            <span style={{ cursor: 'pointer' }}>
              {userData.name} <DownOutlined />
            </span>
          </Dropdown>
          </Menu.Item>
          <Menu.Item key="8"><Link to="/cart">
            {/* Cart ({cartItems.length}) */}
            Cart ({totalQuantity})
          </Link></Menu.Item>
          </Menu>
          </>
        ) : (
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className='nav-links' >
          <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/about">About</Link></Menu.Item>
          <Menu.Item key="3"><Link to="/prods">Products</Link></Menu.Item>
          <Menu.Item key="4"><Link to="/price">Price</Link></Menu.Item>
          <Menu.Item key="5"><Link to="/trainers">Trainers</Link></Menu.Item>
          <Menu.Item key="6"><Link to="/login">Login</Link></Menu.Item>
          <Menu.Item key="7"><Link to="/signup">Signup</Link></Menu.Item>
        </Menu>
        )}
        {/* <Menu onClick={onClick} selectedKeys={[current]} theme="dark" mode="horizontal" className='nav-links' items={items} /> */}
        <div className="menu-icon" onClick={showDrawer}>
          <MenuOutlined />
        </div>
      </Header>
      <Drawer
        title="Menu"
        placement="right"
        closable={false}
        onClose={closeDrawer}
        open={drawerVisible}
      >
        <Menu onClick={onClick} selectedKeys={[current]} theme="dark" mode="vertical" items={items} />
        {/* <Menu mode="vertical" defaultSelectedKeys={['1']}>
          <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/about">About</Link></Menu.Item>
          <Menu.Item key="3"><Link to="/Price">Price</Link></Menu.Item>
          <Menu.Item key="4"><Link to="/login">Login</Link></Menu.Item>
          <Menu.Item key="5"><Link to="/signup">Signup</Link></Menu.Item>
        </Menu> */}
      </Drawer>
    </>
  );
}

export default Navbar;
