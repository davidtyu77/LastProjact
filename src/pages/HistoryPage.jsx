"use client"
import { useAppContext } from "../context/AppContext"

function HistoryPage() {
  const { navigateTo, user } = useAppContext()

  // Mock history data for users
  const userHistoryItems = [
    {
      id: "1",
      category: "Medical",
      urgency: "Urgent",
      date: "2023-05-15",
      status: "completed",
      volunteer: "Dr. Sarah Johnson",
    },
    {
      id: "2",
      category: "Vehicle Repair",
      urgency: "Not Urgent",
      date: "2023-04-22",
      status: "completed",
      volunteer: "Mike's Auto Shop",
    },
    {
      id: "3",
      category: "Home Repair",
      urgency: "Emergency",
      date: "2023-03-10",
      status: "cancelled",
      volunteer: null,
    },
  ]

  // Mock history data for volunteers
  const volunteerHistoryItems = [
    {
      id: "4",
      category: "Medical",
      urgency: "Emergency",
      date: "2023-06-12",
      status: "completed",
      user: "John Miller",
    },
    {
      id: "5",
      category: "Home Repair",
      urgency: "Urgent",
      date: "2023-05-28",
      status: "completed",
      user: "Sarah Williams",
    },
    {
      id: "6",
      category: "Vehicle Repair",
      urgency: "Not Urgent",
      date: "2023-05-05",
      status: "completed",
      user: "Robert Davis",
    },
  ]

  // Select history based on user role
  const historyItems = user?.role === "volunteer" ? volunteerHistoryItems : userHistoryItems

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Not Urgent":
        return "bg-green-500"
      case "Urgent":
        return "bg-orange-500"
      case "Emergency":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => navigateTo("home")} className="mr-2 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">{user?.role === "volunteer" ? "Assistance History" : "Request History"}</h1>
      </div>

      <div className="space-y-4">
        {historyItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold">{item.category} Assistance</h3>
                <div className="flex items-center mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getUrgencyColor(item.urgency)}`}></span>
                  <span className="text-sm text-gray-600">{item.urgency}</span>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>

            <div className="text-sm text-gray-500 mt-2">
              <div className="flex justify-between mb-1">
                <span>Date:</span>
                <span>{item.date}</span>
              </div>
              {user?.role === "volunteer" ? (
                <div className="flex justify-between">
                  <span>Requester:</span>
                  <span>{item.user}</span>
                </div>
              ) : (
                item.volunteer && (
                  <div className="flex justify-between">
                    <span>Volunteer:</span>
                    <span>{item.volunteer}</span>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryPage

