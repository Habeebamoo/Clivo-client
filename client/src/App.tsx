import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom"

import WelcomePage from "./pages/index/WelcomePage"
import SignInPage from "./pages/index/SignIn"
import HomeLayout from "./layout/Home"
import AdminLayout from "./layout/Admin"
import Home from "./pages/home/Page"
import Article from "./pages/index/Article"
import MyProfile from "./pages/home/MyProfile"
import SettingsPage from "./pages/home/Settings"
import UserPage from "./pages/index/User"
import InterestsPage from "./pages/index/Interests"
import Admin from "./pages/admin/Page"
import NotFoundPage from "./pages/index/NotFoundPage"
import ErrorPage from "./pages/index/ErrorPage"
import CreateArticle from "./pages/home/CreateArticle"
import { ToastContainer } from "react-toastify"
import ErrorElement from "./components/ErrorElement"

const App = () => {
  const router = createBrowserRouter( 
    createRoutesFromElements(
      <>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/interests" element={<InterestsPage />} />
        <Route path="/auth/error" element={<ErrorPage />} />

        {/* Home (Protected) */}
        <Route path="/home" element={<HomeLayout />} errorElement={<ErrorElement to="/signin" />}>
          <Route path="" element={<Home />} />
          <Route path="create" element={<CreateArticle />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin (Protected) */}
        <Route path="/admin" element={<AdminLayout />} errorElement={<ErrorElement to="/admin" />}>
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
      <ToastContainer position="top-center" />
    </>
  )
}

export default App