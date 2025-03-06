"use client"

import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import ConfirmationDialog from "./ConfirmationDialog"
import UserProfileModal from "./UserProfileModal"

function EventCard({ request }) {
  const { updateSosRequest, cancelSosRequest, navigateTo } = useAppContext()
  const [showEditConfirmation, setShowEditConfirmation] = useState(false)
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
  const [showVolunteerProfile, setShowVolunteerProfile] = useState(false)

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

  const handleEdit = () => {
    setShowEditConfirmation(true)
  }

  const confirmEdit = () => {
    setShowEditConfirmation(false)
    navigateTo("sosForm")
  }

  const handleCancel = () => {
    setShowCancelConfirmation(true)
  }

  const confirmCancel = () => {
    cancelSosRequest()
    setShowCancelConfirmation(false)
  }

  const handleVolunteerProfileClick = () => {
    if (request.volunteer) {
      setShowVolunteerProfile(true)
    }
  }

  return (
    <div className="bg-zinc-800 text-white rounded-lg shadow-md p-4 w-full max-w-md border border-zinc-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{request.category} Assistance</h3>
          <div className="flex items-center mt-1">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getUrgencyColor(request.urgency)}`}></span>
            <span className="text-gray-300">{request.urgency}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleEdit} className="text-blue-400 hover:text-blue-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button onClick={handleCancel} className="text-red-400 hover:text-red-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {request.details && <p className="text-gray-300 mb-3">{request.details}</p>}

      <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {request.useCurrentLocation ? "Current Location" : "Custom Location"}
        </div>

        {request.volunteer ? (
          <div className="flex items-center cursor-pointer hover:text-blue-400" onClick={handleVolunteerProfileClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-green-500">Volunteer Responding</span>
          </div>
        ) : (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Waiting for response
          </div>
        )}
      </div>

      {showEditConfirmation && (
        <ConfirmationDialog
          title="Edit Request"
          message="Do you want to edit your SOS request?"
          onConfirm={confirmEdit}
          onCancel={() => setShowEditConfirmation(false)}
        />
      )}

      {showCancelConfirmation && (
        <ConfirmationDialog
          title="Cancel Request"
          message="Are you sure you want to cancel your SOS request?"
          onConfirm={confirmCancel}
          onCancel={() => setShowCancelConfirmation(false)}
        />
      )}

      {showVolunteerProfile && request.volunteer && (
        <UserProfileModal user={request.volunteer} onClose={() => setShowVolunteerProfile(false)} isVolunteer={true} />
      )}
    </div>
  )
}

export default EventCard

