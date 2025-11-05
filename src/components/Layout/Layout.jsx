import { useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getRoleName = (role) => {
    const roles = {
      'STUDENT': 'Étudiant',
      'TEACHER': 'Enseignant', 
      'ADMIN': 'Administrateur'
    };
    return roles[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Gestion d'Emploi du Temps
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-sm text-gray-700">
                    {user.name} ({getRoleName(user.role)})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Déconnexion
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}