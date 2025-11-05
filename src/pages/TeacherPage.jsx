import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/sidebar/sidebar";
import SessionModal from "../components/Shared/SessionModal";
import Header from "../components/Layout/Header";

import "react-big-calendar/lib/css/react-big-calendar.css";

export default function TeacherDashboard() {
  const { id } = useParams();
  const teacherId = Number(id);

  const [teacher, setTeacher] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSessionDetails, setSelectedSessionDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Filters
  const sessionOptions = ["S1", "S2", "S3", "S4", "S5", "S6"];
  const defaultDay = useMemo(() => {
    const map = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = map[new Date().getDay()];
    return days.includes(today) ? today : "Monday";
  }, [days]);

  const [filterType, setFilterType] = useState("week"); // "week" | "day" | "month" | "session"
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [selectedSession, setSelectedSession] = useState("S1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const teacherRes = await axios.get(
          `http://localhost:8081/teacher/${teacherId}`,
          { headers }
        );
        setTeacher(teacherRes.data);

        const sessionsRes = await axios.get(
          `http://localhost:8081/teacher/${teacherId}/sessions`,
          { headers }
        );
        setSessions(sessionsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load teacher or sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  // restore filters from URL/localStorage on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedFilter = params.get("view") || localStorage.getItem("teacherFilterType");
    const savedDay = params.get("day") || localStorage.getItem("teacherSelectedDay");
    const savedSession = params.get("session") || localStorage.getItem("teacherSelectedSession");
    if (savedFilter && ["week","day","month","session"].includes(savedFilter)) {
      setFilterType(savedFilter);
    }
    if (savedDay && days.includes(savedDay)) {
      setSelectedDay(savedDay);
    }
    if (savedSession && ["S1","S2","S3","S4","S5","S6"].includes(savedSession)) {
      setSelectedSession(savedSession);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist filters to URL and localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("view", filterType);
    if (filterType === "day") {
      params.set("day", selectedDay);
      params.delete("session");
    } else if (filterType === "session") {
      params.set("session", selectedSession);
      params.delete("day");
    } else {
      params.delete("day");
      params.delete("session");
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);

    localStorage.setItem("teacherFilterType", filterType);
    localStorage.setItem("teacherSelectedDay", selectedDay);
    localStorage.setItem("teacherSelectedSession", selectedSession);
  }, [filterType, selectedDay, selectedSession, days]);

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (error) return (
    <div className="p-4 text-red-500">
      <div className="mb-2">{error}</div>
      <button
        className="px-3 py-2 rounded-md bg-red-600 text-white"
        onClick={() => {
          setLoading(true);
          setError(null);
          // retry same fetch logic
          (async () => {
            try {
              const token = localStorage.getItem("token");
              const headers = token ? { Authorization: `Bearer ${token}` } : {};
              const teacherRes = await axios.get(`http://localhost:8081/teacher/${teacherId}`, { headers });
              setTeacher(teacherRes.data);
              const sessionsRes = await axios.get(`http://localhost:8081/teacher/${teacherId}/sessions`, { headers });
              setSessions(sessionsRes.data);
            } catch (err) {
              console.error(err);
              setError("Failed to load teacher or sessions");
            } finally {
              setLoading(false);
            }
          })();
        }}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-0 bg-gray-50 min-h-screen">
      <Header
        title={teacher ? `${teacher.name}` : "Teacher Dashboard"}
        subtitle={teacher ? teacher.department : ""}
        meta={teacher ? [
          { label: "Email", value: teacher.email },
          { label: "Phone", value: teacher.phone },
        ] : []
      }
      rightContent={
        <button className="px-3 py-2 rounded-md bg-blue-600 text-white" onClick={() => {
          setIsModalOpen(true);
        }}>
          Add Session
        </button>
      }
      />

      <div className="px-6 pb-6 flex flex-row w-full gap-4">
        <Sidebar
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          selectedDay={selectedDay}
          onDayChange={setSelectedDay}
          selectedSession={selectedSession}
          onSessionChange={setSelectedSession}
          days={days}
          sessionOptions={sessionOptions}
          onToday={() => {
            setFilterType("day");
            setSelectedDay(defaultDay);
          }}
          onReset={() => {
            setFilterType("week");
            setSelectedDay(defaultDay);
            setSelectedSession("S1");
          }}
        />
        <div className="w-full">
          {scheduleTable()}
        </div>
      </div>

      <SessionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={selectedSessionDetails}
      />
    </div>
  );

  // stable color per subject (pastel-like tailwind classes)
  function getStableColorForSubject(subject) {
    const colors = [
      "bg-blue-400", "bg-blue-500", "bg-sky-400", "bg-sky-600",
      "bg-green-400", "bg-green-500", "bg-emerald-500", "bg-teal-500",
      "bg-purple-400", "bg-purple-600", "bg-violet-500", "bg-indigo-500",
      "bg-red-400", "bg-red-500", "bg-orange-400", "bg-orange-500",
      "bg-yellow-400", "bg-amber-400", "bg-amber-500",
      "bg-pink-400", "bg-rose-500", "bg-fuchsia-500",
      "bg-cyan-400", "bg-cyan-600", "bg-lime-400",
    ];
    if (!subject) return colors[0];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      hash = (hash * 31 + subject.charCodeAt(i)) >>> 0;
    }
    const index = hash % colors.length;
    return colors[index];
  }

  function scheduleTable() {
    const morningSlots = Object.values(slotTimesMorning);
    const eveningSlots = Object.values(slotTimesEvening);

    const filteredMorning =
      filterType === "session"
        ? morningSlots.filter((s) => s.label === selectedSession)
        : morningSlots;

    const filteredEvening =
      filterType === "session"
        ? eveningSlots.filter((s) => s.label === selectedSession)
        : eveningSlots;

    // Determine which days to render
    const visibleDays =
      filterType === "day" ? [selectedDay] : days;

    // Note: "month" currently shows the same weekly layout until date-based data is available.
    function handleExportCSV() {
      const headers = ["Day", "Time", "Start", "End", "Subject", "Room", "Class"]; 
      const rows = sessions.map((s) => {
        const slot = slotTimesMorning[s.time] || slotTimesEvening[s.time] || { start: "", end: "" };
        return [
          s.day,
          s.time,
          slot.start,
          slot.end,
          s.subject,
          s.room,
          s.classroom?.name || "-",
        ];
      });
      const csv = [headers, ...rows].map((r) => r.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "teacher-schedule.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function handlePrint() {
      window.print();
    }

    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {filterType === "day" ? `Schedule — ${selectedDay}` :
             filterType === "session" ? `Schedule — ${selectedSession}` :
             filterType === "month" ? "Schedule — Month (weekly layout)" :
             "Weekly Schedule"}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={handleExportCSV} className="px-3 py-2 rounded-md border text-gray-700">Export CSV</button>
            <button onClick={handlePrint} className="px-3 py-2 rounded-md bg-gray-800 text-white">Print</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-center">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-2 w-24">Time</th>
                {visibleDays.map((day) => (
                  <th key={day} className="border p-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMorning.map((slot) => (
                <tr key={slot.label} className="hover:bg-gray-50">
                  <td className="border p-2 font-medium text-gray-700">
                    {slot.start} – {slot.end}
                  </td>
                  {visibleDays.map((day) => {
                    const session = sessions.find(
                      (s) => s.day === day && s.time === slot.label
                    );
                    return (
                      <td key={day} className="border p-2 h-20 align-top">
                        {session ? (
                          <div
                            className={`${getStableColorForSubject(session.subject)} text-white rounded-lg p-2 shadow text-sm cursor-pointer`}
                            onClick={() => {
                              setSelectedSessionDetails(session);
                              setIsModalOpen(true);
                            }}
                          >
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
                  colSpan={visibleDays.length}
                  className="border p-2 text-gray-700 italic"
                >
                  Lunch Break
                </td>
              </tr>

              {filteredEvening.map((slot) => (
                <tr key={slot.label} className="hover:bg-gray-50">
                  <td className="border p-2 font-medium text-gray-700">
                    {slot.start} – {slot.end}
                  </td>
                  {visibleDays.map((day) => {
                    const session = sessions.find(
                      (s) => s.day === day && s.time === slot.label
                    );
                    return (
                      <td key={day} className="border p-2 h-20 align-top">
                        {session ? (
                          <div
                            className={`${getStableColorForSubject(session.subject)} text-white rounded-lg p-2 shadow text-sm cursor-pointer`}
                            onClick={() => {
                              setSelectedSessionDetails(session);
                              setIsModalOpen(true);
                            }}
                          >
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
    );
  }
}