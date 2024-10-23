import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserPosts = () => {
  const { userId } = useParams(); // Mendapatkan userId dari URL
  const [posts, setPosts] = useState([]); // Menyimpan data postingan
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(""); // State untuk error

  // Mengambil data postingan berdasarkan userId dari API
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/users-post/${userId}?size=100&page=1`,
          {
            headers: {
              apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b", // ApiKey
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Token dari localStorage
            },
          }
        );

        setPosts(response.data.data.posts); // Menyimpan data postingan dari respons API
        setLoading(false); // Menghentikan loading
      } catch (error) {
        setError("Failed to fetch user's posts");
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, [userId]); // Refresh jika userId berubah

  // Fungsi untuk melakukan Like atau Unlike post
  const handleLike = async (postId, isLike) => {
    try {
      const url = isLike
        ? `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/unlike`
        : `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/like`;

      const response = await axios.post(
        url,
        { postId },
        {
          headers: {
            apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b", // ApiKey
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Token dari localStorage
          },
        }
      );

      // Update state setelah Like atau Unlike
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLike: !post.isLike,
                totalLikes: post.isLike ? post.totalLikes - 1 : post.totalLikes + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading jika data belum siap
  }

  if (error) {
    return <div>{error}</div>; // Tampilkan pesan error jika terjadi kesalahan
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {posts.length === 0 ? (
        <div className="col-span-full text-center">No posts available.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
              />
              <div className="ml-3">
                {/* Tampilkan nama pengguna */}
                <p className="font-semibold">
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
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}

            {/* Caption dan Likes */}
            <div className="p-4">
              <p className="text-sm text-gray-700 mb-2">{post.caption || "No caption"}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{post.totalLikes} Likes</p>
                <button
                  onClick={() => handleLike(post.id, post.isLike)}
                  className={`text-sm ${post.isLike ? "text-red-500" : "text-blue-500"} hover:underline`}
                >
                  {post.isLike ? "Unlike" : "Like"}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserPosts;
