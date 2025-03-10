// components/dashboard/Dashboard.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import UserDashboard from "./UserDashboard";
import FriendDashboard from "./FriendDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const { userRole, loading } = useAuth();

  // אם עדיין בטעינה, הצג מסך טעינה
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // בחירת דשבורד לפי תפקיד המשתמש
  switch (userRole) {
    case "ROLE_ADMIN":
    case "ADMIN":
      return <AdminDashboard />;
    case "ROLE_FRIEND":
    case "FRIEND":
      return <FriendDashboard />;
    default:
      return <UserDashboard />;
  }
};

export default Dashboard;
