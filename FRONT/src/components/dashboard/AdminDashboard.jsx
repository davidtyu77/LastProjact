// components/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import eventService from "../../services/event.service";
import userService from "../../services/user.service";
import EventList from "../events/EventList";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({ events: true, users: true });
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // טעינת כל האירועים ורשימת כל המשתמשים
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await eventService.getAllEvents();
        setEvents(eventsData);
        setLoading((prev) => ({ ...prev, events: false }));

        const usersData = await userService.getAllUsers();
        setUsers(usersData);
        setLoading((prev) => ({ ...prev, users: false }));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("אירעה שגיאה בטעינת הנתונים. אנא נסה שנית.");
      }
    };

    fetchData();
  }, []);

  // פונקציה לטיפול במחיקת אירוע
  const handleDeleteEvent = async (eventId) => {
    try {
      await eventService.deleteEvent(eventId);
      // עדכון מקומי של הרשימה ללא צורך בטעינה מחדש
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("אירעה שגיאה במחיקת האירוע. אנא נסה שנית.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">פאנל ניהול</h1>
        <p className="text-gray-600">
          ברוך הבא לפאנל הניהול. כאן תוכל לנהל את כל האירועים והמשתמשים במערכת.
        </p>
      </div>

      {/* הודעת שגיאה */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span>{error}</span>
        </div>
      )}

      {/* סיכום מערכת */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-2">משתמשים</h3>
          <p className="text-3xl font-bold">{users.length}</p>
          <Link
            to="/admin/users"
            className="text-blue-500 text-sm hover:underline"
          >
            נהל משתמשים &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-2">אירועים</h3>
          <p className="text-3xl font-bold">{events.length}</p>
          <span className="text-sm text-gray-500">סה"כ אירועים במערכת</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-2">אירועים שהושלמו</h3>
          <p className="text-3xl font-bold">
            {events.filter((event) => event.isDone === "yes").length}
          </p>
          <span className="text-sm text-gray-500">
            {(
              (events.filter((event) => event.isDone === "yes").length /
                events.length) *
                100 || 0
            ).toFixed(0)}
            % מהאירועים
          </span>
        </div>
      </div>

      {/* רשימת האירועים */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">כל האירועים</h2>
        </div>

        {loading.events ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : events.length > 0 ? (
          <EventList
            events={events}
            onDelete={handleDeleteEvent}
            isAdmin={true}
          />
        ) : (
          <p className="text-gray-500 text-center py-4">אין אירועים להצגה</p>
        )}
      </div>

      {/* רשימת המשתמשים */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">רשימת משתמשים</h2>
          <Link
            to="/admin/users"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm"
          >
            צפייה בכל המשתמשים
          </Link>
        </div>

        {loading.users ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-right">שם</th>
                  <th className="py-2 px-4 border-b text-right">אימייל</th>
                  <th className="py-2 px-4 border-b text-right">תפקיד</th>
                  <th className="py-2 px-4 border-b text-right">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">
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
                    <td className="py-2 px-4 border-b">
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="text-blue-500 hover:underline mr-2"
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
          <p className="text-gray-500 text-center py-4">אין משתמשים להצגה</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
