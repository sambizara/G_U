import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const dashboardByRole = { ADMIN: '/admin', SCOLARITE: '/scolarite', ENSEIGNANT: '/enseignant', ETUDIANT: '/etudiant' };

function errorMessage(error) {
  const status = error.response?.status;
  if (status === 401) return 'Adresse e-mail ou mot de passe incorrect.';
  if (status === 403) return 'Ce compte est désactivé. Contactez la scolarité.';
  if (status === 422) {
    const errors = error.response?.data?.errors;
    return errors ? Object.values(errors).flat().join(' ') : 'Vérifiez les informations saisies.';
  }
  return error.response?.data?.message || error.message || 'Connexion impossible. Réessayez.';
}

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={dashboardByRole[user.role] || '/acces-refuse'} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedUser = await login(email.trim(), password);
      const destination = dashboardByRole[loggedUser.role] || '/acces-refuse';
      const requested = location.state?.from;
      navigate(requested && requested.pathname !== '/connexion' ? requested.pathname : destination, { replace: true });
    } catch (loginError) {
      setError(errorMessage(loginError));
    } finally { setSubmitting(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-100 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-teal-700 text-lg font-bold text-white">GU</div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestion universitaire</h1>
          <p className="mt-2 text-sm text-slate-500">Connectez-vous à votre espace</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Adresse e-mail</label>
            <input id="email" name="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" placeholder="nom@universite.com" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Mot de passe</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" placeholder="Votre mot de passe" />
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}
          <button disabled={submitting} type="submit" className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Connexion…' : 'Se connecter'}</button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">Accès réservé aux membres de l’université</p>
        <Link className="sr-only" to="/connexion">Connexion</Link>
      </section>
    </main>
  );
}
