// App.jsx
import React from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// קומפוננטות לייאאוט
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// קומפוננטות אימות
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// קומפוננטות דשבורד
import Dashboard from "./components/dashboard/Dashboard";
import GoogleMapComponent from "./components/dashboard/GoogleMapApi";

// קומפוננטות פרופיל
import UserProfile from "./components/profile/UserProfile";
import AdminUserList from "./components/profile/AdminUserList";
import AdminUserEdit from "./components/profile/AdminUserEdit";

// נתיבים מוגנים לפי תפקיד
const ROLE_ADMIN = ["ROLE_ADMIN", "ADMIN"];
const ROLE_FRIEND = ["ROLE_FRIEND", "ROLE_ADMIN"];
const ROLE_USER = ["ROLE_USER", "ROLE_ADMIN", "ROLE_FRIEND"];

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="py-4">
            <Routes>
              {/* נתיבים ציבוריים */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* דף הבית - מפנה לדשבורד אם מחובר, אחרת להתחברות */}
              <Route path="/" element={<Navigate to="/dashboard" />} />

              {/* דשבורד - מוגן לכל המשתמשים */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div>
                      <Dashboard />
                      {/* <GoogleMapComponent /> */}
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* פרופיל משתמש - מוגן לכל המשתמשים */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              {/* אזור ניהול - למנהלים בלבד */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={ROLE_ADMIN}>
                    <Navigate to="/admin/dashboard" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={ROLE_ADMIN}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={ROLE_ADMIN}>
                    <AdminUserList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users/:userId/edit"
                element={
                  <ProtectedRoute allowedRoles={ROLE_ADMIN}>
                    <AdminUserEdit />
                  </ProtectedRoute>
                }
              />

              {/* נתיב לא נמצא - חזרה לדף הבית */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
