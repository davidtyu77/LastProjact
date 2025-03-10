"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("login") // Start with login page
  const [sosRequest, setSosRequest] = useState(null)
  const [stompClient, setStompClient] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [user, setUser] = useState(null) // Add user state
  const [activeSosRequests, setActiveSosRequests] = useState([]) // Add active SOS requests
  const [acceptedSosRequests, setAcceptedSosRequests] = useState([]) // Add accepted SOS requests

  // Mock data for active SOS requests
  useEffect(() => {
    if (user && user.role === "volunteer") {
      // Add some mock data for volunteer view
      setActiveSosRequests([
        {
          id: "sos1",
          category: "Medical",
          urgency: "Emergency",
          details: "Having chest pain and difficulty breathing",
          useCurrentLocation: true,
          status: "pending",
          createdAt: new Date().toISOString(),
          user: {
            id: "user1",
            name: "John Doe",
            email: "john@example.com",
          },
        },
        {
          id: "sos2",
          category: "Vehicle Repair",
          urgency: "Urgent",
          details: "Car broke down on highway, need assistance",
          useCurrentLocation: true,
          status: "pending",
          createdAt: new Date().toISOString(),
          user: {
            id: "user2",
            name: "Jane Smith",
            email: "jane@example.com",
          },
        },
        {
          id: "sos3",
          category: "Home Repair",
          urgency: "Not Urgent",
          details: "Water leak in bathroom, need plumbing help",
          useCurrentLocation: false,
          status: "pending",
          createdAt: new Date().toISOString(),
          user: {
            id: "user3",
            name: "Bob Johnson",
            email: "bob@example.com",
          },
        },
      ])
    }
  }, [user])

  // Initialize WebSocket connection
  useEffect(() => {
    // This would be replaced with your actual WebSocket server URL
    const socket = new SockJS("http://localhost:8080/ws")
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    client.onConnect = () => {
      setIsConnected(true)

      // Subscribe to SOS updates
      client.subscribe("/topic/sos-updates", (message) => {
        const receivedUpdate = JSON.parse(message.body)
        // Update the SOS request with the received data
        setSosRequest((prev) => {
          if (prev && prev.id === receivedUpdate.id) {
            return { ...prev, ...receivedUpdate }
          }
          return prev
        })
      })
    }

    client.onDisconnect = () => {
      setIsConnected(false)
    }

    client.activate()
    setStompClient(client)

    return () => {
      if (client) {
        client.deactivate()
      }
    }
  }, [])

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  // Handle login
  const login = (userData) => {
    setUser(userData)
    navigateTo("home")
  }

  // Handle logout
  const logout = () => {
    setUser(null)
    setSosRequest(null)
    setAcceptedSosRequests([])
    navigateTo("login")
  }

  // Accept an SOS request (for volunteers)
  const acceptSosRequest = (requestId) => {
    const requestToAccept = activeSosRequests.find((req) => req.id === requestId)

    if (requestToAccept) {
      // Add to accepted requests
      setAcceptedSosRequests((prev) => [...prev, requestToAccept])

      // Remove from active requests
      setActiveSosRequests((prev) => prev.filter((req) => req.id !== requestId))

      // In a real app, you would notify the server about the acceptance
      if (stompClient && isConnected) {
        stompClient.publish({
          destination: "/app/accept-sos",
          body: JSON.stringify({
            requestId,
            volunteerId: user.id,
            volunteerName: user.name,
            volunteerEmail: user.email,
          }),
        })
      }

      // For demo purposes, simulate the server sending back an update to the user
      // In a real app, this would come from the WebSocket server
      if (requestToAccept.user.id === "user1") {
        // This is just for demo - in a real app, the server would send this to the correct user
        setTimeout(() => {
          setSosRequest((prev) => {
            if (prev) {
              return {
                ...prev,
                volunteer: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              }
            }
            return prev
          })
        }, 1000)
      }
    }
  }

  const createSosRequest = (requestData) => {
    // Generate a unique ID for the request
    const newRequest = {
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      ...requestData,
    }

    setSosRequest(newRequest)

    // Send the SOS request via WebSocket
    if (stompClient && isConnected) {
      stompClient.publish({
        destination: "/app/send-sos",
        body: JSON.stringify(newRequest),
      })
    }

    navigateTo("home")
  }

  const updateSosRequest = (updatedData) => {
    setSosRequest((prev) => {
      const updated = { ...prev, ...updatedData }

      // Send the updated SOS request via WebSocket
      if (stompClient && isConnected) {
        stompClient.publish({
          destination: "/app/update-sos",
          body: JSON.stringify(updated),
        })
      }

      return updated
    })
  }

  const cancelSosRequest = () => {
    if (sosRequest) {
      const cancelledRequest = { ...sosRequest, status: "cancelled" }

      // Send the cancellation via WebSocket
      if (stompClient && isConnected) {
        stompClient.publish({
          destination: "/app/cancel-sos",
          body: JSON.stringify(cancelledRequest),
        })
      }

      setSosRequest(null)
    }
  }

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        sosRequest,
        createSosRequest,
        updateSosRequest,
        cancelSosRequest,
        isConnected,
        user,
        login,
        logout,
        activeSosRequests,
        acceptedSosRequests,
        acceptSosRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

