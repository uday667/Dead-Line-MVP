# Deadline Countdown (React + Vite)

A responsive countdown web app built with React, HTML, CSS, and TypeScript only.

## Features

- Pick a deadline date and time with a `datetime-local` input.
- Live countdown in days, hours, minutes, and seconds (updates every second).
- Red warning style when less than 24 hours remain.
- Shows **"Time's Up"** when the countdown reaches zero.
- Front-end only implementation (no backend/database).
- Progress bar that shows the percentage of time remaining.
- Clean, centered, modern layout with responsive behavior.

## Folder Structure

```text
Dead-Line-MVP/
├─ public/
│  ├─ favicon.svg
│  └─ icons.svg
├─ src/
│  ├─ utils/
│  │  └─ time.ts
│  ├─ App.tsx
│  ├─ App.css
│  ├─ main.tsx
│  ├─ theme.ts
│  └─ vite-env.d.ts
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ README.md
```

## Run Locally

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## GitHub Deployment (GitHub Pages)

This project is Vite-based and can be deployed with a Pages workflow.

1. Push this project to a GitHub repository.
2. Add a workflow file at `.github/workflows/deploy.yml`.
3. Build with `npm ci && npm run build`.
4. Deploy the `dist/` folder with `actions/deploy-pages`.

> If your repo is served from a subpath (`https://<user>.github.io/<repo>/`), set `base: '/<repo>/'` in `vite.config.ts`.
