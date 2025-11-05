import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="p-6">
      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'courses', name: 'Cours' },
            { id: 'teachers', name: 'Enseignants' },
            { id: 'students', name: 'Étudiants' },
            { id: 'rooms', name: 'Salles' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-6">
        {activeTab === 'courses' && <CoursesManagement />}
        {activeTab === 'teachers' && <TeachersManagement />}
        {activeTab === 'students' && <StudentsManagement />}
        {activeTab === 'rooms' && <RoomsManagement />}
      </div>
    </div>
  );
}

// Composants temporaires pour chaque onglet
function CoursesManagement() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Gestion des Cours</h3>
      <p className="text-gray-600">Interface de gestion des cours à implémenter</p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
        Ajouter un cours
      </button>
    </div>
  );
}

function TeachersManagement() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Gestion des Enseignants</h3>
      <p className="text-gray-600">Interface de gestion des enseignants à implémenter</p>
    </div>
  );
}

function StudentsManagement() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Gestion des Étudiants</h3>
      <p className="text-gray-600">Interface de gestion des étudiants à implémenter</p>
    </div>
  );
}

function RoomsManagement() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Gestion des Salles</h3>
      <p className="text-gray-600">Interface de gestion des salles à implémenter</p>
    </div>
  );
}