export default function Sidebar({
    filterType = "week",
    onFilterTypeChange = () => {},
    selectedDay,
    onDayChange = () => {},
    selectedSession,
    onSessionChange = () => {},
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    sessionOptions = ["S1","S2","S3","S4","S5","S6"],
    onToday = () => {},
    onReset = () => {},
}) {
    return (
        <div className="w-1/4 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Sidebar
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        View
                    </label>
                    <select
                        className="w-full border rounded-md p-2 text-gray-800"
                        value={filterType}
                        onChange={(e) => onFilterTypeChange(e.target.value)}
                    >
                        <option value="week">Week</option>
                        <option value="day">Day</option>
                        <option value="month">Month</option>
                        <option value="session">Session</option>
                    </select>
                </div>

                {filterType === "day" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Day
                        </label>
                        <select
                            className="w-full border rounded-md p-2 text-gray-800"
                            value={selectedDay}
                            onChange={(e) => onDayChange(e.target.value)}
                        >
                            {days.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                )}

                {filterType === "session" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Session
                        </label>
                        <select
                            className="w-full border rounded-md p-2 text-gray-800"
                            value={selectedSession}
                            onChange={(e) => onSessionChange(e.target.value)}
                        >
                            {sessionOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t">
                    <button onClick={onToday} className="px-3 py-2 rounded-md border text-gray-700">Today</button>
                    <button onClick={onReset} className="px-3 py-2 rounded-md bg-gray-800 text-white">Reset</button>
                </div>

                <ul className="space-y-2 pt-2">
                    <li className="text-gray-700">
                        <a href="/dashboard/teacher/1">
                            Dashboard
                        </a>
                    </li>
                    <li className="text-gray-700">
                        <a href="/dashboard/admin">
                            Admin
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}