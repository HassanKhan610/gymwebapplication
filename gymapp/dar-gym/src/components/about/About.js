import React from 'react';
import { Row, Col, Typography, Image } from 'antd';
import aboutImg from '../../assets/fit.jpg';
import './about.css';

const {Title, Paragraph} = Typography;
function About() {
  return (
    <Row justify="space-evenly" style={{margin: '40px 0px'}}>
        <Col xs={24} sm={24} md={11} lg={11} >
            <Image src={aboutImg} alt='aboutimage' style={{ maxWidth: '100%', height: 'auto' }} />
        </Col>
        <Col xs={24} sm={24} md={11} lg={11} >
            <div className ="seven">
            <Title level={2}>SAILORS's</Title>
            </div>
            <div className="twelve">
            <Title level={3}>About Us</Title>

            </div>
            <Paragraph>We believe fitness should be accessible to everyone, everywhere, regardless of age or fitness level. We provide a supportive, inclusive and uplifting community that empowers all women to achieve their health and fitness goals.b

            We understand our role in this community. Each day, we have the unique opportunity to impact someone’s health and performance. We are grateful to walk this fitness journey with you Fitter is an amazing digital platform for Professionals, Centers, and Models. It provides the best social platform for people in the fitness and health industries.

            It helps Pros, Models and Centers to advertise them in platform of over 1 Million Users. Socially interact with like minded people. Also helping users to find for such talents in their nearby localities. No need to hustle around, just browse through our platform and find the best trainer, model or center in your locality very easily.</Paragraph>
        </Col>
    </Row>
  );
}

export default About;
