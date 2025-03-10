import { get, post, put, patch, del } from "./api";
import { getUserRole } from "../utils/tokenUtils";

export const eventService = {
  pollingInterval: null, // משתנה לשמירת ה-interval

  // התחלת בקשות מחזוריות לקבלת אירועים
  startPollingEvents: (intervalMs = 30000, callback) => {
    console.log(`Starting events polling with interval of ${intervalMs}ms`);

    // מוודא שאין כבר interval פעיל
    if (eventService.pollingInterval) {
      clearInterval(eventService.pollingInterval);
    }

    // קריאה ראשונית מיידית
    eventService
      .getAllEvents()
      .then((events) => {
        console.log(
          `Initial fetch complete: ${events.length} events retrieved`
        );
        if (callback && typeof callback === "function") {
          callback(events);
        }
      })
      .catch((error) => {
        console.error("Error in initial events fetch:", error);
      });

    // הגדרת ה-interval לקריאות עתידיות
    eventService.pollingInterval = setInterval(() => {
      console.log("Polling for events...");

      eventService
        .getAllEvents()
        .then((events) => {
          console.log(`Polling complete: ${events.length} events retrieved`);
          if (callback && typeof callback === "function") {
            callback(events);
          }
        })
        .catch((error) => {
          console.error("Error in events polling:", error);
        });
    }, intervalMs);

    // החזרת מזהה ה-interval כדי לאפשר עצירה במקום אחר
    return eventService.pollingInterval;
  },

  // עצירת בקשות מחזוריות
  stopPollingEvents: () => {
    if (eventService.pollingInterval) {
      console.log("Stopping events polling");
      clearInterval(eventService.pollingInterval);
      eventService.pollingInterval = null;
      return true;
    }
    return false;
  },

  // קבלת כל האירועים בהתאם לתפקיד המשתמש
  getAllEvents: async () => {
    const role = getUserRole();

    try {
      console.log(`Fetching events for role: ${role}`);
      let response;

      if (role === "ROLE_ADMIN" || role === "ADMIN") {
        response = await get("/admin/events");
      } else if (role === "ROLE_FRIEND" || role === "FRIEND") {
        response = await get("/friends/events");
      } else {
        response = await get("/users/events");
      }

      console.log("Events response:", response);

      if (typeof response === "string") {
        if (response.includes("לא נמצאו אירועים")) {
          return [];
        }
        try {
          return JSON.parse(response);
        } catch (e) {
          return [];
        }
      } else if (!response) {
        return [];
      }

      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === "object") {
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else if (response.events && Array.isArray(response.events)) {
          return response.events;
        } else if (response.content && Array.isArray(response.content)) {
          return response.content;
        }

        if (response.id || response.eventDescription) {
          return [response];
        }
      }

      console.warn("Unexpected response format:", response);
      return [];
    } catch (error) {
      console.error("Get all events error:", error);
      throw error;
    }
  },

  // קבלת אירוע לפי מזהה
  getEventById: async (eventId) => {
    try {
      const role = getUserRole();

      if (role === "ROLE_FRIEND" || role === "FRIEND") {
        return await get(`/friends/events/${eventId}`);
      } else {
        return await get(`/events/${eventId}`);
      }
    } catch (error) {
      console.error(`Get event ${eventId} error:`, error);
      throw error;
    }
  },

  // יצירת אירוע חדש
  createEvent: async (eventData) => {
    try {
      return await post("/users/events", eventData);
    } catch (error) {
      console.error("Create event error:", error);
      throw error;
    }
  },

  updateAnFriendId: async (eventId, friendId) => {
    try {
      return await patch(`/friends/${eventId}`, { friendId });
    } catch (error) {
      console.error("Error updating friend ID:", error);
    }
  },

  // עדכון אירוע קיים
  updateEvent: async (eventId, eventData) => {
    try {
      const role = getUserRole();
      console.log("Updating event with role:", role);
      console.log("Event data to update:", eventData);

      if (role === "ROLE_FRIEND" || role === "FRIEND") {
        if (eventData.isDone !== undefined) {
          return await patch(`/friends/events/${eventId}/status`, {
            isDone: eventData.isDone,
          });
        } else {
          throw new Error("חברים יכולים לעדכן רק סטטוס של אירוע");
        }
      } else if (role === "ROLE_ADMIN" || role === "ADMIN") {
        return await put(`/admin/events/${eventId}`, eventData);
      } else {
        try {
          return await put(`/users/events/${eventId}`, eventData);
        } catch (error) {
          if (error.status === 403 || error.status === 404) {
            return await put(`/events/${eventId}`, eventData);
          }
          throw error;
        }
      }
    } catch (error) {
      console.error(`Update event ${eventId} error:`, error);
      throw error;
    }
  },

  assignEventToCurrentFriend: async (eventId) => {
    try {
      return await post(`/friends/events/${eventId}/assign`, {});
    } catch (error) {
      console.error(`Assign event ${eventId} error:`, error);
      throw error;
    }
  },

  updateStatus: async (eventId, status) => {
    try {
      const role = getUserRole();
      if (role === "ROLE_FRIEND" || role === "FRIEND") {
        return await patch(`/friends/events/${eventId}/status`, {
          isDone: status,
        });
      } else {
        return await patch(`/events/${eventId}/status`, {
          isDone: status,
        });
      }
    } catch (error) {
      console.error(`Update event status ${eventId} error:`, error);
      throw error;
    }
  },

  deleteEvent: async (eventId) => {
    try {
      return await del(`/events/${eventId}`);
    } catch (error) {
      console.error(`Delete event ${eventId} error:`, error);
      throw error;
    }
  },

  getEventsByUserId: async (userId) => {
    try {
      return await get(`/events/user/${userId}`);
    } catch (error) {
      console.error(`Get events for user ${userId} error:`, error);
      throw error;
    }
  },

  getEventsByFriendId: async (friendId) => {
    try {
      return await get(`/events/friend/${friendId}`);
    } catch (error) {
      console.error(`Get events for friend ${friendId} error:`, error);
      throw error;
    }
  },

  findAllEvents: async () => {
    try {
      return await get("/friends/events");
    } catch (error) {
      console.error("Find all events error:", error);
      throw error;
    }
  },
};

export default eventService;
