import React, {useState} from 'react';
import { Layout, Row, Col, Card, Carousel, Button, Typography, Menu } from 'antd';
import './locations.css'; 
import location from '../../assets/location.jpg';


const {Title, Paragraph} = Typography;
const locationsData = [
    {
      name: 'New York City',
      description: 'The city that never sleeps.',
      imageUrl: location,
      mapLink: "https://www.google.com/maps/place/Dar's+Fitness+Arena/@33.5692938,73.1004244,17z/data=!3m1!4b1!4m10!1m2!2m1!1sdar+gym!3m6!1s0x38dfed66e61096cf:0x67c1a774fe0376a8!8m2!3d33.5692894!4d73.1052953!15sCgdkYXIgZ3ltkgEDZ3lt4AEA!16s%2Fg%2F11q98dr3k3?entry=ttu",
    },
    {
      name: 'San Francisco',
      description: 'The tech hub of the world.',
      imageUrl: location,
      mapLink: 'https://www.google.com/maps/place/San+Francisco',
    },
    {
      name: 'Paris',
      description: 'The city of love and lights.',
      imageUrl: location,
      mapLink: 'https://www.google.com/maps/place/Paris',
    },
  ];

const Locations = () => {
  return (
      <div className="locations-section">
      <h2>Explore Our Locations</h2>
      <Row justify="space-evenly" >
        {locationsData.map((location, index) => (
          <Col xs={24} sm={7} md={7} lg={7}  key={index}>
                <div className="location-card-cover">
                  <img alt={location.name} src={location.imageUrl} />
                  <div className="location-card-text">
                    <h3>{location.name}</h3>
                    <p>{location.description}</p>
                    <Button
                      type="primary"
                      onClick={() => window.open(location.mapLink, '_blank')}
                    >
                      View on Google Maps
                    </Button>
                  </div>
                </div>
          </Col>
        ))}
      </Row>
    </div>

  );
};

export default Locations;
