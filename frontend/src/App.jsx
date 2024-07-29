import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFound } from "./pages/NotFound.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Home } from "./pages/Home.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Post } from "./pages/Post.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute redirect="/login" />}>
          <Route path="/" element={<Home />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="/post/:tweetId" element={<Post />} />{" "}
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
