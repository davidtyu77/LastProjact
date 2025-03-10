// components/dashboard/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import eventService from "../../services/event.service";
import EventForm from "../events/EventForm";
import EventList from "../events/EventList";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const { currentUser } = useAuth();

  // טעינת האירועים של המשתמש
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("אירעה שגיאה בטעינת האירועים. אנא נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // פונקציה לטיפול ביצירת אירוע חדש
  const handleCreateEvent = async (eventData) => {
    try {
      await eventService.createEvent(eventData);
      setShowEventForm(false);
      fetchEvents(); // רענון רשימת האירועים
    } catch (err) {
      console.error("Error creating event:", err);
      setError("אירעה שגיאה ביצירת האירוע. אנא נסה שנית.");
    }
  };

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

  // פונקציה לטיפול בעדכון אירוע
  const handleUpdateEvent = async (eventId, eventData) => {
    try {
      await eventService.updateEvent(eventId, eventData);
      fetchEvents(); // רענון רשימת האירועים
    } catch (err) {
      console.error("Error updating event:", err);
      setError("אירעה שגיאה בעדכון האירוע. אנא נסה שנית.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">
          ברוך הבא, {currentUser?.firstName || "משתמש"}
        </h1>
        <p className="text-gray-600">
          ברוך הבא למערכת ניהול האירועים שלך. כאן תוכל לצפות, ליצור ולנהל את
          האירועים שלך.
        </p>
      </div>

      {/* כפתור יצירת אירוע חדש */}
      <div className="mb-6">
        <button
          onClick={() => setShowEventForm(!showEventForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {showEventForm ? "ביטול" : "צור אירוע חדש"}
        </button>
      </div>
      {/* טופס יצירת אירוע חדש */}
      {showEventForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">יצירת אירוע חדש</h2>
          <EventForm onSubmit={handleCreateEvent} />
        </div>
      )}

      {/* הודעת שגיאה */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span>{error}</span>
        </div>
      )}

      {/* רשימת האירועים */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">האירועים שלי</h2>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : events.length > 0 ? (
          <EventList
            events={events}
            onDelete={handleDeleteEvent}
            onUpdate={handleUpdateEvent}
            isAdmin={false}
          />
        ) : (
          <p className="text-gray-500 text-center py-4">אין אירועים להצגה</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
