# Индексация BindLab — SEO

Sitemap: https://bindlab.ru/sitemap.xml  
Каталог: https://bindlab.ru/guides  

## Приоритет P0 (короткие URL, уникальный текст)

Эти страницы важнее массового каталога — отправляйте в GSC / Яндекс первыми:

| URL | Кластер |
|-----|---------|
| https://bindlab.ru/buy-binds | бай бинды / buy binds |
| https://bindlab.ru/jumpthrow | jumpthrow |
| https://bindlab.ru/crosshair | прицел |
| https://bindlab.ru/radar | радар |
| https://bindlab.ru/fps | FPS |
| https://bindlab.ru/practice | практика |
| https://bindlab.ru/config | конфиг / autoexec |
| https://bindlab.ru/console | консоль |
| https://bindlab.ru/grenades | гранаты |
| https://bindlab.ru/unbind | сброс биндов |

Правка текстов: `src/data/seoP0Landings.ts` → `npm run build` → deploy.

## Массовый каталог (~500)

- `/how-to/*`, `/binds/*`, `/guides/*` — бинды и конфиг  
- `/cs2/*` — карты, оружие, ранги, советы с CTA в BindLab  

Обновить ядро: `scripts/generate-seo-catalog.mjs` → `npm run seo:catalog` → deploy.

## Google / Яндекс

1. Отправь sitemap заново  
2. Запроси индексирование `/` + 10 P0 URL + `/guides`  
3. Остальное подтянется из sitemap (дни/недели)

## Замечание

Массовые страницы дают охват, но тонкий дубль режут. Сильнее: уникальные P0 + поведение + внешние ссылки. Не плодить вторую схему URL из чужих «мега-промптов» без 301.
