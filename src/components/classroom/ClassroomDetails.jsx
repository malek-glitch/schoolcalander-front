import React, { useEffect, useState } from "react";
import axios from "axios";


export default function ClassroomDetails( {id} ) {

  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `${token}` };

        const [classroomRes, studentsRes] = await Promise.all([
          axios.get(`http://localhost:8081/classroom/${id}`, { headers }),
          axios.get(`http://localhost:8081/classroom/${id}/students`, {
            headers,
          }),
        ]);

        setClassroom(classroomRes.data);
        setStudents(studentsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load classroom information.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading classroom details...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!classroom) {
    return <div className="text-gray-600 text-center mt-4">No data found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Classroom Info */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {classroom.name}
        </h1>
        <p className="text-gray-600">{classroom.description}</p>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Students ({students.length})
        </h2>
        {students.length === 0 ? (
          <p className="text-gray-500 italic">No students in this classroom.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 font-medium text-gray-700">Full Name</th>
                <th className="p-3 font-medium text-gray-700">Username</th>
                <th className="p-3 font-medium text-gray-700">Email</th>
                <th className="p-3 font-medium text-gray-700">Phone</th>
                <th className="p-3 font-medium text-gray-700">Gender</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3">{student.fullName}</td>
                  <td className="p-3 text-gray-700">{student.username}</td>
                  <td className="p-3 text-gray-700">{student.email}</td>
                  <td className="p-3 text-gray-700">{student.phone}</td>
                  <td className="p-3 text-gray-700">{student.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
