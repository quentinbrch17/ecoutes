# Écoutes

Petit site statique HTML/CSS pour le carnet d'écoute.

## Lancer le site en local

Dans Terminal :

```bash
cd ~/Documents/ecoutes
python3 -m http.server 8000
```

Puis ouvrir : http://localhost:8000

Pour arrêter le serveur : Ctrl+C.

## Modifier le site

- `index.html` : page d'accueil / liste des albums
- `*.html` : une critique par album
- `style.css` : design global

## Workflow Git recommandé

```bash
git add .
git commit -m "Décris ta modification"
git push
```

Une fois GitHub connecté à Vercel, chaque `git push` sur `main` déclenche automatiquement un nouveau déploiement.
