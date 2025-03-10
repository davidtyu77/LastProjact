// components/layout/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// קומפוננטה לניתוב מוגן - יכולה לבדוק הרשאות תפקיד ספציפי
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  // אם עדיין בטעינה, הצג מסך טעינה
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // אם המשתמש לא מחובר, נווט לדף התחברות
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // אם יש רשימת תפקידים מורשים ותפקיד המשתמש לא נמצא בה
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />; // נווט לדף הבית במקום דף 403
  }

  // אם המשתמש מחובר והרשאות תקינות, הצג את התוכן
  return children;
};

export default ProtectedRoute;
