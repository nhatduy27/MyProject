<!-- Auto-generated helper for AI coding assistants. Keep concise and updated. -->
# Copilot / AI assistant instructions for this repository

This repository contains several small React apps and frontend demos. The goal of these notes is to help an AI coding assistant be immediately productive by highlighting the project's structure, conventions, build/test workflows, and concrete examples to reference.

**Big picture:**
- **Multiple independent apps:** The repo hosts independent apps under top-level folders like `photo_app`, `SumCalculator`, and `tic-tac-toe-game`. Treat each as its own Create-React-App project (separate `package.json`, `public/`, `src/`, `build/`).
- **Single-responsibility frontends:** Each app is a simple frontend (no monorepo tooling). Changes should be scoped to the specific app directory unless the change is intentionally cross-cutting.

**Where to look first (examples):**
- `photo_app/src/services/api.js` — API wrappers using `axios`; follow this pattern for new network code.
- `photo_app/src/hooks/usePhotos.jsx` — custom hook that manages pagination and loading state; reuse the same state shape and naming (`photos`, `loading`, `hasMore`, `fetchPhotos`) when adding similar hooks.
- `photo_app/src/components/` — components are functional React components using local CSS files (see `PhotoCard.jsx`, `InfiniteScroll.jsx`).

**Build / run / test workflows:**
- Typical commands (run inside target app folder, e.g., `photo_app`):
  - `npm install`
  - `npm start` — start dev server (CRA `react-scripts start`).
  - `npm run build` — produce `build/` static assets.
  - `npm test` — runs `react-scripts test`.
- There is no top-level workspace script — always `cd` into the app folder first.

**Project-specific conventions & patterns:**
- Use `src/services/*` for API wrappers (synchronous API functions that return data; handle errors and re-throw). Example: `getPhotos(page)` in `photo_app/src/services/api.js`.
- Use `src/hooks/*` for reusable hooks that encapsulate loading/pagination logic. Hooks return simple POJOs and functions (e.g., `{photos, loading, hasMore, fetchPhotos}`).
- UI components are plain functional components using CSS files under `src/` (no CSS-in-JS used).
- Keep business logic in hooks/services, keep components mostly presentational.

**Integration points & external dependencies:**
- External API used by `photo_app` is `https://picsum.photos` — follow the same approach for endpoint composition (base URL + path). See `getPhotoDetail(id)` for example.
- Core dependencies in apps: `react`, `react-dom`, `react-scripts`, `axios` (photo_app). Prefer existing libraries (e.g., `axios`) over adding new ones unless necessary.

**Code edits guidelines for AI assistants:**
- Make minimal, focused changes in a single app folder unless asked to refactor multiple apps.
- When adding network calls, add them under `src/services/` and call them from hooks or components. Keep error handling consistent (console.log / console.error + re-throw).
- When modifying UI, follow existing component patterns (functional components + local CSS). Keep naming consistent with existing files.
- Avoid changing top-level tooling (no workspace-level package.json changes) unless the change is required and the user requests it.

**Examples to reference when implementing features or fixes:**
- Pagination & loading: `photo_app/src/hooks/usePhotos.jsx` — demonstrates `useState`, `useEffect`, `useCallback` and `fetchPhotos` pattern.
- API wrapper: `photo_app/src/services/api.js` — demonstrates `axios` usage, URL construction, and simple error handling.

If any of these assumptions are incorrect or you want the assistant to follow a different coding style, tell the assistant which app(s) to focus on and whether to propose broader refactors (for example: centralizing shared tooling across apps).

Requested feedback: please tell the assistant if you'd like
- More detail about a specific app (e.g., `photo_app` routing and components),
- Inclusion of linting/formatting rules, or
- Rules for commits/PR messages.
