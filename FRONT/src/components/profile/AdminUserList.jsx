// components/profile/AdminUserList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userService from "../../services/user.service";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // טעינת רשימת המשתמשים
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError("שגיאה בטעינת רשימת המשתמשים");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // מחיקת משתמש
  const handleDeleteUser = async (userId) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) {
      try {
        await userService.deleteUser(userId);
        // עדכון מקומי של רשימת המשתמשים
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        setError("שגיאה במחיקת המשתמש");
      }
    }
  };

  // סינון המשתמשים לפי חיפוש ותפקיד
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && user.role.roleName === "ROLE_ADMIN") ||
      (roleFilter === "friend" && user.role.roleName === "ROLE_FRIEND") ||
      (roleFilter === "user" && user.role.roleName === "ROLE_USER");

    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">ניהול משתמשים</h1>
          <Link
            to="/admin/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            חזרה לדשבורד
          </Link>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <span>{error}</span>
          </div>
        )}

        {/* סרגל חיפוש וסינון */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-6">
          <div className="md:w-1/2">
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="חפש לפי שם או אימייל..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">כל התפקידים</option>
              <option value="admin">מנהלים</option>
              <option value="friend">חברים</option>
              <option value="user">משתמשים רגילים</option>
            </select>
          </div>
        </div>

        {/* טבלת משתמשים */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-right">מזהה</th>
                  <th className="py-3 px-4 border-b text-right">שם מלא</th>
                  <th className="py-3 px-4 border-b text-right">אימייל</th>
                  <th className="py-3 px-4 border-b text-right">תפקיד</th>
                  <th className="py-3 px-4 border-b text-right">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{user.id}</td>
                    <td className="py-3 px-4 border-b">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-3 px-4 border-b">{user.email}</td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.role.roleName === "ROLE_ADMIN"
                            ? "bg-red-100 text-red-800"
                            : user.role.roleName === "ROLE_FRIEND"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role.roleName.replace("ROLE_", "")}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded mr-2"
                      >
                        מחק
                      </button>
                      <Link
                        to={`/admin/users/${user.id}/edit`}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded"
                      >
                        ערוך
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            {searchTerm || roleFilter !== "all"
              ? "לא נמצאו משתמשים התואמים את החיפוש"
              : "אין משתמשים להצגה"}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUserList;
