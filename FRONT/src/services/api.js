// services/api.js
import { getToken } from "../utils/tokenUtils";

const API_URL = "http://localhost:8081/api"; // שנה בהתאם לכתובת השרת שלך

// פונקציית עזר ליצירת בקשות HTTP
export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  console.log("TOKEN USED IN REQUESRT", token);

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  console.log("Final API Request Config:", config);

  try {
    console.log(`API Request: ${options.method || "GET"} ${API_URL}${url}`);
    const response = await fetch(`${API_URL}${url}`, config);

    // לוג תגובת השרת
    console.log(`API Response: ${response.status} ${response.statusText}`);

    // בדיקה אם התגובה היא JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      // אם התגובה לא תקינה, זרוק שגיאה עם פרטי השגיאה
      if (!response.ok) {
        console.error("API Error Response:", data);
        throw {
          status: response.status,
          message: data.message || "שגיאה בשרת",
          data,
        };
      }

      return data;
    } else {
      // אם התגובה אינה JSON, החזר את הטקסט או סטטוס ריק
      if (!response.ok) {
        const text = await response.text();
        console.error("API Error Response (text):", text);
        throw {
          status: response.status,
          message: text || "שגיאה בשרת",
        };
      }

      return await response.text();
    }
  } catch (error) {
    // לוג ופענוח שגיאות רשת או JSON
    console.error("API Error:", error);
    throw error;
  }
};

// חיפוי על פונקציות HTTP מקוצרות
export const get = (url) => fetchWithAuth(url, { method: "GET" });
export const post = (url, data) =>
  fetchWithAuth(url, { method: "POST", body: JSON.stringify(data) });
export const put = (url, data) =>
  fetchWithAuth(url, { method: "PUT", body: JSON.stringify(data) });
export const patch = (url, data) =>
  fetchWithAuth(url, { method: "PATCH", body: JSON.stringify(data) });
export const del = (url) => fetchWithAuth(url, { method: "DELETE" });
