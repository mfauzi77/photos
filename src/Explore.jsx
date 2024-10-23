import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Explore = () => {
  const [posts, setPosts] = useState([]); // Menyimpan data postingan
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(""); // State untuk error
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal untuk profil pengguna lain
  const [otherUserProfile, setOtherUserProfile] = useState(null); // Data profil pengguna lain
  const [userProfile, setUserProfile] = useState({}); // Profil pengguna saat ini

  // State tambahan untuk pop-up detail post
  const [selectedPost, setSelectedPost] = useState(null); 
  const [postDetails, setPostDetails] = useState([]); // Simpan detail post pengguna
  const navigate = useNavigate(); // Navigasi untuk tombol Explore

  // Mengambil data postingan dari API explore-post dan data profil pengguna saat ini
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await axios.get(
          `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/explore-post?size=10&page=1`,
          {
            headers: {
              "apiKey": "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const userResponse = await axios.get(
          `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/user`,
          {
            headers: {
              "apiKey": "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setPosts(postsResponse.data.data.posts); // Menyimpan data postingan
        setUserProfile(userResponse.data.data); // Menyimpan data profil pengguna
        setLoading(false); // Menghentikan loading
      } catch (error) {
        setError("Failed to fetch explore posts or user profile");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fungsi untuk menampilkan detail post di modal
  const handlePostClick = async (post) => {
    try {
      const response = await axios.get(
        `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/users-post/${post.user.id}?size=100&page=1`,
        {
          headers: {
            "apiKey": "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPostDetails(response.data.data.posts); // Menyimpan detail post
      setSelectedPost(post); // Set post yang dipilih
      setIsModalOpen(true); // Buka modal
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null); // Reset post yang dipilih
  };

  // Navigasi ke halaman explore
  const handleGoToExplore = () => {
    navigate("/explore");
  };

  // Fungsi untuk mengambil profil pengguna lain
  const fetchOtherUserProfile = async (userId) => {
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
      setOtherUserProfile(response.data.data); // Menyimpan data profil pengguna lain
      setIsModalOpen(true); // Membuka modal
    } catch (error) {
      console.error("Error fetching other user profile:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Menampilkan loading
  }

  if (error) {
    return <div>{error}</div>; // Menampilkan error jika ada
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow dark:bg-gray-800">
        <h1 className="text-xl font-bold">Explore</h1>
        <div className="relative ml-6">
          <Link to="/update-profile">
            <button className="flex items-center space-x-2">
              <img
                src={
                  userProfile.profilePictureUrl
                    ? userProfile.profilePictureUrl
                    : "https://via.placeholder.com/50"
                }
                alt="User Profile"
                className="w-10 h-10 border-2 border-white rounded-full"
              />
              <span>{userProfile.username}</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Konten Explore */}
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {posts.length === 0 ? (
          <div className="text-center col-span-full">No posts available.</div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
              onClick={() => handlePostClick(post)} // Buka pop-up detail post
            >
              <div className="flex items-center p-4">
                {/* Gambar Profil Pengguna */}
                <img
                  src={
                    post.user && post.user.profilePictureUrl
                      ? post.user.profilePictureUrl
                      : "https://via.placeholder.com/50"
                  }
                  alt={post.user ? post.user.username : "Unknown"}
                  className="w-10 h-10 rounded-full"
                  onClick={() => fetchOtherUserProfile(post.user.id)} // Menampilkan profil pengguna lain
                />
                <div className="ml-3">
                  {/* Nama Pengguna dengan Link ke Halaman User Posts */}
                  <p className="font-semibold cursor-pointer hover:underline" onClick={() => fetchOtherUserProfile(post.user.id)}>
                    {post.user ? post.user.username : "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Gambar Post */}
              {post.imageUrl && post.imageUrl.trim() !== "" ? (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="object-cover w-full h-64"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-64 bg-gray-200">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              {/* Caption dan Likes */}
              <div className="p-4">
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">{post.caption || "No caption"}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{post.totalLikes} Likes</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Profil Pengguna Lain */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl p-6 bg-white rounded-lg">
            <button
              className="absolute text-gray-500 top-2 right-2 hover:text-gray-800"
              onClick={handleCloseModal}
            >
              ✕
            </button>

            <h2 className="mb-4 text-xl font-bold">Post Details</h2>

            <div className="flex items-center mb-4">
              <img
                src={
                  selectedPost.user.profilePictureUrl ||
                  "https://via.placeholder.com/50"
                }
                alt={selectedPost.user.username}
                className="w-12 h-12 mr-4 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">{selectedPost.user.username}</h3>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => navigate(`/profile/${selectedPost.user.id}`)}
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Tampilkan post details */}
            <div className="mb-4">
              <img
                src={selectedPost.imageUrl || "https://via.placeholder.com/200"}
                alt="Post"
                className="object-cover w-full h-64 mb-2"
              />
              <p>{selectedPost.caption}</p>
              <p>{selectedPost.totalLikes} Likes</p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded"
                onClick={handleGoToExplore}
              >
                Back to Explore
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded"
                onClick={() => navigate(`/profile/${selectedPost.user.id}`)}
              >
                Profile Pengguna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
