# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `app/`, pairing routes, layouts, and server actions per feature. Shared UI sits in `components/`, while domain logic and data access stay in `core/` (notably `core/actions/server` and `core/services`). Use `lib/` for utilities, `config/` for tooling presets, `public/` for static assets, and `tests/` for automated suites and reports.

## Build, Test, and Development Commands
- `npm run dev` – Next.js dev server with Turbopack.
- `npm run build` / `npm run start` – production build and preview.
- `npm run lint` / `npm run format` – apply ESLint and Prettier configs from `config/`.
- `npm run test` / `npm run test:coverage` – Jest suites and coverage output.
- `npm run test:e2e` / `npm run test:a11y` – Playwright UI and accessibility flows.
- `npm run check-types` – TypeScript project check without emit.

## Coding Style & Naming Conventions
TypeScript is mandatory; prefer server components and typed server actions. Prettier enforces 2-space indentation, double quotes, 100-char lines, and auto-organized imports via `prettier-plugin-organize-imports`. ESLint adds custom guards: keep Supabase access inside `core`, funnel auth through `core/actions/server/auth`, split files over 300 lines with barrel `index.ts`, use PascalCase for components/types (`IExampleProps`), camelCase for hooks and utilities, and descriptive test filenames.

## Testing Guidelines
Place Jest specs beside features or in the matching `tests/` subfolder, using `*.test.ts[x]` naming. Playwright specs belong in `tests/e2e` (UI) and `tests/accessibility` (a11y); record failing runs and attach artifacts to PRs. Run `npm run test:ci` before merging and monitor coverage thresholds locally with `npm run test:coverage`.

## Commit & Pull Request Guidelines
Write concise, imperative commit subjects (e.g., `Restore booking flow`) and avoid `WIP` once ready for review; reference issues in the body when applicable. Group related changes so reviewers can map commits to features or fixes. PRs need a summary, test evidence (commands or screenshots), and UI captures when visual behavior shifts; request reviewers who own the touched modules.

## Security & Configuration Tips
Keep secrets out of version control—copy `.env.example` to `.env.local` and source Supabase keys from secure stores. Route new integrations through existing `core/services` factories so lint rules protect server usage patterns. Review `middleware.ts`, `instrumentation.ts`, and Sentry configs when logging new events or adjusting auth and rate limiting.
