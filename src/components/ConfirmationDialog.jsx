import React from 'react'

function ConfirmationDialog({ title, message, onConfirm, onCancel, details }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 text-white rounded-lg shadow-xl max-w-md w-full border border-zinc-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
          <p className="text-gray-300 mb-4">{message}</p>

          {details && (
            <div className="bg-zinc-900 p-4 rounded-md mb-4 border border-zinc-700">
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <span className="font-medium text-gray-300">{key}: </span>
                  <span className="text-gray-400">{value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-zinc-600 rounded-md text-gray-300 hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog