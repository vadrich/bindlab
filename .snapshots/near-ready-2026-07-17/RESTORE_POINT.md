# Restore Point: near-ready-2026-07-17

Точка восстановления **CS2 Bind Configurator** — почти готовый сайт (2026-07-17).

Скажи агенту: **вернись к near-ready** / **restore near-ready** / **верни сайт к этому результату**.

## Что внутри

Полная копия `src/`, `public/`, `scripts/` и корневых конфигов (`package.json`, Vite, Tailwind, TS…).

### Основные фичи на этой точке

- Вкладки: Оружие / Утилиты / Unbind + Профиль / Уведомления
- Поиск (лупа у языка, Ctrl+K, цветные результаты, мигание цели)
- Несколько бай-биндов в профиле; конфликт одной клавиши → баннер при Copy + Уведомления
- Редактирование бай-бинда из Профиля/Уведомлений (замена при Copy, Отмена)
- Вставка конфига по ссылке в Профиле
- Радар, прицел (круглая точка), чат, живое приветствие после гида и «!»

## Восстановление (вручную)

Из корня проекта:

```powershell
$snap = ".snapshots\near-ready-2026-07-17"
robocopy "$snap\src" "src" /E
robocopy "$snap\public" "public" /E
robocopy "$snap\scripts" "scripts" /E
Copy-Item "$snap\*" -Destination "." -Include *.json,*.html,*.ts,*.js,*.md -Force
npm install
npm run build
```

Или попроси агента восстановить из этого snapshot (см. правило Cursor).
