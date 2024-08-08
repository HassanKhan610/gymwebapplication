import React from 'react';
import { Carousel } from 'antd';
import './slider.css';

const ResponsiveSlider = ({ slides }) => {
  return (
    <Carousel autoplay>
      {slides.map((slide, index) => (
        <div className="slide-container" key={index}>
          <div className="slide-image-container">
            <img
              src={slide.imageSrc}
              alt={slide.imageAlt}
              className="slide-image"
            />
            <div className="slide-content">
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default ResponsiveSlider;
