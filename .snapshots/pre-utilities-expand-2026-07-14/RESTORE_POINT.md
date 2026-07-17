# Restore: utilities before expand (2026-07-14)

To restore the previous utilities tab (only «Отображение сети»):

1. Copy from this folder into `src/`:
   - `App.tsx` → `src/App.tsx`
   - `UtilitiesPanel.tsx` → `src/components/UtilitiesPanel.tsx`
   - `BuyGrid.tsx` → `src/components/BuyGrid.tsx` (if present)
   - `Sidebar.tsx` → `src/components/Sidebar.tsx` (if present)
2. Delete `src/data/utilities.ts`
3. Run `npm run build`

Or tell the agent: **верни утилиты как было**

`public/icons/util-*.png` can stay unused.
