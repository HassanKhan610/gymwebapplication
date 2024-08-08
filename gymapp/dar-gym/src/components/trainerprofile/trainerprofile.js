// TrainerProfile.js

import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Card, Avatar, Typography, Row, Col } from 'antd';
import Navbar from '../navbar/Navbar';
import FooterComp from '../footer/footer';
import { useGetTrainersQuery } from '../../services/userAuthApi'; // Import the trainers API
import { trainersLoading, trainersReceived, trainersError } from '../../features/trainerSlice'; // Import the trainers slice
import { useDispatch, useSelector } from 'react-redux';

const { Content } = Layout;
const { Meta } = Card;
const { Title, Paragraph } = Typography;

const TrainerProfile = () => {
  // Get the trainer's ID from the URL
  // const { id } = useParams();

  // // Find the trainer object based on the ID
  // const trainer = trainers.find((t) => t.id === parseInt(id));

  // if (!trainer) {
  //   return <div>Trainer not found</div>;
  // }
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetTrainersQuery();
  console.log(id);

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
  const trainer = trainers.find((trainer) => trainer.id === parseInt(id));
  if (isLoading) {
    return <div>Loading trainers...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <Layout>
      <Navbar />
      <Content style={{ padding: '20px' }}>
        <Row key={trainer.id} gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <img alt={trainer.name} src={trainer.image} style={{ maxWidth: '100%' }} />
          </Col>
          <Col xs={24} md={12}>
            <div>
              <Title level={3}>{trainer.experience}</Title>
              <Paragraph>Specialization: {trainer.speciality}</Paragraph>
              <Paragraph>{trainer.user_name}</Paragraph>
            </div>
          </Col>
        </Row>

      </Content>
      <FooterComp />
    </Layout>
  );
};

export default TrainerProfile;
