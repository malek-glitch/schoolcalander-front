// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import StudentPage from "./pages/StudentPage.jsx";
import TeacherPage from "./pages/TeacherPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ClassroomStudentsPage from "./pages/ClassroomStudentsPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/dashboard/teacher/:id" element={<TeacherPage/>} />
        <Route path="/dashboard/student/:id" element={<StudentPage/>} />
        <Route path="/dashboard/admin" element={<AdminPage/>} />
        <Route path="/dashboard/admin/classroom/:id/students" element={<ClassroomStudentsPage/>} />
      </Routes>
    </BrowserRouter>
  );
}
