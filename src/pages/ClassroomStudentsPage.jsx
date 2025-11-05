import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Layout/Header";

export default function ClassroomStudentsPage() {
  const { id } = useParams();
  const classroomId = Number(id);
  const [students, setStudents] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [studentsRes, classroomRes] = await Promise.all([
          axios.get(`http://localhost:8081/classroom/${classroomId}/students`, { headers }),
          axios.get(`http://localhost:8081/classroom/${classroomId}`, { headers }),
        ]);
        setStudents(studentsRes.data || []);
        setClassroom(classroomRes.data || null);
      } catch (e) {
        console.error(e);
        setError("Failed to load students for classroom");
      } finally {
        setLoading(false);
      }
    })();
  }, [classroomId]);

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-0 bg-gray-50 min-h-screen">
      <Header
        title={classroom ? `Classroom: ${classroom.name}` : `Classroom #${classroomId}`}
        subtitle="Students"
        rightContent={
          <a href="/dashboard/admin" className="px-3 py-2 rounded-md border text-gray-700">Back to Admin</a>
        }
      />

      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Students</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Full Name</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Gender</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="border p-2">{s.id}</td>
                    <td className="border p-2">{s.fullName || s.username}</td>
                    <td className="border p-2">{s.email}</td>
                    <td className="border p-2">{s.gender}</td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td className="border p-4 text-center text-gray-500" colSpan={4}>No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


