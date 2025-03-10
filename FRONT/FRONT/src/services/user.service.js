// services/user.service.js
import { get, put, del, patch } from "./api";
import { getUserRole } from "../utils/tokenUtils";

export const userService = {
  // קבלת פרופיל המשתמש הנוכחי
  getUserProfile: async () => {
    try {
      const role = getUserRole();

      if (role === "ROLE_ADMIN" || role === "ADMIN") {
        return await get("/admin/me");
      } else if (role === "ROLE_FRIEND" || role === "FRIEND") {
        return await get("/friends/me");
      } else {
        return await get("/users/me");
      }
    } catch (error) {
      console.error("Get user profile error:", error);
      throw error;
    }
  },

  // עדכון פרטי משתמש
  updateUser: async (userId, userData) => {
    try {
      // if (!userData.password && userData.currentPassword) {
      //   userData.password = userData.currentPassword;
      // }
      if (!userData.password && userData.currentPassword) {
        delete userData.currentPassword; // לא לשלוח את currentPassword למערכת
      }
      const role = getUserRole();

      if (role === "ROLE_ADMIN" || role === "ADMIN") {
        return await put(`/admin/users/${userId}`, userData);
      } else if (role === "ROLE_FRIEND" || role === "FRIEND") {
        return await put(`/friends/${userId}`, userData);
      } else {
        return await put(`/users/${userId}`, userData);
      }
    } catch (error) {
      console.error(`Update user ${userId} error:`, error);
      throw error;
    }
  },

  // מחיקת משתמש
  deleteUser: async (userId) => {
    try {
      const role = getUserRole();

      if (role === "ROLE_ADMIN" || role === "ADMIN") {
        return await del(`/admin/users/${userId}`);
      } else {
        return await del(`/users/${userId}`);
      }
    } catch (error) {
      console.error(`Delete user ${userId} error:`, error);
      throw error;
    }
  },

  // קבלת כל המשתמשים (למנהל בלבד)
  getAllUsers: async () => {
    try {
      return await get("/admin/users");
    } catch (error) {
      console.error("Get all users error:", error);
      throw error;
    }
  },

  // קבלת משתמש לפי מזהה
  getUserById: async (userId) => {
    try {
      const role = getUserRole();

      if (role === "ROLE_ADMIN" || role === "ADMIN") {
        return await get(`/admin/users/${userId}`);
      } else {
        return await get(`/users/${userId}`);
      }
    } catch (error) {
      console.error(`Get user ${userId} error:`, error);
      throw error;
    }
  },
};

export default userService;
