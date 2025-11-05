import React from "react";

export default function SessionModal({ open, onClose = () => {}, session }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800">Session Details</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {session ? (
          <div className="space-y-2 text-sm text-gray-700">
            <div><span className="font-medium">Subject:</span> {session.subject}</div>
            <div><span className="font-medium">Day:</span> {session.day}</div>
            <div><span className="font-medium">Time Slot:</span> {session.time}</div>
            <div><span className="font-medium">Room:</span> {session.room}</div>
            <div><span className="font-medium">Class:</span> {session.classroom?.name || "-"}</div>
            {session.teacher && (
              <div><span className="font-medium">Teacher:</span> {session.teacher.name || "-"}</div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">No session selected.</div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded-md border text-gray-700">Close</button>
        </div>
      </div>
    </div>
  );
}


