import { useAppContext } from "./context/AppContext"
import HomePage from "./pages/HomePage"
import SOSFormPage from "./pages/SOSFormPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import HistoryPage from "./pages/HistoryPage"
import BottomNavigation from "./components/BottomNavigation"
import LoginPage from "./pages/LoginPage"
import VolunteerHomePage from "./pages/VolunteerHomePage"

function App() {
  const { currentPage, user } = useAppContext()

  if (currentPage === "login") {
    return <LoginPage />
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        // Show different home page based on user role
        return user?.role === "volunteer" ? <VolunteerHomePage /> : <HomePage />
      case "sosForm":
        return <SOSFormPage />
      case "settings":
        return <SettingsPage />
      case "profile":
        return <ProfilePage />
      case "history":
        return <HistoryPage />
      default:
        return user?.role === "volunteer" ? <VolunteerHomePage /> : <HomePage />
    }
  }

  // Only apply flex-col and bg-gray-50 if not on home page
  const containerClasses = currentPage === "home" ? "flex flex-col h-full" : "flex flex-col h-full bg-gray-50"

  return (
    <div className={containerClasses}>
      <main className="flex-1 overflow-y-auto pb-16">{renderPage()}</main>
      <BottomNavigation />
    </div>
  )
}

export default App

