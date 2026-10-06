# Online Atelier — Cloudflare Pages

Исправленный Vite + React проект онлайн-ателье.

## Cloudflare Pages / Workers & Pages
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node.js: 20+ (рекомендуется 22)

Главное исправление: добавлен корректный `src/main.jsx`, который является entry point приложения и монтирует React в `#root` из `index.html`.
