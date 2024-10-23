import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const navigate = useNavigate(); // Gunakan useNavigate sebagai pengganti useHistory
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: '',
    profilePictureUrl: '',
    phoneNumber: '',
    bio: '',
    website: ''
  });

  // Fetch profile data saat komponen di-mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/user`,
          {
            headers: {
              'apiKey': 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setProfile(response.data.data); // Set data profil
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, []);

  // Handle perubahan input form
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // Handle submit form untuk update profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/update-profile`,
        profile,
        {
          headers: {
            'apiKey': 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Profile updated successfully');
      navigate('/explore'); // Mengganti history.push dengan navigate
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="max-w-md p-4 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Profile Picture URL</label>
          <input
            type="text"
            name="profilePictureUrl"
            value={profile.profilePictureUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Website</label>
          <input
            type="text"
            name="website"
            value={profile.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-blue-500 rounded"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
