import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import { useAuth } from './auth/AuthContext';
import DashboardPage from './pages/DashboardPage';
import ForbiddenPage from './pages/ForbiddenPage';
import LoginPage from './pages/LoginPage';

const dashboardRoutes = [
  { path: 'admin', role: 'ADMIN' },
  { path: 'scolarite', role: 'SCOLARITE' },
  { path: 'enseignant', role: 'ENSEIGNANT' },
  { path: 'etudiant', role: 'ETUDIANT' },
];

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-slate-600">Chargement…</div>;
  const paths = { ADMIN: '/admin', SCOLARITE: '/scolarite', ENSEIGNANT: '/enseignant', ETUDIANT: '/etudiant' };
  return <Navigate to={user ? paths[user.role] || '/acces-refuse' : '/connexion'} replace />;
}

export default function App() {
  return <Routes>
    <Route path="/connexion" element={<LoginPage />} />
    <Route path="/acces-refuse" element={<ForbiddenPage />} />
    <Route element={<ProtectedRoute />}>
      {dashboardRoutes.map(({ path, role }) => <Route key={path} path={`/${path}`} element={<ProtectedRoute roles={[role]} />}><Route index element={<DashboardPage />} /></Route>)}
    </Route>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="*" element={<HomeRedirect />} />
  </Routes>;
}
