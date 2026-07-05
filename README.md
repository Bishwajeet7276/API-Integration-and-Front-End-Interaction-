# API Integration and Front-End Interaction

Small demo project for Level 3: a minimal Express REST API with a static front end.

## Project structure

- `server.js` - Express server exposing REST endpoints under `/api/items` and serving `public/`.
- `data/items.json` - JSON file used as a simple persistent store.
- `public/` - Static front-end files: `index.html`, `app.js`, `styles.css`.
- `package.json` - Node project manifest (uses CommonJS).

## Prerequisites

- Node.js (v14+ recommended)

## Install and run locally

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
node server.js
```

3. Open the app in your browser:

```
http://localhost:3000
```

The server provides a simple REST API:

- `GET /api/items` — list items
- `POST /api/items` — create item (JSON body: `title`, `description`, `completed`)
- `PUT /api/items/:id` — update item
- `DELETE /api/items/:id` — delete item

Data is stored in `data/items.json`. This is a lightweight demo — for production use a real database.

## Uploading to GitHub

Create a repository on GitHub (use the web UI). Then run these commands from the project root to push:

```bash
# initialize git (if you haven't already)
git init

# add files and commit
git add .
git commit -m "Initial commit"

# add remote (replace with your repo URL)
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

If you already have a remote or use SSH, replace the `origin` URL accordingly.

## Stopping the server

If the server was started in a terminal, press `Ctrl+C` to stop it. Or on PowerShell you can run:

```powershell
Get-Process node
Stop-Process -Id <PID>
```

## Notes

- This project is intentionally simple for learning RESTful APIs and front-end integration.
- Feel free to expand it with authentication, a database, or tests.
