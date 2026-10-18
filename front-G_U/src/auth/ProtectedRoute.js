import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="grid min-h-screen place-items-center text-slate-600">Chargement de votre session…</div>;
  if (!user) return <Navigate to="/connexion" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/acces-refuse" replace />;
  return <Outlet />;
}
