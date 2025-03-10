// components/profile/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import userService from "../../services/user.service";

const UserProfile = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editMode, setEditMode] = useState(false);

  // טעינת נתוני המשתמש בעת טעינת הדף
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [currentUser]);

  // עדכון שדה בטופס
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // שליחת הטופס - עדכון פרטי משתמש
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // בדיקת שדות חובה
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setMessage({ text: "נא למלא את כל השדות", type: "error" });
      return;
    }

    // בדיקת התאמת סיסמאות אם הוזנה סיסמה חדשה
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ text: "הסיסמאות אינן תואמות", type: "error" });
      return;
    }

    try {
      setLoading(true);

      // הכנת אובייקט עדכון - ללא סיסמה אם לא הוזנה
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      // הוספת סיסמה רק אם הוזנה
      if (formData.password) {
        updateData.password = formData.password;
      }

      await userService.updateUser(currentUser.id, updateData);

      setMessage({ text: "הפרטים עודכנו בהצלחה", type: "success" });
      setEditMode(false);

      // איפוס שדות סיסמה
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessage({
        text: err.message || "אירעה שגיאה בעדכון הפרטים",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // מחיקת המשתמש
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו בלתי הפיכה."
      )
    ) {
      try {
        setLoading(true);
        await userService.deleteUser(currentUser.id);
        logout(); // התנתקות לאחר מחיקת החשבון
      } catch (err) {
        setMessage({
          text: err.message || "אירעה שגיאה במחיקת החשבון",
          type: "error",
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">הפרופיל שלי</h1>

        {message.text && (
          <div
            className={`${
              message.type === "error"
                ? "bg-red-100 border-red-400 text-red-700"
                : "bg-green-100 border-green-400 text-green-700"
            } px-4 py-3 rounded mb-4 border`}
            role="alert"
          >
            <span>{message.text}</span>
          </div>
        )}

        {!editMode ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between border-b pb-3 mb-3">
                <span className="font-bold">שם פרטי:</span>
                <span>{formData.firstName}</span>
              </div>
              <div className="flex justify-between border-b pb-3 mb-3">
                <span className="font-bold">שם משפחה:</span>
                <span>{formData.lastName}</span>
              </div>
              <div className="flex justify-between border-b pb-3 mb-3">
                <span className="font-bold">אימייל:</span>
                <span>{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">תפקיד:</span>
                <span>{isAdmin ? "מנהל" : "משתמש רגיל"}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setEditMode(true)}
                disabled={loading}
              >
                ערוך פרטים
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                מחק חשבון
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                שם פרטי
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                name="firstName"
                type="text"
                placeholder="שם פרטי"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                שם משפחה
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastName"
                name="lastName"
                type="text"
                placeholder="שם משפחה"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                אימייל
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="email"
                placeholder="אימייל"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                סיסמה חדשה (לא חובה)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="password"
                placeholder="השאר ריק אם אין שינוי"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                אימות סיסמה חדשה
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="אימות סיסמה חדשה"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="flex justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? "שומר..." : "שמור"}
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setEditMode(false);
                  // שחזור נתוני המשתמש המקוריים
                  if (currentUser) {
                    setFormData({
                      firstName: currentUser.firstName || "",
                      lastName: currentUser.lastName || "",
                      email: currentUser.email || "",
                      password: "",
                      confirmPassword: "",
                    });
                  }
                }}
                disabled={loading}
              >
                ביטול
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
