import { useAuth } from '../auth/AuthContext';

const roleNames = { ADMIN: 'Administrateur', SCOLARITE: 'Scolarité', ENSEIGNANT: 'Enseignant', ETUDIANT: 'Étudiant' };

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const label = roleNames[user?.role] || user?.role;
  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"><div><p className="font-bold text-teal-800">Gestion universitaire</p><p className="text-xs text-slate-500">Espace {label}</p></div><button onClick={logout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">Se déconnecter</button></div></header>
      <section className="mx-auto max-w-6xl px-6 py-12"><p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Tableau de bord</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Bienvenue{user?.name ? `, ${user.name}` : ''}</h1><p className="mt-3 text-slate-600">Vous êtes connecté en tant que {label}.</p></section>
    </main>
  );
}
