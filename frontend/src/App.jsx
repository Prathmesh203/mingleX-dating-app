import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import Feed from "./components/Feed";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Auth from "./components/Auth";
import "./App.css";
import ProfilePage from "./pages/ProfilePage";
import UseAuth from "./hooks/UseUserContext";
import Settings from "./pages/Settings";
const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

function App() {
  const {theme} = UseAuth();
  return (
    <div data-theme={theme}>
      <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Protected routes */}
        <Route element={<Auth />}>
          <Route element={<MainLayout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            <Route path="/settings" element={<Settings />} />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
