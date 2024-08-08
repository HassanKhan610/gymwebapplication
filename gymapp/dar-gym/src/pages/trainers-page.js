
import React, {useState, useEffect} from 'react';
import { Layout, Row, Col, Card, Carousel, Button, Typography, Avatar } from 'antd';
import {Link, useParams} from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import FooterComp from '../components/footer/footer';
import PageTitle from '../components/page-title/page-title';
import aboutImg from '../assets/fit.jpg';
import productData from '../components/products/productJSON';
import Subscription from '../components/subscription/subscription';
import TrainerHomePage from '../components/trainerhome/trainer-home-pg';
import trainers from '../components/trainerprofile/trainerJSON';
import image6 from '../assets/image6.jpg';


import { useGetTrainersQuery } from '../services/userAuthApi'; // Import the trainers API
import { trainersLoading, trainersReceived, trainersError } from '../features/trainerSlice'; // Import the trainers slice
import { useDispatch, useSelector } from 'react-redux';


const { Meta } = Card;


const TrainersPage = () => {
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
    <Layout>
        {/* <Navbar /> */}
        <PageTitle title="Our Trainers" imageUrl={image6} />
        {/* <TrainerHomePage /> */}
        <div style={{ padding: '20px' }}>
      <h1>Meet Our Trainers</h1>
      <Row gutter={[16, 16]}>
        {trainers.map((trainer) => (
          <Col key={trainer.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              cover={<img alt={trainer.name} src={trainer.image} />}
              actions={[
                <Link to={`/trainers/${trainer.id}`}>View Profile</Link>,
              ]}
            >
              <Meta
                avatar={<Avatar src={trainer.image} />}
                title={trainer.name}
                description={trainer.specialization}
              />
              <p>{trainer.user_name}</p>
              <p>{trainer.description}</p>
              <p>{trainer.email}</p>
              <p>{trainer.experience}</p>
              <p>{trainer.speciality}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
        <FooterComp />
    </Layout>
  );
};

export default TrainersPage;
