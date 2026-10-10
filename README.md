# Сам себе модельер — прототип онлайн-ателье

## Сборка для Cloudflare Pages
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/` или пустое поле

## Локальный запуск
```bash
npm install
npm run dev
```

Все исходные файлы проекта находятся в корне репозитория. Папка `dist` создаётся автоматически при сборке — загружать её в GitHub вручную не нужно.

`visual-online-atelier.html` — отдельный статический макет визуальной концепции. Основное приложение запускается через `index.html` и `main.jsx`.
