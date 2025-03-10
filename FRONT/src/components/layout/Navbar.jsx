// components/layout/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X } from "lucide-react"; // אייקונים לתפריט

const Navbar = () => {
  const { currentUser, userRole, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* לוגו */}
          <Link to="/" className="text-xl font-bold">
            {userRole === "USER" ? "קריאה לעזרה" : "מערכת לניהול הרשאות"}
          </Link>

          {/* כפתור תפריט לטלפונים */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* תפריט ראשי למסכים גדולים */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  דף הבית
                </Link>
                <Link
                  to="/profile"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  פרופיל
                </Link>
                {userRole === "ROLE_ADMIN" && (
                  <Link
                    to="/admin"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    ניהול
                  </Link>
                )}
                <div className="flex items-center space-x-2 mr-4">
                  <span className="text-sm">
                    שלום, {currentUser?.firstName || "משתמש"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    התנתק
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  התחברות
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  הרשמה
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* תפריט נפתח בטלפונים */}
        {isOpen && (
          <div className="md:hidden absolute top-16 right-0 bg-blue-700 w-full flex flex-col items-center py-4 space-y-2 shadow-lg">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full text-center py-2 hover:bg-blue-800"
                >
                  דף הבית
                </Link>
                <Link
                  to="/profile"
                  className="w-full text-center py-2 hover:bg-blue-800"
                >
                  פרופיל
                </Link>
                {userRole === "ROLE_ADMIN" && (
                  <Link
                    to="/admin"
                    className="w-full text-center py-2 hover:bg-blue-800"
                  >
                    ניהול
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-center py-2 text-sm font-medium"
                >
                  התנתק
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full text-center py-2 hover:bg-blue-800"
                >
                  התחברות
                </Link>
                <Link
                  to="/register"
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 text-center py-2"
                >
                  הרשמה
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
