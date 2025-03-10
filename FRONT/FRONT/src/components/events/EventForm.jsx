// components/events/EventForm.jsx
import React, { useState, useEffect } from "react";

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    eventDescription: "",
    priority: "NORMAL",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  // אם התקבל אירוע לעריכה, מלא את הטופס בנתונים שלו
  useEffect(() => {
    if (event) {
      setFormData({
        latitude: event.latitude || "",
        longitude: event.longitude || "",
        eventDescription: event.eventDescription || "",
        priority: event.priority || "NORMAL",
      });
    }
  }, [event]);

  // עדכון שדה בטופס
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6),
    });
  };
  // שליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // בדיקת שדות חובה
    if (
      !formData.latitude ||
      !formData.longitude ||
      !formData.eventDescription
    ) {
      setError("נא למלא את כל השדות");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      setLoading(false);

      // איפוס הטופס אם זו יצירה חדשה
      if (!event) {
        setFormData({
          latitude: "",
          longitude: "",
          eventDescription: "",
          priority: "NORMAL",
        });
      }
    } catch (err) {
      setError(err.message || "אירעה שגיאה בשמירת האירוע");
      setLoading(false);
    }
  };

  // קבלת מיקום נוכחי
  const getCurrentLocation = () => {
    setUseCurrentLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
          setUseCurrentLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("לא ניתן לקבל את המיקום הנוכחי. אנא הזן ידנית.");
          setUseCurrentLocation(false);
        }
      );
    } else {
      setError("הדפדפן שלך לא תומך באיתור מיקום");
      setUseCurrentLocation(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span>{error}</span>
        </div>
      )}

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="eventDescription"
        >
          תיאור האירוע
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="eventDescription"
          name="eventDescription"
          rows="3"
          placeholder="תיאור האירוע"
          value={formData.eventDescription}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="latitude"
          >
            קו רוחב
          </label>
          <div className="flex">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="latitude"
              name="latitude"
              type="text"
              placeholder="קו רוחב"
              value={formData.latitude}
              onChange={handleChange}
              required
              disabled={loading || useCurrentLocation}
            />
          </div>
        </div>

        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="longitude"
          >
            קו אורך
          </label>
          <div className="flex">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="longitude"
              name="longitude"
              type="text"
              placeholder="קו אורך"
              value={formData.longitude}
              onChange={handleChange}
              required
              disabled={loading || useCurrentLocation}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={loading || useCurrentLocation}
        >
          {useCurrentLocation ? "מקבל מיקום..." : "השתמש במיקום הנוכחי"}
        </button>
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="priority"
        >
          עדיפות
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="CRITICAL">קריטי</option>
          <option value="HIGH">גבוה</option>
          <option value="NORMAL">רגיל</option>
          <option value="LOW">נמוך</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? "שומר..." : event ? "עדכן אירוע" : "צור אירוע"}
        </button>

        {onCancel && (
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            ביטול
          </button>
        )}
      </div>
    </form>
  );
};

export default EventForm;
