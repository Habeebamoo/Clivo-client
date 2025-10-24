import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom"

import Home from "./pages/home/Home"
import LoginPage from "./pages/home/Login"
import DashboardLayout from "./layout/Dashboard"
import AdminLayout from "./layout/Admin"
import Dashboard from "./pages/dashboard/Page"
import Article from "./pages/home/Article"
import MyProfile from "./pages/dashboard/MyProfile"
import SettingsPage from "./pages/dashboard/Settings"
import UserPage from "./pages/home/User"
import InterestsPage from "./pages/home/Interests"
import Admin from "./pages/admin/Page"
import NotFoundPage from "./pages/home/NotFoundPage"

const App = () => {
  const router = createBrowserRouter( 
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/interests" element={<InterestsPage />} />

        {/* Dashboard (Protected) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin (Protected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Admin />} />
        </Route>

        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/:title" element={<Article />} />
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App