import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom"

import Home from "./pages/home/Home"
import LoginPage from "./pages/home/Login"
import Layout from "./layout/Dashboard"
import Dashboard from "./pages/dashboard/Page"
import Article from "./pages/home/Article"
import MyProfile from "./pages/dashboard/MyProfile"
import SettingsPage from "./pages/dashboard/Settings"
import UserPage from "./pages/home/User"

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/:username" element={<UserPage />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/posts/:id" element={<Article />} />
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