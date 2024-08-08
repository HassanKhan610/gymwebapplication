import React from 'react';
import { Row, Col, Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
import {
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    LinkedinOutlined,
  } from '@ant-design/icons';
import './footer.css';


const { Header, Content, Footer } = Layout;


function FooterComp() {
  return (
    <Footer className="gym-footer">
      <Row gutter={[16, 16]} justify="space-around">
        <Col xs={24} sm={12} md={6}>
          <h3>The Sailor's Gym</h3>
          <p>Azeem Plaza, Opp Mian Electronics Bostan Khan Road, Chaklala Scheme III, Rawalpindi </p>
          <p>Rawalpindi, Pakistan</p>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <h3>Quick Links</h3>
          <Menu className='footer-menu' mode="vertical">
            <Menu.Item className='footer-menu-item' key="1"><Link to='/'>Home</Link></Menu.Item>
            <Menu.Item className='footer-menu-item' key="2"><Link to='/about'>About Us</Link></Menu.Item>
            <Menu.Item className='footer-menu-item' key="3"><Link to='/price'>Price</Link></Menu.Item>
            <Menu.Item className='footer-menu-item' key="4"><Link to='/prods'>Products</Link></Menu.Item>
            <Menu.Item className='footer-menu-item' key="5"><Link to='/trainers'>Trainers</Link></Menu.Item>
          </Menu>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <h3>Connect with Us</h3>
          <div className="social-icons">
            <a href="#">
              <FacebookOutlined className="social-icon" />
            </a>
            <a href="#">
              <TwitterOutlined className="social-icon" />
            </a>
            <a href="#">
              <InstagramOutlined className="social-icon" />
            </a>
            <a href="#">
              <LinkedinOutlined className="social-icon" />
            </a>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <h3>Contact Us</h3>
          <p>Email: contact@gymwebsite.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </Col>
      </Row>
    </Footer>
  );
}

export default FooterComp;
