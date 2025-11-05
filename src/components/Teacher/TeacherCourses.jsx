import { useState } from 'react';

export default function TeacherCourses() {
  const [courses] = useState([
    { id: 1, name: 'Mathématiques', time: '08:00-10:00', room: 'A101', students: 25 },
    { id: 2, name: 'Physique', time: '10:30-12:30', room: 'B205', students: 20 },
    { id: 3, name: 'Informatique', time: '14:00-16:00', room: 'C301', students: 30 }
  ]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Mes Cours</h3>
      <div className="space-y-4">
        {courses.map(course => (
          <div key={course.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{course.name}</h4>
                <p className="text-sm text-gray-600">{course.time} - Salle {course.room}</p>
                <p className="text-sm text-gray-500">{course.students} étudiants</p>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Détails
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md">
        Ajouter un cours
      </button>
    </div>
  );
}