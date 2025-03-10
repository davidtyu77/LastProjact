// components/events/EventStatus.jsx
import React, { useState } from "react";

const EventStatus = ({ event, onUpdate, onCancel }) => {
  const [status, setStatus] = useState(event?.isDone || "no");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // שליחת עדכון הסטטוס
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      // כאן אנחנו שולחים רק את הסטטוס כמחרוזת, לא כאובייקט
      await onUpdate(event.id, status);
      setLoading(false);
    } catch (err) {
      setError(err.message || "אירעה שגיאה בעדכון הסטטוס");
      setLoading(false);
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
        <p className="text-lg mb-2">
          <span className="font-bold">אירוע:</span> {event.eventDescription}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-bold">עדיפות:</span> {event.priority}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          עדכון סטטוס:
        </label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="status"
              value="no"
              checked={status === "no"}
              onChange={() => setStatus("no")}
              disabled={loading}
            />
            <span className="ml-2">בטיפול</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="status"
              value="yes"
              checked={status === "yes"}
              onChange={() => setStatus("yes")}
              disabled={loading}
            />
            <span className="ml-2">הושלם</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? "מעדכן..." : "עדכן סטטוס"}
        </button>

        <button
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          ביטול
        </button>
      </div>
    </form>
  );
};

export default EventStatus;
