// import React from 'react';
// import { Row, Col, Image } from 'antd';
// import { Link } from 'react-router-dom';
// import dumbellImg from '../../assets/dumbell.jpg';
// import './trainer-home-page.css';

// function TrainerHomePage() {
//   return (
//     <Link to="/trainers" className="full-section">
//       <Row gutter={[16, 16]} justify="center">
//         <Col xs={24} sm={24} md={12} lg={6} className="image-container"  >
//           <img src={dumbellImg} alt="Trainer 1" className="tilted-blur-image" />
//         </Col>
//         <Col xs={0} sm={0} md={12} lg={6} className="image-container">
//           <img src={dumbellImg} alt="Trainer 2" className="tilted-blur-image" />
//         </Col>
//         <Col xs={0} sm={0} md={12} lg={6} className="image-container">
//           <img src={dumbellImg} alt="Trainer 3" className="tilted-blur-image" />
//         </Col>
//         <Col xs={0} sm={0} md={12} lg={6} className="image-container">
//           <img src={dumbellImg} alt="Trainer 4" className="tilted-blur-image" />
//         </Col>
//       </Row>
//       <div className="centered-text">Trainers</div>
//     </Link>
//   );
// }

// export default TrainerHomePage;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import './trainer-home-page.css';
import { useGetTrainersQuery } from '../../services/userAuthApi';
import { trainersLoading, trainersReceived, trainersError } from '../../features/trainerSlice';
import { useDispatch, useSelector } from 'react-redux';

function TrainerHomePage() {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetTrainersQuery();

  useEffect(() => {
    if (isLoading) {
      dispatch(trainersLoading());
    } else if (data) {
      dispatch(trainersReceived(data));
    } else if (error) {
      dispatch(trainersError(error));
    }
  }, [data, error, isLoading, dispatch]);

  const trainers = useSelector((state) => state.trainers.trainers);

  if (isLoading) {
    return <div>Loading trainers...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Link to="/trainers" className="full-section">
      <Row gutter={[16, 16]} justify="center">
        {trainers.slice(0, 4).map((trainer, index) => (
          <Col key={index} xs={24} sm={24} md={12} lg={6} className="image-container"  >
            <img src={trainer.image} alt="Trainer 1" className="tilted-blur-image" />
          </Col>
        ))}
      </Row>
      <div className="centered-text">Trainers</div>
    </Link>
  );
}

export default TrainerHomePage;
