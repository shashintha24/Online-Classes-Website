# ElectroPhysics Frontend (Vite + React)

## Run locally

Install dependencies:

```bash
npm install
```

Create `.env` in this folder:

```env
VITE_API_BASE_URL=http://localhost:8081
```

Start dev server:

```bash
npm run dev
```

## Deploy on Vercel using GitHub

1. Push your repository to GitHub.
2. In Vercel, click New Project and import the GitHub repository.
3. Choose one deployment style:
	- Repo root deployment (recommended in this repo): Vercel automatically uses root `vercel.json`.
	- Frontend folder deployment: set Root Directory to `frontend` so `frontend/vercel.json` is used.
4. Add environment variable:
	- `VITE_API_BASE_URL=https://online-classes-website-production.up.railway.app`
5. Deploy.

For SPA routes, this project uses an index fallback in `vercel.json`.
