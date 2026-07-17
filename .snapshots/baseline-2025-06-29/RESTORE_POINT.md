# Restore Point: baseline-2025-06-29

Точка восстановления **CS2 Bind Configurator**.

## UI (как на скриншоте 2026-06-29)

- Заголовок: CS2 Bind Configurator / Генератор команд покупки для Counter-Strike 2
- Слева: колонки buy menu (EQUIPMENT, PISTOLS, SMGS, MID-TIER, RIFLES, GRENADES)
- Сверху сетки: сумма + N SELECTED
- Справа: клавиша бинда, быстрый выбор, шаблоны, результат, пресеты, история
- Формат команды: `bind f3 "buy mp7; buy vesthelm"`

## Baseline правила

- Pistols без P2000, Glock, USP-S
- Rifles: AUG, SG553; SSG08 в MID-TIER
- Flashbang с меткой 1/2

## Восстановление

```bash
npm install
npm run build
```
