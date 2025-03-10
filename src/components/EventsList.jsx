"use client"

import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import ConfirmationDialog from "./ConfirmationDialog"
import UserProfileModal from "./UserProfileModal"

function EventsList({ events, isAcceptedList = false }) {
    const { acceptSosRequest } = useAppContext()
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [showProfile, setShowProfile] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

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

    const handleEventClick = (event) => {
        if (!isAcceptedList) {
            setSelectedEvent(event)
            setShowConfirmation(true)
        }
    }

    const handleProfileClick = (e, user) => {
        e.stopPropagation()
        setSelectedUser(user)
        setShowProfile(true)
    }

    const handleConfirmAccept = () => {
        acceptSosRequest(selectedEvent.id)
        setShowConfirmation(false)
        setSelectedEvent(null)
    }

    const handleCancelAccept = () => {
        setShowConfirmation(false)
        setSelectedEvent(null)
    }

    const handleCloseProfile = () => {
        setShowProfile(false)
        setSelectedUser(null)
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-6 text-gray-400">
                {isAcceptedList ? "You haven't accepted any events yet." : "There are no active SOS requests at the moment."}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {events.map((event) => (
                <div
                    key={event.id}
                    className={`text-white rounded-lg shadow-md p-4 ${isAcceptedList
                            ? "bg-zinc-800/80 border border-blue-500"
                            : "bg-zinc-800 border border-zinc-700 cursor-pointer hover:bg-zinc-700"
                        }`}
                    onClick={() => handleEventClick(event)}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="font-bold text-lg">{event.category} Assistance</h3>
                            <div className="flex items-center mt-1">
                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getUrgencyColor(event.urgency)}`}></span>
                                <span className="text-gray-300">{event.urgency}</span>
                            </div>
                        </div>
                        <div
                            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-700"
                            onClick={(e) => handleProfileClick(e, event.user)}
                        >
                            {event.user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    {event.details && <p className="text-gray-300 mb-3">{event.details}</p>}

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
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            {event.useCurrentLocation ? "Current Location" : "Custom Location"}
                        </div>
                        {!isAcceptedList && (
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
                        {isAcceptedList && (
                            <div className="flex items-center">
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
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="text-green-500">Accepted</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {showConfirmation && selectedEvent && (
                <ConfirmationDialog
                    title="Accept SOS Request"
                    message="Are you sure you want to accept this SOS request? This will notify the user that help is on the way."
                    onConfirm={handleConfirmAccept}
                    onCancel={handleCancelAccept}
                    details={{
                        Category: selectedEvent.category,
                        Urgency: selectedEvent.urgency,
                        Details: selectedEvent.details || "None provided",
                        From: selectedEvent.user.name,
                    }}
                />
            )}

            {showProfile && selectedUser && <UserProfileModal user={selectedUser} onClose={handleCloseProfile} />}
        </div>
    )
}

export default EventsList

