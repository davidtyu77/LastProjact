"use client"

import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import EventsList from "../components/EventsList"
import ConfirmationDialog from "../components/ConfirmationDialog"

function VolunteerHomePage() {
    const { acceptedSosRequests, activeSosRequests, logout, navigateTo } = useAppContext()
    const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false)

    const handleSignOutClick = () => {
        setShowSignOutConfirmation(true)
    }

    const handleConfirmSignOut = () => {
        logout()
        navigateTo("login")
        setShowSignOutConfirmation(false)
    }

    const handleCancelSignOut = () => {
        setShowSignOutConfirmation(false)
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Volunteer Dashboard</h1>
                <button
                    onClick={handleSignOutClick}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-md text-sm flex items-center border border-zinc-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    Sign Out
                </button>
            </div>

            <div className="mb-6 border border-blue-600 rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-4 py-2 font-semibold">My Events</div>
                <div className="p-4 bg-zinc-800">
                    {acceptedSosRequests.length > 0 ? (
                        <EventsList events={acceptedSosRequests} isAcceptedList={true} />
                    ) : (
                        <div className="text-center py-6 text-gray-400">You haven't accepted any events yet.</div>
                    )}
                </div>
            </div>

            <div className="border border-zinc-700 rounded-lg overflow-hidden">
                <div className="bg-zinc-700 text-white px-4 py-2 font-semibold">Pending Response</div>
                <div className="p-4 bg-zinc-800">
                    {activeSosRequests.length > 0 ? (
                        <EventsList events={activeSosRequests} />
                    ) : (
                        <div className="text-center py-6 text-gray-400">There are no active SOS requests at the moment.</div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-blue-400 text-sm">Thank you for volunteering your time to help others in need!</p>
            </div>

            {showSignOutConfirmation && (
                <ConfirmationDialog
                    title="Sign Out"
                    message="Are you sure you want to sign out?"
                    onConfirm={handleConfirmSignOut}
                    onCancel={handleCancelSignOut}
                />
            )}
        </div>
    )
}

export default VolunteerHomePage

