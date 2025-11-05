import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Header from "../components/Layout/Header";

export default function AdminPage() {
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for creating a session
  const [subject, setSubject] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [day, setDay] = useState("Monday");
  const [time, setTime] = useState("S1");
  const [room, setRoom] = useState("I1");
  const [submitting, setSubmitting] = useState(false);

  const days = useMemo(() => [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ], []);

  const sessionOptions = ["S1", "S2", "S3", "S4", "S5", "S6"];
  const roomOptions = [
    "I1","I2","I3","I4","I5","I6","I7","I8","I9","I10","I11","I12","I13"
  ];

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [teachersRes, classroomsRes] = await Promise.all([
          axios.get("http://localhost:8081/teacher", { headers }),
          axios.get("http://localhost:8081/classroom", { headers })
        ]);
        setTeachers(teachersRes.data || []);
        setClassrooms(classroomsRes.data || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleCreateSession(e) {
    e.preventDefault();
    if (!teacherId || !classroomId || !subject) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(
        "http://localhost:8081/session",
        {
          subject,
          day,
          time,
          room,
          classroom: { id: Number(classroomId) },
          teacher: { id: Number(teacherId) },
        },
        { headers }
      );
      setSubject("");
      setDay("Monday");
      setTime("S1");
      setRoom("I1");
      // keep selections of teacher/classroom to accelerate multiple creations
      alert("Session created.");
    } catch (e) {
      console.error(e);
      alert("Failed to create session.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-0 bg-gray-50 min-h-screen">
      <Header
        title="Admin"
        subtitle="Manage teachers, classrooms, and sessions"
      />

      <div className="px-6 pb-6 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Session</h3>
          <form className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4" onSubmit={handleCreateSession}>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Teacher</label>
              <select
                className="w-full border rounded-md p-2"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                required
              >
                <option value="">Select teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name || t.username} (#{t.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Classroom</label>
              <select
                className="w-full border rounded-md p-2"
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                required
              >
                <option value="">Select classroom</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>{c.name || `Classroom #${c.id}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Subject</label>
              <input
                className="w-full border rounded-md p-2"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Day</label>
              <select className="w-full border rounded-md p-2" value={day} onChange={(e) => setDay(e.target.value)}>
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Session</label>
              <select className="w-full border rounded-md p-2" value={time} onChange={(e) => setTime(e.target.value)}>
                {sessionOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Room</label>
              <select className="w-full border rounded-md p-2" value={room} onChange={(e) => setRoom(e.target.value)}>
                {roomOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Session"}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Teachers</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="border p-2 text-left">ID</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="border p-2">
                        <a className="text-blue-600 hover:underline" href={`/dashboard/teacher/${t.id}`}>{t.id}</a>
                      </td>
                      <td className="border p-2">
                        <a className="text-blue-600 hover:underline" href={`/dashboard/teacher/${t.id}`}>{t.name || t.username}</a>
                      </td>
                      <td className="border p-2">{t.email}</td>
                      <td className="border p-2">{t.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Classrooms</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="border p-2 text-left">ID</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {classrooms.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="border p-2">
                        <a className="text-blue-600 hover:underline" href={`/dashboard/admin/classroom/${c.id}/students`}>{c.id}</a>
                      </td>
                      <td className="border p-2">
                        <a className="text-blue-600 hover:underline" href={`/dashboard/admin/classroom/${c.id}/students`}>{c.name}</a>
                      </td>
                      <td className="border p-2">{c.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


