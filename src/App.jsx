import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";  // Import komponen login
import Register from "./Register";  // Import komponen register
import Explore from "./Explore"; // Import komponen Explore
import UserPosts from "./UserPosts";
import PostDetail from './PostDetail'; // Komponen PostDetail yang kita buat
import UpdateProfile from "./UpdateProfile";
import UserProfile from "./UserProfile";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<Explore />} />  {/* Route Explore */}
          <Route path="/" element={<Login />} />
          <Route path="/user-posts/:userId" component={UserPosts} /> {/* Routing untuk UserPosts */}
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/profile/:userId" element={<UserProfile />} /> {/* Rute untuk profil pengguna */}


        </Routes>
      </div>
    </Router>
  );
}

export default App;
