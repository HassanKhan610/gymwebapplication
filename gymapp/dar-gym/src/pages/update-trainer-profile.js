// src/components/TrainerProfileForm.js

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateTrainerProfileMutation, useGetTrainersQuery, useUpdateTrainerProfileMutation } from '../services/userAuthApi';
import { trainersLoading, trainersReceived, trainersError } from '../features/trainerSlice'; // Import the trainers slice
import { useParams } from 'react-router-dom';
import '../components/trainerhome/trainer-home-page.css'

function TrainerProfileForm() {
  const { access_token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ experience: '', speciality: '', image: null });
  const [createTrainerProfile] = useCreateTrainerProfileMutation();
  const [updateTrainerProfile] = useUpdateTrainerProfileMutation(); // Add the update mutation


  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetTrainersQuery(id);
  

  useEffect(() => {
    if (isLoading) {
      dispatch(trainersLoading());
    } else if (data) {
      dispatch(trainersReceived(data));
    } else if (error) {
      dispatch(trainersError(error));
    }
  }, [data, error, isLoading, dispatch]);

  const currentTrainer = useSelector((state) => state.trainers.trainers.find((trainer) => trainer.user_id === parseInt(id))) ;

  //   const trainer = useSelector((state) => state.trainers.trainers);
//   const trainers = useSelector((state) => state.trainers.trainers);
//   const trainer = trainers.find((trainer) => trainer.id === parseInt(id));
console.log(currentTrainer)
  useEffect(() => {
    if (currentTrainer) {
      setFormData({
        experience: currentTrainer.experience || '',
        speciality: currentTrainer.speciality || '',
        image: currentTrainer.image || null,
      });
    }
    else {
        // Reset the form data to empty when there is no existing trainer data
        setFormData({ experience: '', speciality: '', image: null });
      }
  }, [currentTrainer]);
  console.log(currentTrainer)
  
  // const handleInputChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  if (isLoading) {
    return <div>Loading trainers...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const isUpdate = !!currentTrainer;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
        formDataToSend.append('experience', formData.experience);
        formDataToSend.append('speciality', formData.speciality);
        formDataToSend.append('image', formData.image); 
            console.log([...formDataToSend.entries()]);


            const headers = {
              'Content-Type': 'multipart/form-data; boundary=2', 
          };
        if (isUpdate) {
          // If a trainer profile already exists, it's an update operation
          await updateTrainerProfile({
            trainerId: id,
            actualData: formDataToSend,
            access_token,
            headers,
          });
          alert('Trainer profile updated successfully!');
        } else {
          // If no trainer profile exists, it's a create operation
          await createTrainerProfile({
            actualData: formDataToSend,
            access_token,
            headers,
          });
          alert('Trainer profile created successfully!');
        }
      } catch (error) {
        alert('Error creating/updating trainer profile');
        console.error(error);
      }
  };

  return (
    <div className="trainer-profile-form-container" key={id}>
        
            <h2 className="form-title">{isUpdate ? 'Update' : 'Create'} Trainer Profile</h2>
      <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Experience:</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Speciality:</label>
          <input
            type="text"
            name="speciality"
            value={formData.speciality}
            onChange={handleInputChange}
          />
        </div>
        <div>
                <label>Profile Picture:</label>
                <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                />
            </div>
            {currentTrainer && currentTrainer.image && (
          <div>
            <label>Current Profile Picture:</label>
            <img src={currentTrainer.image} alt="Profile" style={{ maxWidth: '200px' }} />
          </div>
        )}
        <button type="submit">{isUpdate ? 'Update Profile' : 'Create Profile'}</button>
      </form>
           
      
    </div>
  );
}

export default TrainerProfileForm;


