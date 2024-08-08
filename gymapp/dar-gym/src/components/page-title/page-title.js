import React, {useState} from 'react';
import { Layout, Row, Col, Card, Carousel, Button, Typography, Menu } from 'antd';
import './pagetitle.css'; 
import location from '../../assets/location.jpg';


const {Title, Paragraph} = Typography;


const PageTitle = ({title, imageUrl}) => {
  return (
        
        <div className="custom-title">
            <div className="title-image-container">
        <img src={imageUrl} alt="Title Icon" className="title-icon" />
        <div class="twelve title-text" >
          <Title level={3}>{title}</Title> 
        </div>
      </div>

      </div>
  );
};

export default PageTitle;
