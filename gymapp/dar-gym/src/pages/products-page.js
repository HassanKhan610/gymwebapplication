import React, {useState} from 'react';
import { Layout, Row, Col, Card, Carousel, Button, Typography, Menu } from 'antd';
import Navbar from '../components/navbar/Navbar';
import FooterComp from '../components/footer/footer';
import PageTitle from '../components/page-title/page-title';
import aboutImg from '../assets/fit.jpg';
import productData from '../components/products/productJSON';
import Products from '../components/products/products';
import image2 from '../assets/image2.jpg'

const ProductsPage = () => {
  return (
    <Layout>
        {/* <Navbar /> */}
        <PageTitle title="Our Products" imageUrl={image2} />
        <Products />
        <FooterComp />
    </Layout>
  );
};

export default ProductsPage;
