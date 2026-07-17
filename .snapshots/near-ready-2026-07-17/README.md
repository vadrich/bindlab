# CS2 Bind Configurator

Визуальный конфигуратор buy-биндов для Counter-Strike 2.

## Возможности

- Buy menu в стиле CS2 с категориями: Pistols, SMGs, Heavy, Rifles, Equipment, Grenades
- Сетка арсенала `lg:grid-cols-7` без внутренних скроллбаров
- Flashbang с меткой количества `1/2`
- Генерация `bind`-строк для autoexec
- Share-ссылка с конфигом в URL hash

## Baseline (2025-06-29)

- Пистолеты **без** P2000, Glock, USP-S
- В Rifles: AUG, SG553, SSG08
- **Без** presets и quick key chips

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
```

## Восстановление baseline

См. `.snapshots/baseline-2025-06-29/RESTORE_POINT.md`
