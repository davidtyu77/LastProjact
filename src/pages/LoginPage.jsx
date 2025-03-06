"use client"

import { useState } from "react"
import { useAppContext } from "../context/AppContext"

function LoginPage() {
    const { login } = useAppContext()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("user")
    const [error, setError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        // Basic validation
        if (!email || !password) {
            setError("Please enter both email and password")
            return
        }

        // In a real app, you would authenticate with a server
        // For demo purposes, we'll just use the email and role
        login({
            email,
            role,
            name: email.split("@")[0], // Use part of email as name for demo
            id: Date.now().toString(), // Generate a fake ID
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold">SOS Volunteer Response</h1>
                    <p className="text-gray-400 mt-2">Sign in to continue</p>
                </div>

                <div className="bg-zinc-800 rounded-lg shadow-xl p-6 border border-zinc-700">
                    {error && (
                        <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={role === "user"}
                                        onChange={() => setRole("user")}
                                        className="form-radio text-blue-600"
                                    />
                                    <span>User</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={role === "volunteer"}
                                        onChange={() => setRole("volunteer")}
                                        className="form-radio text-blue-600"
                                    />
                                    <span>Volunteer</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <a href="#" className="text-blue-400 hover:text-blue-300">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-gray-400">
                        Don't have an account?{" "}
                        <a href="#" className="text-blue-400 hover:text-blue-300">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage

