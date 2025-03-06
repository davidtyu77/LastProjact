"use client"

import { useAppContext } from "../context/AppContext"

function ProfilePage() {
  const { user, logout, navigateTo } = useAppContext()

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-white text-xl">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-lg font-medium">{user?.name || "User"}</h2>
            <p className="text-gray-500">{user?.role === "volunteer" ? "Volunteer" : "Regular User"}</p>
            <p className="text-gray-500">Member since Jan 2023</p>
          </div>
        </div>

        <button className="text-blue-600 text-sm">Edit Profile</button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-medium mb-3">Contact Information</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Phone</span>
            <span>(555) 123-4567</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span>{user?.email || "john.doe@example.com"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Address</span>
            <span>123 Main St, Anytown, USA</span>
          </div>
        </div>
      </div>

      {user?.role !== "volunteer" && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-medium mb-3">Emergency Contacts</h2>
          <div className="space-y-4">
            <div className="border-b pb-2">
              <div className="font-medium">Jane Doe</div>
              <div className="text-gray-500">Relationship: Spouse</div>
              <div className="text-gray-500">(555) 987-6543</div>
            </div>
            <div>
              <div className="font-medium">Michael Smith</div>
              <div className="text-gray-500">Relationship: Friend</div>
              <div className="text-gray-500">(555) 456-7890</div>
            </div>
          </div>
          <button className="mt-4 text-blue-600 text-sm">Add Emergency Contact</button>
        </div>
      )}

      {user?.role === "volunteer" && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-medium mb-3">Volunteer Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Skills</span>
              <span>First Aid, CPR, Mechanics</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Availability</span>
              <span>Weekdays, Evenings</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Response Area</span>
              <span>15 mile radius</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          logout()
          navigateTo("login")
        }}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md transition duration-200"
      >
        Sign Out
      </button>
    </div>
  )
}

export default ProfilePage

