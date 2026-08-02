# Realtime Kanban Board

A full-stack, real-time collaborative Kanban board — one shared board where any logged-in user can create, edit, move, and discuss tasks live with everyone else online.

**Live demo:** https://kanban-seven-hazel.vercel.app
**Backend:** https://kanban-muew.onrender.com

## Features

- JWT auth with auto re-prompt on session expiry
- Full CRUD on lists and cards (due dates, labels)
- Drag & drop reordering across lists (`@dnd-kit`)
- Real-time sync of all list/card changes via Socket.IO — no polling
- Live presence (who's online), multi-tab aware
- "X is dragging this card" live indicator
- Ephemeral board chat with typing indicators
- Persisted, timestamped activity log

## Tech Stack

**Frontend:** React (Vite), Tailwind v4, shadcn/ui, TanStack Query, Zustand, `@dnd-kit`, Socket.IO client
**Backend:** Node/Express, MongoDB (Mongoose), Socket.IO, JWT + argon2, Winston
**Deploy:** Render (backend), Vercel (frontend), MongoDB Atlas

## Architecture

REST endpoints remain the source of truth for mutations. After each successful mutation, the server emits a matching Socket.IO event; every client's `useSocket` hook writes the update straight into the TanStack Query cache via `setQueryData` — the same mechanism behind the app's own optimistic updates.

## Deployment

**Backend (Render)**
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

**Frontend (Vercel)**
- Root Directory: `client`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
