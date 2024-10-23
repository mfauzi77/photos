import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { postId } = useParams(); // Mendapatkan postId dari URL
  const [post, setPost] = useState(null); // Menyimpan data post
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(""); // State untuk error

  // Mengambil data postingan berdasarkan postId dari API
  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const response = await axios.get(
          `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/post/${postId}`,
          {
            headers: {
              apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b", // ApiKey
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Token dari localStorage
            },
          }
        );

        setPost(response.data.data); // Menyimpan data post dari respons API
        setLoading(false); // Menghentikan loading
      } catch (error) {
        setError("Failed to fetch the post details");
        setLoading(false);
      }
    };

    fetchPostById();
  }, [postId]); // Refresh jika postId berubah

  // Fungsi untuk melakukan Like atau Unlike pada post detail
  const handleLike = async () => {
    try {
      const url = post.isLike
        ? `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/unlike`
        : `https://photo-sharing-api-bootcamp.do.dibimbing.id/api/v1/like`;

      const response = await axios.post(
        url,
        { postId: post.id },
        {
          headers: {
            apiKey: "c7b411cc-0e7c-4ad1-aa3f-822b00e7734b", // ApiKey
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Token dari localStorage
          },
        }
      );

      // Update state setelah Like atau Unlike
      setPost((prevPost) => ({
        ...prevPost,
        isLike: !prevPost.isLike,
        totalLikes: prevPost.isLike ? prevPost.totalLikes - 1 : prevPost.totalLikes + 1,
      }));
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

  if (!post) {
    return <div>No post found</div>; // Jika postingan tidak ditemukan
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        {/* Gambar Profil Pengguna */}
        <img
          src={
            post.user && post.user.profilePictureUrl
              ? post.user.profilePictureUrl
              : "https://via.placeholder.com/50"
          }
          alt={post.user ? post.user.username : "Unknown"}
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-4">
          {/* Nama pengguna */}
          <p className="font-semibold">{post.user ? post.user.username : "Unknown"}</p>
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
          className="w-full h-96 object-cover rounded-lg mb-4"
        />
      ) : (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}

      {/* Caption dan Deskripsi */}
      <p className="text-lg text-gray-700 mb-4">{post.caption || "No caption available"}</p>

      {/* Likes dan Tombol Like */}
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{post.totalLikes} Likes</p>
        <button
          onClick={handleLike}
          className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            post.isLike ? "bg-red-500 text-white" : "bg-blue-500 text-white"
          }`}
        >
          {post.isLike ? "Unlike" : "Like"}
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
