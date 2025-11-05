import AdminDashboard from '../components/Admin/AdminDashboard';

export default function AdminPage() {
  return (
    <div>
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Administration
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Gestion complète des cours, enseignants et étudiants
        </p>
      </div>
      <AdminDashboard />
    </div>
  );
}