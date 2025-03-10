// utils/tokenUtils.js

// שמירת הטוקן ב-localStorage
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// קבלת הטוקן מה-localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// מחיקת הטוקן מה-localStorage
export const removeToken = () => {
  localStorage.removeItem("token");
};

// בדיקה אם יש טוקן שמור
export const hasToken = () => {
  return !!getToken();
};

// פענוח התוכן של ה-JWT (ללא אימות חתימה בצד לקוח)
export const decodeToken = () => {
  try {
    const token = getToken();
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    // לוג התוכן המלא של הטוקן לצורך דיבוג
    const decodedPayload = JSON.parse(jsonPayload);
    console.log("Full token payload:", decodedPayload);

    return decodedPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// קבלת התפקיד מתוך הטוקן - בדיקה של שדות אפשריים שונים
export const getUserRole = () => {
  const decoded = decodeToken();
  if (!decoded) return null;

  console.log("Decoded token payload:", decoded);

  // מצא את התפקיד מהטוקן
  let role =
    decoded.role ||
    decoded.roles ||
    decoded.authorities ||
    (decoded.auth && decoded.auth.role) ||
    (Array.isArray(decoded.authorities) && decoded.authorities[0]) ||
    null;

  console.log("Final role value:", role);
  return role;
};

// קבלת האימייל מתוך הטוקן
export const getUserEmail = () => {
  const decoded = decodeToken();
  // בדיקת שדות אפשריים שונים לשם המשתמש/אימייל
  return decoded?.sub || decoded?.email || decoded?.username || null;
};

// בדיקה אם הטוקן פג תוקף
export const isTokenExpired = () => {
  const decoded = decodeToken();
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
export const getUserId = () => {
  const decodedToken = decodeToken();
  if (!decodedToken) return null;

  // בדוק אפשרויות שונות לשם השדה המכיל את המזהה
  let userId = null;

  if (decodedToken.id) {
    userId = decodedToken.id;
  } else if (decodedToken.userId) {
    userId = decodedToken.userId;
  } else if (decodedToken.sub) {
    userId = decodedToken.sub;
  } else if (decodedToken.user_id) {
    userId = decodedToken.user_id;
  }

  console.log("Found user ID in token:", userId);
  return userId;
};
// פונקציה עזר לדיבוג - הדפסת כל מידע הטוקן
export const debugTokenInfo = () => {
  const token = getToken();
  if (!token) {
    console.log("No token found");
    return null;
  }

  const decoded = decodeToken();
  console.log("Token information:", {
    token: token.substring(0, 15) + "...", // הצג רק חלק מהטוקן
    decoded: decoded,
    role: getUserRole(),
    email: getUserEmail(),
    expired: isTokenExpired(),
  });

  return decoded;
};
