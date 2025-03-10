// components/events/EventItem.jsx
import React, { useState } from "react";

const EventItem = ({
  event,
  onDelete,
  onUpdate,
  onSelect,
  onAssignFriend,
  isAdmin = false,
  isFriend = false,
  currentUserId,
}) => {
  const [expanded, setExpanded] = useState(false);

  // פונקציה להמרת עדיפות לצבע רקע
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "NORMAL":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // פורמט תאריך
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // בדיקה אם האירוע משויך למשתמש הנוכחי
  const isAssignedToCurrentUser =
    event.friend && event.friend.id === currentUserId;

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        expanded ? "shadow-md" : "shadow-sm"
      }`}
    >
      {/* כותרת האירוע */}
      <div
        className={`flex justify-between items-center p-4 cursor-pointer ${
          event.isDone === "yes" ? "bg-gray-50" : "bg-white"
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-3 ${
              event.isDone === "yes" ? "bg-green-500" : "bg-yellow-500"
            }`}
          ></div>
          <div>
            <div className="font-medium">
              {event.eventDescription}
              {event.isDone === "yes" && (
                <span className="text-green-600 text-sm mr-2">(הושלם)</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(event.date)}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <span
            className={`text-xs px-2 py-1 rounded border ${getPriorityColor(
              event.priority
            )}`}
          >
            {event.priority}
          </span>
          <button
            className="ml-2 text-gray-400 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* פרטי האירוע המורחבים */}
      {expanded && (
        <div className="p-4 border-t bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-bold mb-1">מיקום</h4>
              <p className="text-sm">
                קו רוחב: {event.latitude}, קו אורך: {event.longitude}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold mb-1">משתמש</h4>
              <p className="text-sm">
                {event.user
                  ? `${event.user.firstName} ${event.user.lastName}`
                  : "לא מוגדר"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold mb-1">חבר</h4>
              <p className="text-sm">
                {event.friend
                  ? `${event.friend.firstName} ${event.friend.lastName}`
                  : "לא מוקצה"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold mb-1">סטטוס</h4>
              <p className="text-sm">
                {event.isDone === "yes" ? "הושלם" : "בטיפול"}
              </p>
            </div>
          </div>

          {/* כפתורי פעולה */}
          <div className="flex flex-wrap gap-2 mt-4 justify-end">
            {isAdmin && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete && onDelete(event.id);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  מחק
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate &&
                      onUpdate(event.id, {
                        isDone: event.isDone === "yes" ? "no" : "yes",
                      });
                  }}
                  className={`${
                    event.isDone === "yes"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white px-3 py-1 rounded text-sm`}
                >
                  {event.isDone === "yes" ? "סמן כבטיפול" : "סמן כהושלם"}
                </button>
              </>
            )}

            {isFriend && (
              <>
                {!event.friend && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssignFriend && onAssignFriend(event.id);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    קח אירוע
                  </button>
                )}

                {isAssignedToCurrentUser && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect && onSelect(event);
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                  >
                    עדכן סטטוס
                  </button>
                )}
              </>
            )}

            {!isAdmin && !isFriend && onUpdate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate &&
                    onUpdate(event.id, {
                      isDone: event.isDone === "yes" ? "no" : "yes",
                    });
                }}
                className={`${
                  event.isDone === "yes"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white px-3 py-1 rounded text-sm`}
              >
                {event.isDone === "yes" ? "סמן כבטיפול" : "סמן כהושלם"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventItem;
