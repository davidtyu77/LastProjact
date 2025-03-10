// services/auth.service.js
import { post, get } from "./api";
import {
  saveToken,
  removeToken,
  getUserRole,
  decodeToken,
} from "../utils/tokenUtils";

export const authService = {
  // התחברות - שליחת בקשת התחברות לשרת
  login: async (email, password) => {
    try {
      const response = await post("/auth/login", { email, password });

      if (response && response.token) {
        // שמירת הטוקן בלוקל סטורג'
        saveToken(response.token);

        // לוג התוכן של הטוקן - חשוב לדיבוג
        console.log("Token payload:", decodeToken());

        return response;
      }

      throw new Error("אימות נכשל - לא התקבל טוקן");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // הרשמה - יצירת משתמש חדש
  register: async (userData) => {
    try {
      return await post("/auth/register", userData);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // התנתקות - מחיקת הטוקן מהלוקל סטורג'
  logout: () => {
    removeToken();
  },

  // קבלת פרטי המשתמש המחובר
  getCurrentUser: async () => {
    try {
      const role = getUserRole();
      console.log("Current role from token:", role);

      // תיקון נתיבים - שים לב לשימוש ב-friends עם 's' בסוף עבור ROLE_FRIEND
      try {
        return await get("/auth/me");
      } catch (error) {
        console.log(
          "Failed to get user from /auth/me, trying role-specific endpoint"
        );

        if (role === "ROLE_ADMIN" || role === "ADMIN") {
          return await get("/admin/me");
        } else if (role === "ROLE_FRIEND" || role === "FRIEND") {
          // תיקון הנתיב ל-friends עם 's'
          return await get("/friends/me");
        } else {
          return await get("/users/me");
        }
      }
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  // בדיקה אם המשתמש מחובר דרך ה-API
  validateToken: async () => {
    try {
      // נסה קודם את הנתיב הכללי
      try {
        await get("/auth/me");
        return true;
      } catch (authMeError) {
        // אם נכשל, לא נמחק את הטוקן מיד, נבדוק עם נתיבים אחרים
        console.warn("Auth/me endpoint failed, trying role-specific endpoint");

        const role = getUserRole();
        if (role === "ROLE_ADMIN" || role === "ADMIN") {
          await get("/admin/me");
        } else if (role === "ROLE_FRIEND" || role === "FRIEND") {
          // תיקון הנתיב ל-friends עם 's'
          await get("/friends/me");
        } else {
          await get("/users/me");
        }
        return true;
      }
    } catch (error) {
      console.error("Token validation error:", error);
      removeToken(); // מחיקת טוקן לא תקין
      return false;
    }
  },

  // עדכון פרופיל משתמש
  updateUserProfile: async (userId, userData) => {
    try {
      const role = getUserRole();

      if (role === "ROLE_FRIEND" || role === "FRIEND") {
        // תיקון הנתיב ל-friends עם 's'
        return await put(`/friends/${userId}`, userData);
      } else if (role === "ROLE_ADMIN" || role === "ADMIN") {
        return await put(`/admin/users/${userId}`, userData);
      } else {
        return await put(`/users/${userId}`, userData);
      }
    } catch (error) {
      console.error("Update user profile error:", error);
      throw error;
    }
  },
};

export default authService;
