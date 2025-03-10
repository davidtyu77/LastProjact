"use client"

function UserProfileModal({ user, onClose, isVolunteer = false }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-800 text-white rounded-lg shadow-xl max-w-md w-full border border-zinc-700">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold">{isVolunteer ? "Volunteer Profile" : "User Profile"}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col items-center mb-4">
                        <div
                            className={`w-20 h-20 ${isVolunteer ? "bg-green-600" : "bg-blue-600"} rounded-full flex items-center justify-center text-white text-2xl mb-3`}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="text-xl font-medium">{user.name}</h4>
                        <p className="text-gray-400">{user.email}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="bg-zinc-900 p-3 rounded-md">
                            <div className="text-sm text-gray-400 mb-1">Phone Number</div>
                            <div>+1 (555) 123-4567</div>
                        </div>

                        {isVolunteer ? (
                            <>
                                <div className="bg-zinc-900 p-3 rounded-md">
                                    <div className="text-sm text-gray-400 mb-1">Specialization</div>
                                    <div>First Aid, CPR, Mechanics</div>
                                </div>

                                <div className="bg-zinc-900 p-3 rounded-md">
                                    <div className="text-sm text-gray-400 mb-1">Experience</div>
                                    <div>5+ years as emergency responder</div>
                                </div>

                                <div className="bg-zinc-900 p-3 rounded-md">
                                    <div className="text-sm text-gray-400 mb-1">Response Time</div>
                                    <div>Estimated arrival: 15-20 minutes</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-zinc-900 p-3 rounded-md">
                                    <div className="text-sm text-gray-400 mb-1">Address</div>
                                    <div>123 Main Street, Anytown, USA</div>
                                </div>

                                <div className="bg-zinc-900 p-3 rounded-md">
                                    <div className="text-sm text-gray-400 mb-1">Medical Information</div>
                                    <div>No known allergies</div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileModal

