# Frontend Gestion universitaire

Interface React (Create React App) avec Tailwind CSS pour l'authentification et les premiers espaces par rôle.

## Démarrage

1. Copier `.env.example` vers `.env` puis ajuster `REACT_APP_API_URL` (URL de base de l'API Laravel, par exemple `http://localhost:8000/api`).
2. Installer et démarrer : `npm install`, puis `npm start`.

L'API doit exposer `POST /auth/login`, `GET /auth/me` et `POST /auth/logout` sous ce préfixe. La connexion accepte une réponse contenant `token` et `role`, avec un profil optionnel dans `user` ou `utilisateur`. `GET /auth/me` doit renvoyer le profil courant, directement ou dans `user`/`utilisateur`, et contenir son champ `role` parmi `ADMIN`, `SCOLARITE`, `ENSEIGNANT`, `ETUDIANT`.

Les pages de tableau de bord sont des espaces d'accueil à compléter avec les fonctionnalités métiers. Le jeton est conservé dans `localStorage` pour permettre la restauration de session au rechargement.
