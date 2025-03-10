"use client"

import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import ConfirmationDialog from "./ConfirmationDialog"

function SOSButton() {
  const { navigateTo } = useAppContext()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSOSClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    setShowConfirmation(false)
    navigateTo("sosForm")
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  return (
    <>
      <button
        onClick={handleSOSClick}
        className="sos-button bg-red-600 hover:bg-red-700 text-white font-bold text-4xl rounded-full w-48 h-48 flex items-center justify-center shadow-lg"
      >
        SOS
      </button>

      {showConfirmation && (
        <ConfirmationDialog
          title="Request Help"
          message="Are you sure you want to send an SOS request?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}

export default SOSButton

