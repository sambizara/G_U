import { Link } from 'react-router-dom';
export default function ForbiddenPage() {
  return <main className="grid min-h-screen place-items-center px-6"><section className="text-center"><p className="text-sm font-bold uppercase tracking-wider text-teal-700">Erreur 403</p><h1 className="mt-2 text-3xl font-bold">Accès refusé</h1><p className="mt-3 text-slate-600">Votre compte ne dispose pas des droits nécessaires pour consulter cette page.</p><Link className="mt-6 inline-block rounded-lg bg-teal-700 px-5 py-2.5 font-semibold text-white hover:bg-teal-800" to="/">Retour à mon espace</Link></section></main>;
}
