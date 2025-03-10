// contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/auth.service";
import {
  hasToken,
  getUserRole,
  isTokenExpired,
  removeToken,
  debugTokenInfo,
} from "../utils/tokenUtils";

// יצירת קונטקסט לניהול מצב האימות
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // בדיקת אימות בטעינה ראשונית
  useEffect(() => {
    const initAuth = async () => {
      if (hasToken() && !isTokenExpired()) {
        try {
          // הדפסת מידע הטוקן לצורך דיבוג
          console.log("Initializing auth with token");
          debugTokenInfo();

          // קבלת תפקיד מהטוקן
          const role = getUserRole();
          console.log("Role from token:", role);

          // בדיקת תוקף הטוקן מול השרת
          const isValid = await authService.validateToken();

          if (isValid) {
            try {
              // קבלת פרטי המשתמש הנוכחי
              const user = await authService.getCurrentUser();
              setCurrentUser(user);
              // עדכון התפקיד - משתמש בתפקיד מהתגובה אם קיים, אחרת מהטוקן
              const roleFromResponse =
                user?.role?.roleName || user?.roleName || role;
              setUserRole(roleFromResponse);
              console.log("User authenticated with role:", roleFromResponse);
            } catch (userError) {
              console.error(
                "Failed to get user details but token is valid:",
                userError
              );
              // נשתמש בתפקיד מהטוקן אם פרטי המשתמש לא זמינים
              setUserRole(role);
            }
          } else {
            // אם הטוקן לא תקין, נקה את המצב
            console.warn("Token validation failed");
            setCurrentUser(null);
            setUserRole(null);
            removeToken();
          }
        } catch (err) {
          console.error("Auth initialization error:", err);
          setError("שגיאה באימות המשתמש");
          setCurrentUser(null);
          setUserRole(null);
          removeToken();
        }
      } else if (isTokenExpired()) {
        // אם הטוקן פג תוקף, מחק אותו
        console.warn("Token is expired, removing");
        removeToken();
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // פונקציית התחברות
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);

      if (response && response.token) {
        console.log("Login successful, token received");
        // הדפסת מידע הטוקן לצורך דיבוג
        debugTokenInfo();

        // קבלת התפקיד מהתגובה או מהטוקן
        const role = response.role || getUserRole();
        console.log("Role after login:", role);

        try {
          // קבלת פרטי המשתמש הנוכחי
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
          // עדכון התפקיד - משתמש בתפקיד מהתגובה אם קיים, אחרת מהטוקן
          const roleFromResponse =
            user?.role?.roleName || user?.roleName || role;
          setUserRole(roleFromResponse);
          console.log("User role set to:", roleFromResponse);
        } catch (userError) {
          console.error(
            "Failed to get user details but login successful:",
            userError
          );
          // משתמש בתפקיד מהתגובת התחברות אם פרטי המשתמש לא זמינים
          setUserRole(role);
          setCurrentUser({ id: response.id, email: response.email });
        }

        return true;
      }

      return false;
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "שגיאה בהתחברות");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // פונקציית התנתקות
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setUserRole(null);
  };

  // פונקציית הרשמה
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      await authService.register(userData);
      return true;
    } catch (err) {
      setError(err.message || "שגיאה בהרשמה");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ערך הקונטקסט שיהיה זמין לקומפוננטות
  const value = {
    currentUser,
    userRole,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser,
    isAdmin: userRole === "ROLE_ADMIN" || userRole === "ADMIN",
    isFriend: userRole === "ROLE_FRIEND" || userRole === "FRIEND",
    isUser: userRole === "ROLE_USER" || userRole === "USER",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// הוק שימושי לגישה לקונטקסט
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
