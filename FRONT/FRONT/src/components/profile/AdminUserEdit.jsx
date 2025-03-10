// components/profile/AdminUserEdit.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import userService from "../../services/user.service";

const AdminUserEdit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // טעינת פרטי המשתמש ורשימת התפקידים
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // טעינת פרטי המשתמש
        const userData = await userService.getUserById(userId);

        // פיקטיבי - ברגיל היינו מביאים את רשימת התפקידים מהשרת
        const rolesData = [
          { id: 1, roleName: "ROLE_USER" },
          { id: 3, roleName: "ROLE_FRIEND" },
          { id: 2, roleName: "ROLE_ADMIN" },
        ];

        setRoles(rolesData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          password: "",
          confirmPassword: "",
          roleId: userData.role.id || "",
        });

        setLoading(false);
      } catch (err) {
        setError("שגיאה בטעינת פרטי המשתמש");
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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
    setError("");
    setSuccess("");
    // console.log("Sending update data:", updateData);

    // בדיקת שדות חובה
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.roleId
    ) {
      setError("נא למלא את כל השדות");
      return;
    }

    // בדיקת התאמת סיסמאות אם הוזנה סיסמה חדשה
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    try {
      setSaving(true);

      const selectedRole = roles.find((role) => role.id == formData.roleId);

      // הכנת אובייקט עדכון - ללא סיסמה אם לא הוזנה
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: {
          id: parseInt(formData.roleId),
          roleName: selectedRole ? selectedRole.roleName : "",
        },
      };

      // הוספת סיסמה רק אם הוזנה
      if (formData.password) {
        updateData.password = formData.password;
      }

      await userService.updateUser(userId, updateData);

      setSuccess("פרטי המשתמש עודכנו בהצלחה");

      // איפוס שדות סיסמה
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });

      setSaving(false);
    } catch (err) {
      setError(err.message || "אירעה שגיאה בעדכון פרטי המשתמש");
      setSaving(false);
    }
  };

  // חזרה לרשימת המשתמשים
  const handleBack = () => {
    navigate("/admin/users");
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">עריכת משתמש</h1>
          <button
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            חזרה לרשימה
          </button>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <span>{success}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="roleId"
              >
                תפקיד
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="roleId"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                required
                disabled={saving}
              >
                <option value="">בחר תפקיד</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.roleName.replace("ROLE_", "")}
                  </option>
                ))}
              </select>
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
                disabled={saving}
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
                disabled={saving}
              />
            </div>

            <div className="flex justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={saving}
              >
                {saving ? "שומר..." : "שמור שינויים"}
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleBack}
                disabled={saving}
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

export default AdminUserEdit;
