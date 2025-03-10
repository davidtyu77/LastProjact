// pages/EventsPage.jsx
import React, { useState, useEffect } from "react";
import { eventService } from "../../services/event.service";
import {
  getUserId,
  getUserRole,
  isFriend,
  isAdmin,
} from "../../utils/tokenUtils";
import EventList from "../../components/events/EventList";
import EventForm from "../../components/events/EventForm";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const currentUserId = getUserId();
  const userRole = getUserRole();
  const userIsFriend = isFriend();
  const userIsAdmin = isAdmin();

  // טעינת אירועים
  const loadEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const eventsData = await eventService.getAllEvents();
      console.log("Loaded events:", eventsData);
      setEvents(eventsData);
    } catch (err) {
      console.error("Error loading events:", err);
      setError("שגיאה בטעינת האירועים. נסה לרענן את הדף.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // מחיקת אירוע
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את האירוע?")) {
      return;
    }

    try {
      await eventService.deleteEvent(eventId);
      setEvents(events.filter((event) => event.id !== eventId));
      setSuccessMessage("האירוע נמחק בהצלחה");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("שגיאה במחיקת האירוע. נסה שוב.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // עדכון אירוע
  const handleUpdateEvent = async (updatedEvent) => {
    try {
      if (selectedEvent) {
        // עדכון אירוע קיים
        await eventService.updateEvent(updatedEvent.id, updatedEvent);
        setEvents(
          events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
        );
        setSuccessMessage("האירוע עודכן בהצלחה");
      } else {
        // יצירת אירוע חדש
        const newEvent = await eventService.createEvent(updatedEvent);
        setEvents([...events, newEvent]);
        setSuccessMessage("האירוע נוצר בהצלחה");
      }

      setShowForm(false);
      setSelectedEvent(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving event:", err);
      setError("שגיאה בשמירת האירוע. נסה שוב.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // פתיחת טופס לעדכון אירוע
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  // שיוך אירוע לחבר (לקיחת אירוע)
  const handleAssignToFriend = async (eventId, friendId) => {
    try {
      setLoading(true);

      // אם מדובר בחבר, הוא לוקח את האירוע לעצמו
      if (userIsFriend) {
        await eventService.assignEventToCurrentFriend(eventId);
      } else {
        // אם מדובר במנהל, עדכון שיוך מלא
        const eventToUpdate = events.find((e) => e.id === eventId);
        if (eventToUpdate) {
          const updatedEvent = {
            ...eventToUpdate,
            friend: { id: friendId },
          };
          await eventService.updateEvent(eventId, updatedEvent);
        }
      }

      // עדכון הרשימה המקומית
      setEvents(
        events.map((event) => {
          if (event.id === eventId) {
            return {
              ...event,
              friend: { id: friendId },
            };
          }
          return event;
        })
      );

      setSuccessMessage(
        userIsFriend ? "האירוע נלקח בהצלחה" : "האירוע שויך בהצלחה"
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error assigning event:", err);
      setError("שגיאה בשיוך האירוע. " + (err.message || "נסה שוב."));
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // עדכון סטטוס אירוע
  const handleUpdateStatus = async (updatedEvent) => {
    try {
      await eventService.updateStatus(updatedEvent.id, updatedEvent.isDone);

      // עדכון הרשימה המקומית
      setEvents(
        events.map((event) =>
          event.id === updatedEvent.id
            ? { ...event, isDone: updatedEvent.isDone }
            : event
        )
      );

      setSuccessMessage("סטטוס האירוע עודכן בהצלחה");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("שגיאה בעדכון סטטוס האירוע. נסה שוב.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ניהול אירועים</h1>

      {/* הודעות הצלחה ושגיאה */}
      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      {/* כפתורי פעולה */}
      <div className="mb-4">
        {/* רק משתמשים רגילים או מנהלים יכולים ליצור אירוע חדש */}
        {!userIsFriend && (
          <button
            onClick={() => {
              setSelectedEvent(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            אירוע חדש
          </button>
        )}
      </div>

      {/* טופס עריכה/יצירה */}
      {showForm && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">
            {selectedEvent ? "עריכת אירוע" : "יצירת אירוע חדש"}
          </h2>
          <EventForm
            event={selectedEvent}
            onSubmit={handleUpdateEvent}
            onCancel={() => {
              setShowForm(false);
              setSelectedEvent(null);
            }}
          />
        </div>
      )}

      {/* טעינה */}
      {loading && !events.length && (
        <div className="text-center py-8">
          <p className="text-gray-500">טוען אירועים...</p>
        </div>
      )}

      {/* רשימת אירועים */}
      {!loading && !events.length ? (
        <div className="text-center py-8">
          <p className="text-gray-500">אין אירועים להצגה</p>
          {userIsFriend && (
            <p className="text-gray-500 mt-2">אירועים שתיקח יופיעו כאן</p>
          )}
        </div>
      ) : (
        <EventList
          events={events}
          onDelete={handleDeleteEvent}
          onUpdate={handleUpdateStatus}
          onSelect={handleSelectEvent}
          onAssignFriend={handleAssignToFriend}
          isAdmin={userIsAdmin}
          isFriend={userIsFriend}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default EventsPage;
