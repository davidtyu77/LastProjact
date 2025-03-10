function SettingsPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-3">Notification Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Push Notifications</span>
              <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Email Alerts</span>
              <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">SMS Notifications</span>
              <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-3">Privacy Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Share Location</span>
              <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Share Profile with Volunteers</span>
              <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-3">App Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Dark Mode</span>
              <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Sound Effects</span>
              <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

