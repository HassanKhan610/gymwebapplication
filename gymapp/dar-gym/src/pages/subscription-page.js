import React, {useState} from 'react';
import { Layout, Row, Col, Card, Carousel, Button, Typography, Menu } from 'antd';
import Navbar from '../components/navbar/Navbar';
import FooterComp from '../components/footer/footer';
import PageTitle from '../components/page-title/page-title';
import aboutImg from '../assets/fit.jpg';
import productData from '../components/products/productJSON';

const SubscriptionPage = () => {
  return (
    <Layout>
        {/* <Navbar /> */}
        <PageTitle title="Our Pricings" imageUrl={aboutImg} />
        
        <FooterComp />
    </Layout>
  );
};

export default SubscriptionPage;
