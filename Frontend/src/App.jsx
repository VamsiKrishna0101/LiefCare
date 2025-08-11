import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/Authcontext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ManagerHome from "./pages/ManagerHome";
import ManagerDashboard from "./components/ManagerDashboard";
import WorkerHome from "./pages/WorkerHome";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import RegisterFace from "./components/RegisterFace";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerface" element={<RegisterFace/>}/>

          <Route
            path="/manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/worker"
            element={
              <ProtectedRoute role="worker">
                <WorkerHome />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
