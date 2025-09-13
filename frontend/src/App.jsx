import { Routes, Route, Navigate } from "react-router-dom";

import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from"./pages/ProfilePage";
import { ChatPage } from "./pages/ChatPage";
import { NotificationsPage } from "./pages/NotificationPage";
import { Navigation } from "./pages/Navigation";
import { useAuth } from "./context/authContext";
import ProtectedRoute from "./ProtectedRoutes";

export default function App() {
  const { isAuthenticated, login, logout } = useAuth();

  // Mock data for badges
  const unreadMessages = 2;
  const unreadNotifications = 3;

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <Navigation
          activeTab={"home"} // Navigation handles its own tabs
          onTabChange={(tab) => {}}
          onLogout={logout}
          unreadMessages={unreadMessages}
          unreadNotifications={unreadNotifications}
        />
      )}

      <div className="pt-20 pb-20 md:pt-24 md:pb-8">
        <Routes>
          {/* Public Route */}
          <Route path="/auth" element={<AuthPage onLogin={login} />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/home" : "/auth"} />}
          />
        </Routes>
      </div>
    </div>
  );
}
