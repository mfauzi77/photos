import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams(); // Mengambil userId dari URL
  const [userProfile, setUserProfile] = useState(null); // Data profil pengguna
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(""); // State error
  const navigate = useNavigate(); // Navigasi untuk tombol Explore

  // Mengambil data profil pengguna dari API berdasarkan USER_ID
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/user/${userId}`,
          {
            headers: {
              "apiKey": "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserProfile(response.data.data); // Menyimpan data profil pengguna
        setLoading(false); // Menghentikan loading
      } catch (error) {
        setError("Failed to fetch user profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Fungsi untuk kembali ke halaman Explore
  const handleGoToExplore = () => {
    navigate("/explore");
  };

  if (loading) {
    return <div>Loading...</div>; // Menampilkan loading
  }

  if (error) {
    return <div>{error}</div>; // Menampilkan error jika ada
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow dark:bg-gray-800">
        <h1 className="text-xl font-bold">User Profile</h1>
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded"
          onClick={handleGoToExplore}
        >
          Back to Explore
        </button>
      </div>

      {/* Konten Profil Pengguna */}
      {userProfile ? (
        <div className="max-w-2xl p-6 mx-auto mt-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          {/* Gambar Profil */}
          <div className="flex justify-center mb-4">
            <img
              src={
                userProfile.profilePictureUrl
                  ? userProfile.profilePictureUrl
                  : "https://via.placeholder.com/150"
              }
              alt={userProfile.username}
              className="w-24 h-24 rounded-full"
            />
          </div>

          {/* Informasi Pengguna */}
          <h2 className="mb-4 text-2xl font-bold text-center">{userProfile.name}</h2>
          <p className="mb-2 text-center text-gray-500">@{userProfile.username}</p>
          <p className="mb-4 text-center text-gray-500">{userProfile.email}</p>

          {/* Bio */}
          {userProfile.bio && (
            <p className="mb-4 text-center text-gray-700 dark:text-gray-300">{userProfile.bio}</p>
          )}

          {/* Website */}
          {userProfile.website && (
            <p className="mb-4 text-center text-blue-500">
              <a
                href={userProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {userProfile.website}
              </a>
            </p>
          )}

          {/* Pengikut dan Mengikuti */}
          <div className="flex justify-around mt-4">
            <div className="text-center">
              <span className="text-lg font-bold">{userProfile.totalFollowers}</span>
              <p className="text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold">{userProfile.totalFollowing}</span>
              <p className="text-gray-500">Following</p>
            </div>
          </div>

          {/* Tombol Edit Profil (Jika user melihat profilnya sendiri) */}
          {localStorage.getItem("userId") === userId && (
            <div className="flex justify-center mt-6">
              <Link to="/update-profile">
                <button className="px-4 py-2 text-white bg-blue-500 rounded">
                  Edit Profile
                </button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div>User profile not found.</div>
      )}
    </div>
  );
};

export default UserProfile;
