import React, { useEffect, useState } from "react";
import axios from "axios";

import "react-big-calendar/lib/css/react-big-calendar.css";
import ClassroomDetails from "../components/classroom/ClassroomDetails";



export default function StudentPage() {

  const classroomId = 4;

  const [classroom, setclassroom] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
   // Map of time slots
   const slotTimesMorning = {
    S1: { label: "S1", start: "08:30", end: "10:00" },
    S2: { label: "S2", start: "10:10", end: "11:40" },
    S3: { label: "S3", start: "11:50", end: "13:20" },
   
  };

   // 30 min lunch break after S3
 
   const slotTimesEvening = {
 
    S4: { label: "S4", start: "13:50", end: "15:20" },
    S5: { label: "S5", start: "15:30", end: "17:00" },
    S6: { label: "S6", start: "17:10", end: "18:40" },
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // random color generator (pastel colors)
const getRandomColor = () => {
  const colors = [
      // Blues
      "bg-blue-400", "bg-blue-500", "bg-sky-400", "bg-sky-600",
      // Greens
      "bg-green-400", "bg-green-500", "bg-emerald-500", "bg-teal-500",
      // Purples
      "bg-purple-400", "bg-purple-600", "bg-violet-500", "bg-indigo-500",
      // Reds & Oranges
      "bg-red-400", "bg-red-500", "bg-orange-400", "bg-orange-500",
      // Yellows
      "bg-yellow-400", "bg-amber-400", "bg-amber-500",
      // Pinks
      "bg-pink-400", "bg-rose-500", "bg-fuchsia-500",
      // Cool neutrals
      "bg-cyan-400", "bg-cyan-600", "bg-lime-400",
    ];
  return colors[Math.floor(Math.random() * colors.length)];
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const classroomRes = await axios.get(
          `http://localhost:8081/classroom/${classroomId}`,
          { headers }
        );
        setclassroom(classroomRes.data);

        const sessionsRes = await axios.get(
          `http://localhost:8081/classroom/${classroomId}/sessions`,
          { headers }
        );
        setSessions(sessionsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load classroom or sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classroomId]);

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <>
      <ClassroomDetails id={4}/>
    
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Weekly Schedule
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-center">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-2 w-24">Time</th>
                {days.map((day) => (
                  <th key={day} className="border p-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.values(slotTimesMorning).map((slot) => (
                <tr key={slot.label} className="hover:bg-gray-50">
                  <td className="border p-2 font-medium text-gray-700">
                    {slot.start} – {slot.end}
                  </td>
                  {days.map((day) => {
                    const session = sessions.find(
                      (s) => s.day === day && s.time === slot.label
                    );
                    return (
                      <td key={day} className="border p-2 h-20 align-top">
                        {session ? (
                          <div className={`${getRandomColor()} text-white rounded-lg p-2 shadow text-sm`}>
                            <div className="font-semibold">
                              {session.subject}
                            </div>
                            <div className="text-xs opacity-90">
                              Room: {session.room}
                            </div>
                            <div className="text-xs opacity-90">
                              Class: {session.classroom?.name || "-"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Lunch break row */}
              <tr className="bg-yellow-50">
                <td className="border p-2 text-gray-700 font-medium">
                  13:20 – 13:50
                </td>
                <td
                  colSpan={days.length}
                  className="border p-2 text-gray-700 italic"
                >
                  Lunch Break
                </td>
              </tr>
             
              {Object.values(slotTimesEvening).map((slot) => (
                <tr key={slot.label} className="hover:bg-gray-50">
                  <td className="border p-2 font-medium text-gray-700">
                    {slot.start} – {slot.end}
                  </td>
                  {days.map((day) => {
                    const session = sessions.find(
                      (s) => s.day === day && s.time === slot.label
                    );
                    return (
                      <td key={day} className="border p-2 h-20 align-top">
                        {session ? (
                          <div className={`${getRandomColor()} text-white rounded-lg p-2 shadow text-sm`}>
                            <div className="font-semibold">
                              {session.subject}
                            </div>
                            <div className="text-xs opacity-90">
                              Room: {session.room}
                            </div>
                            <div className="text-xs opacity-90">
                              Class: {session.classroom?.name || "-"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    
    </>
  );
}