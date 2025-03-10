// components/dashboard/FriendDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import eventService from "../../services/event.service";
import EventList from "../events/EventList";
import EventStatus from "../events/EventStatus";

const FriendDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { currentUser } = useAuth();

  // טעינת כל האירועים במערכת
  const fetchEvents = async () => {
    setLoading(true);
    try {
      console.log("Fetching events for Friend role");
      // השתמש בשירות האירועים המעודכן שמשתמש בנתיב הנכון /friends/events
      const response = await eventService.getAllEvents();
      console.log("Events response:", response);

      // טיפול בתגובות שונות אפשריות
      let eventsData = [];

      if (Array.isArray(response)) {
        // אם התגובה היא מערך, השתמש בה ישירות
        eventsData = response;
      } else if (typeof response === "object" && response !== null) {
        // אם התגובה היא אובייקט (לא מערך), בדוק אם יש שדה שנראה כמו מערך אירועים
        if (response.events && Array.isArray(response.events)) {
          eventsData = response.events;
        } else if (response.data && Array.isArray(response.data)) {
          eventsData = response.data;
        } else {
          // אם זה אובייקט בודד, הפוך אותו למערך
          const keys = Object.keys(response);
          if (keys.includes("id") || keys.includes("eventDescription")) {
            eventsData = [response];
          }
        }
      } else if (typeof response === "string") {
        // אם התגובה היא מחרוזת, זה יכול להיות הודעה כמו "לא נמצאו אירועים במערכת"
        console.log("Received string response:", response);
        setError(response);
        eventsData = [];
      }

      console.log("Processed events data:", eventsData);
      setEvents(eventsData);
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

  // פונקציה לטיפול בבחירת אירוע
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  // פונקציה לטיפול בעדכון סטטוס אירוע
  const handleUpdateStatus = async (eventId, status) => {
    try {
      // במקום לקרוא לupdateEventStatus, נקרא לupdateStatus המעודכן
      await eventService.updateStatus(eventId, status);
      fetchEvents(); // רענון רשימת האירועים
      setSelectedEvent(null); // סגירת חלון העדכון
    } catch (err) {
      console.error("Error updating event status:", err);
      setError("אירעה שגיאה בעדכון סטטוס האירוע. אנא נסה שנית.");
    }
  };

  // פונקציה לטיפול בהקצאת חבר לאירוע
  // הבעיה: אין API מתאים בקונטרולר של החבר שמטפל בהקצאת חבר לאירוע
  // פתרון זמני: יש להציג הודעה שהפונקציה אינה זמינה כרגע
  const handleAssignFriend = async (eventId) => {
    try {
      await eventService.updateAnFriendId(eventId, currentUser.id);
      fetchEvents(); // רענון הנתונים לאחר עדכון
    } catch (err) {
      console.error("Error assigning friend to event:", err);
      setError("אירעה שגיאה בהקצאת האירוע. אנא נסה שנית.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">
          ברוך הבא, {currentUser?.firstName || "חבר"}
        </h1>
        <p className="text-gray-600">
          ברוך הבא למערכת ניהול האירועים. כאן תוכל לראות את כל האירועים במערכת,
          להקצות את עצמך לאירועים ולעדכן את הסטטוס שלהם.
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

      {/* כפתור דיבוג לרענון נתונים */}
      <div className="mb-4">
        <button
          onClick={fetchEvents}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          רענן נתונים
        </button>
      </div>

      {/* חלון עדכון סטטוס */}
      {selectedEvent && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">עדכון סטטוס אירוע</h2>
          <EventStatus
            event={selectedEvent}
            onUpdate={handleUpdateStatus}
            onCancel={() => setSelectedEvent(null)}
          />
        </div>
      )}

      {/* רשימת האירועים */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">כל האירועים במערכת</h2>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : events && events.length > 0 ? (
          <EventList
            events={events}
            onSelect={handleSelectEvent}
            onAssignFriend={handleAssignFriend}
            isFriend={true}
            currentUserId={currentUser?.id}
          />
        ) : (
          <p className="text-gray-500 text-center py-4">אין אירועים להצגה</p>
        )}
      </div>
    </div>
  );
};

export default FriendDashboard;
