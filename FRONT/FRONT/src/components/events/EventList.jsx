// components/events/EventList.jsx
import React, { useState } from "react";
import EventItem from "./EventItem";

const EventList = ({
  events,
  onDelete,
  onUpdate,
  onSelect,
  onAssignFriend,
  isAdmin = false,
  isFriend = false,
  currentUserId,
}) => {
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // מיון אירועים
  const sortEvents = (a, b) => {
    switch (sortBy) {
      case "date":
        return sortDir === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      case "priority":
        const priorityOrder = { CRITICAL: 3, HIGH: 2, NORMAL: 1, LOW: 0 };
        return sortDir === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      case "status":
        return sortDir === "asc"
          ? (a.isDone === "yes" ? 1 : 0) - (b.isDone === "yes" ? 1 : 0)
          : (b.isDone === "yes" ? 1 : 0) - (a.isDone === "yes" ? 1 : 0);
      default:
        return 0;
    }
  };

  // סינון אירועים
  const filteredEvents = events.filter((event) => {
    if (filterStatus !== "all" && event.isDone !== filterStatus) {
      return false;
    }
    if (filterPriority !== "all" && event.priority !== filterPriority) {
      return false;
    }
    return true;
  });

  // מיון האירועים המסוננים
  const sortedEvents = [...filteredEvents].sort(sortEvents);

  // שינוי המיון
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  return (
    <div>
      {/* סרגל סינון ומיון */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label
            htmlFor="filterStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            סטטוס
          </label>
          <select
            id="filterStatus"
            className="border rounded px-2 py-1 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">הכל</option>
            <option value="no">בטיפול</option>
            <option value="yes">הושלם</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filterPriority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            עדיפות
          </label>
          <select
            id="filterPriority"
            className="border rounded px-2 py-1 text-sm"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">הכל</option>
            <option value="CRITICAL">קריטי</option>
            <option value="HIGH">גבוה</option>
            <option value="NORMAL">רגיל</option>
            <option value="LOW">נמוך</option>
          </select>
        </div>

        <div className="flex-grow"></div>

        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 ml-2">
            מיון לפי:
          </span>
          <button
            className={`px-2 py-1 text-sm rounded mx-1 ${
              sortBy === "date" ? "bg-blue-100 text-blue-800" : "bg-gray-100"
            }`}
            onClick={() => handleSort("date")}
          >
            תאריך {sortBy === "date" && (sortDir === "asc" ? "↑" : "↓")}
          </button>
          <button
            className={`px-2 py-1 text-sm rounded mx-1 ${
              sortBy === "priority"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100"
            }`}
            onClick={() => handleSort("priority")}
          >
            עדיפות {sortBy === "priority" && (sortDir === "asc" ? "↑" : "↓")}
          </button>
          <button
            className={`px-2 py-1 text-sm rounded mx-1 ${
              sortBy === "status" ? "bg-blue-100 text-blue-800" : "bg-gray-100"
            }`}
            onClick={() => handleSort("status")}
          >
            סטטוס {sortBy === "status" && (sortDir === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {/* רשימת האירועים */}
      <div className="space-y-4">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onSelect={onSelect}
              onAssignFriend={onAssignFriend}
              isAdmin={isAdmin}
              isFriend={isFriend}
              currentUserId={currentUserId}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            אין אירועים התואמים את הסינון
          </p>
        )}
      </div>
    </div>
  );
};

export default EventList;
