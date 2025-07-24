import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import DashboardLayout from './pages/Dashboard'
import PrivateRoute from './pages/PrivateRoute'

import './App.css'
import Courses from './pages/dashboard/Courses'

function App() {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* <Route path="/" element={<Home />} >
          <Route path="dashboard" element={<Dashboard />} />
        </Route> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
