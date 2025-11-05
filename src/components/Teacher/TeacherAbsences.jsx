import { useState } from 'react';

export default function TeacherAbsences() {
  const [absences] = useState([
    { id: 1, student: 'Jean Dupont', course: 'Mathématiques', date: '2024-01-15', justified: false },
    { id: 2, student: 'Marie Martin', course: 'Physique', date: '2024-01-16', justified: true },
    { id: 3, student: 'Pierre Lambert', course: 'Informatique', date: '2024-01-17', justified: false }
  ]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Absences des Étudiants</h3>
      <div className="space-y-3">
        {absences.map(absence => (
          <div key={absence.id} className="flex justify-between items-center border border-gray-200 rounded-lg p-3">
            <div>
              <p className="font-medium text-gray-900">{absence.student}</p>
              <p className="text-sm text-gray-600">{absence.course} - {absence.date}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${
              absence.justified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {absence.justified ? 'Justifiée' : 'Non justifiée'}
            </span>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full bg-gray-600 text-white py-2 rounded-md">
        Voir toutes les absences
      </button>
    </div>
  );
}