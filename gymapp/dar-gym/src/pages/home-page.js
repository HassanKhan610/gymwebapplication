import React, {useState} from 'react';
import { Layout, Row, Col, Card, Carousel, Button, Typography, Menu } from 'antd';
import {
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    LinkedinOutlined,
  } from '@ant-design/icons';
import aboutImg from '../assets/fit.jpg';
import Navbar from '../components/navbar/Navbar';
import dumbellImg from '../assets/dumbell.jpg';
import ResponsiveSlider from '../components/carousel/ResponsiveSlider';
import Slides from '../components/carousel/ImageSlidesJSON';
import About from '../components/about/About';
import Products from '../components/products/products';
import TrainerHomePage from '../components/trainerhome/trainer-home-pg';
import Subscription from '../components/subscription/subscription';
import FooterComp from '../components/footer/footer';

const { Header, Content, Footer } = Layout;
const {Title, Paragraph} = Typography;
const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
const HomePage = () => {

    
    
  return (
    <Layout>
        {/* <Navbar /> */}
        <ResponsiveSlider slides={Slides} />
        <About />
        <Products />
        <TrainerHomePage />
        <Subscription />
        <FooterComp />
    </Layout>
  );
};

export default HomePage;
