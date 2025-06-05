import React, { useState, useEffect } from "react";
import { Music, Upload, User, Database } from "lucide-react";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPanel from "./components/AdminPanel";
import MusicPlayer from "./components/MusicPlayer";
import img from "./components/deepu profile.jpeg";
import Logo from "./components/logo1.svg";

import { Analytics } from "@vercel/analytics/react";

// Define the backend URL as a constant
const BACKEND_URL = "https://sdp-ejbl.onrender.com"; // Replace with your deployed backend URL

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState("login");
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    message: string;
  }>({
    connected: false,
    message: "Checking database connection...",
  });

  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/health`);
        const data = await response.json();
        setDbStatus({
          connected: true,
          message: "Connected to MongoDB Atlas",
        });
      } catch (err) {
        setDbStatus({
          connected: false,
          message: "Database connection failed",
        });
      }
    };

    checkDbConnection();
    const interval = setInterval(checkDbConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (newToken: string, admin: boolean) => {
    setToken(newToken);
    setIsAdmin(admin);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
    setView("login");
  };

  const renderDbStatus = () => (
    <div
      className={`fixed bottom-4 right-4 flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg ${
        dbStatus.connected
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      <Database
        className={`w-4 h-4 ${
          dbStatus.connected ? "text-green-600" : "text-red-600"
        }`}
      />
      <span className="text-sm font-medium hidden">{dbStatus.message}</span>
    </div>
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-rose-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {view === "login" ? (
            <>
              <Login onLogin={handleLogin} backendUrl={BACKEND_URL} />
              <button
                onClick={() => setView("register")}
                className="mt-4 text-rose-600 hover:text-rose-800 font-medium block mx-auto"
              >
                Need an account? Register
              </button>
            </>
          ) : (
            <>
              <Register onRegister={handleLogin} backendUrl={BACKEND_URL} />
              <button
                onClick={() => setView("login")}
                className="mt-4 text-rose-600 hover:text-rose-800 font-medium block mx-auto"
              >
                Already have an account? Login
              </button>
            </>
          )}
        </div>
        {renderDbStatus()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      <nav className="bg-white/80 backdrop-blur-md shadow-md p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-transparent bg-clip-text">
              SD Player
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <button
                onClick={() => setView("admin")}
                className="flex items-center space-x-1 text-rose-600 hover:text-rose-800 transition-colors duration-200"
              >
                <Upload className="w-5 h-5" />
                <span>Admin Panel</span>
              </button>
            )}
            <button
              onClick={() => setView("player")}
              className="flex items-center space-x-1 text-rose-600 hover:text-rose-800 transition-colors duration-200"
            >
              <Music className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-rose-600 hover:text-rose-800 transition-colors duration-200"
            >
              <User className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        {view === "admin" && isAdmin ? (
          <AdminPanel token={token} backendUrl={BACKEND_URL} />
        ) : (
          <MusicPlayer token={token} backendUrl={BACKEND_URL} />
        )}
      </main>
      {renderDbStatus()}
      <footer
        className="text-center py-2 shadow-md"
        style={{ backgroundColor: "white", color: "#dc2674" }}
      >
        Built with ❤️ by
        <img
          src={img}
          alt="Avatar"
          className="inline-block w-6 h-6 rounded-full mx-2"
        />
        S Pranav (Deepu)
      </footer>
      <Analytics />
    </div>
  );
}

export default App;
