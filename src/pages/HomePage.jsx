"use client"
import { useState } from "react"
import AdvancedSOSButton from "../components/AdvancedSOSButton"
import EventCard from "../components/EventCard"
import ConfirmationDialog from "../components/ConfirmationDialog"
import { useAppContext } from "../context/AppContext"

function HomePage() {
  const { sosRequest, navigateTo, logout } = useAppContext()
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
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-black to-zinc-900 text-white p-4">
      <div className="absolute top-4 right-4">
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
      <h1 className="text-2xl font-bold mb-8 text-white">Volunteer SOS Response</h1>

      {sosRequest ? (
        <EventCard request={sosRequest} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <AdvancedSOSButton />
        </div>
      )}

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

export default HomePage

