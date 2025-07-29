import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import DashboardLayout from './pages/Dashboard'
import PrivateRoute from './pages/PrivateRoute'

import './App.css'
import Courses from './pages/Courses'
import AllCourses from './pages/user/AllCourses'
import UserLayout from './layouts/UserLayout'
import UserDashboard from './pages/user/UserDashboard'
import MyCourses from './pages/user/MyCourses'
import CourseDetail from './pages/user/CourseDetail'
import CourseLesson from './pages/user/CourseLesson'
import AddLesson from './pages/AddLesson'
import LessonList from './pages/LessonList'
import TeacherList from './pages/TeacherList'

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
          <Route path="lessons" element={<LessonList />} />
          <Route path="add-lesson" element={<AddLesson />} />
          <Route path="profile" element={<Profile />} />
          <Route path="teachers" element={<TeacherList />} />
        </Route>

        <Route element={<UserLayout />}>
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/my-courses/:courseId/:lessonIndex" element={<CourseLesson />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
