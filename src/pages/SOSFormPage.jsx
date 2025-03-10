"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAppContext } from "../context/AppContext"
import ConfirmationDialog from "../components/ConfirmationDialog"

function SOSFormPage() {
  const { navigateTo, createSosRequest, sosRequest } = useAppContext()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: sosRequest || {
      category: "Medical",
      urgency: "Not Urgent",
      details: "",
      useCurrentLocation: true,
    },
  })

  const selectedUrgency = watch("urgency")

  const getUrgencyDescription = (urgency) => {
    switch (urgency) {
      case "Not Urgent":
        return "Response time: 6-24 hours"
      case "Urgent":
        return "Response time: Up to 2 hours"
      case "Emergency":
        return "Response time: Less than 30 minutes"
      default:
        return ""
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Not Urgent":
        return "text-green-600"
      case "Urgent":
        return "text-orange-500"
      case "Emergency":
        return "text-red-600"
      default:
        return ""
    }
  }

  const onSubmit = (data) => {
    setFormData(data)
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    createSosRequest(formData)
    setShowConfirmation(false)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
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
        <h1 className="text-xl font-bold">Request Help</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <select
            {...register("category", { required: true })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Medical">Medical</option>
            <option value="Vehicle Repair">Vehicle Repair</option>
            <option value="Home Repair">Home Repair</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">Category is required</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Urgency Level</label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                value="Not Urgent"
                {...register("urgency", { required: true })}
                className="h-5 w-5 text-green-600"
              />
              <span className="ml-2 text-gray-700">Not Urgent</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                value="Urgent"
                {...register("urgency", { required: true })}
                className="h-5 w-5 text-orange-500"
              />
              <span className="ml-2 text-gray-700">Urgent</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                value="Emergency"
                {...register("urgency", { required: true })}
                className="h-5 w-5 text-red-600"
              />
              <span className="ml-2 text-gray-700">Emergency</span>
            </label>
          </div>

          {selectedUrgency && (
            <p className={`mt-2 text-sm ${getUrgencyColor(selectedUrgency)}`}>
              {getUrgencyDescription(selectedUrgency)}
            </p>
          )}

          {errors.urgency && <p className="text-red-500 text-sm mt-1">Urgency level is required</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Additional Details (Optional)</label>
          <textarea
            {...register("details")}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your situation..."
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Location</label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="radio" value="true" {...register("useCurrentLocation")} className="h-5 w-5 text-blue-600" />
              <span className="ml-2 text-gray-700">Use Current Location</span>
            </label>

            <label className="flex items-center">
              <input type="radio" value="false" {...register("useCurrentLocation")} className="h-5 w-5 text-blue-600" />
              <span className="ml-2 text-gray-700">Other Location</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Send Request
        </button>
      </form>

      {showConfirmation && (
        <ConfirmationDialog
          title="Confirm SOS Request"
          message="Please review your request details:"
          details={{
            Category: formData.category,
            Urgency: formData.urgency,
            Details: formData.details || "None provided",
            Location: formData.useCurrentLocation === "true" ? "Current Location" : "Other Location",
            "Phone Number": "(555) 123-4567", // Dummy phone number
          }}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default SOSFormPage

