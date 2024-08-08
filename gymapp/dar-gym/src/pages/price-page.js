
import React, {useState} from 'react';
import { Layout, Row, Col, Card, Carousel, Button, Typography, Menu } from 'antd';
import Navbar from '../components/navbar/Navbar';
import FooterComp from '../components/footer/footer';
import PageTitle from '../components/page-title/page-title';
import aboutImg from '../assets/fit.jpg';
import productData from '../components/products/productJSON';
import Subscription from '../components/subscription/subscription';
import image4 from '../assets/image4.jpg';

const PricePage = () => {
  return (
    <Layout>
        {/* <Navbar /> */}
        <PageTitle title="Our Pricings" imageUrl={image4} />
        <Subscription />
        <FooterComp />
        <FooterComp />
    </Layout>
  );
};

export default PricePage;
