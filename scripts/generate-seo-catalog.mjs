/**
 * Builds ~500 CS2/ксго2 SEO seeds → src/data/seoCatalog.generated.ts
 * Mix of bind-intent + general CS2 topics with soft funnel to BindLab.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const TARGET = 500

/** @type {{ slug: string, group: string, topic: string, kw: string, extra?: string[] }[]} */
const rows = []
const seenSlug = new Set()
const seenKw = new Set()

function slugify(parts) {
  return parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function add(slug, group, topic, kw, extra = []) {
  const s = slugify([slug])
  const key = kw.toLowerCase().trim()
  if (!s || seenSlug.has(s) || seenKw.has(key)) return false
  seenSlug.add(s)
  seenKw.add(key)
  rows.push({ slug: s, group, topic, kw: kw.trim(), extra })
  return true
}

/** Display forms + latin slug tags (URLs must stay ASCII). */
const GAME_TAGS = [
  { label: 'CS2', slug: 'cs2' },
  { label: 'кс2', slug: 'ks2' },
  { label: 'ксго2', slug: 'ksgo2' },
  { label: 'Counter-Strike 2', slug: 'counter-strike-2' },
]
const GAME = GAME_TAGS.map((g) => g.label)

// —— Core bind seeds (high intent) ——
const BIND_SEEDS = [
  ['kak-zabindit-pokupku-oruzhiya', 'how-to', 'buy', 'как забиндить покупку оружия CS2'],
  ['kak-sdelat-bay-bindy', 'how-to', 'buy', 'как сделать бай бинды CS2'],
  ['bay-bindy-ks2', 'binds', 'buy', 'бай бинды кс2'],
  ['bay-bindy-ksgo2', 'binds', 'buy', 'бай бинды ксго2'],
  ['buy-binds-cs2', 'binds', 'buy', 'buy binds CS2'],
  ['kak-zabindit-jumpthrow', 'how-to', 'jumpthrow', 'как забиндить jumpthrow CS2'],
  ['jumpthrow-ks2', 'binds', 'jumpthrow', 'jumpthrow кс2'],
  ['dzhamptrou-bind', 'binds', 'jumpthrow', 'джамптроу бинд CS2'],
  ['bindy-granat-ks2', 'binds', 'grenade', 'бинды гранат кс2'],
  ['bind-na-smok', 'how-to', 'grenade', 'бинд на смок CS2'],
  ['bind-na-fleshku', 'how-to', 'grenade', 'бинд на флешку CS2'],
  ['kak-nastroit-pritsel', 'how-to', 'crosshair', 'как настроить прицел CS2'],
  ['pritsel-ks2', 'binds', 'crosshair', 'прицел кс2'],
  ['crosshair-cs2', 'binds', 'crosshair', 'crosshair CS2'],
  ['radar-ks2', 'binds', 'radar', 'радар кс2'],
  ['kak-nastroit-radar', 'how-to', 'radar', 'как настроить радар CS2'],
  ['viewmodel-cs2', 'binds', 'viewmodel', 'viewmodel CS2'],
  ['fov-cs2', 'binds', 'viewmodel', 'FOV CS2'],
  ['unbindall-cs2', 'binds', 'unbind', 'unbindall CS2'],
  ['kak-sbrosit-bindy', 'how-to', 'unbind', 'как сбросить бинды CS2'],
  ['nastrojki-fps-ks2', 'binds', 'fps', 'настройки FPS кс2'],
  ['kak-povysit-fps-ks2', 'how-to', 'fps', 'как повысить FPS кс2'],
  ['nastrojki-zvuka-ks2', 'binds', 'sound', 'настройки звука кс2'],
  ['autoexec-cs2', 'guides', 'autoexec', 'autoexec CS2'],
  ['konfig-ks2', 'guides', 'config', 'конфиг кс2'],
  ['bindy-ks2', 'guides', 'general', 'бинды кс2'],
  ['bindy-ksgo2', 'guides', 'general', 'бинды ксго2'],
  ['luchshie-bindy-ks2', 'guides', 'general', 'лучшие бинды кс2'],
  ['generator-bindov-cs2', 'guides', 'general', 'генератор биндов CS2'],
  ['kak-vstavit-bindy-v-konsol', 'how-to', 'console', 'как вставить бинды в консоль CS2'],
]
for (const [slug, group, topic, kw] of BIND_SEEDS) {
  add(slug, group, topic, kw, ['ксго2', 'CS2'])
}

// —— Maps ——
const MAPS = [
  ['dust2', 'Dust 2', 'даст2'],
  ['mirage', 'Mirage', 'мираж'],
  ['inferno', 'Inferno', 'инферно'],
  ['nuke', 'Nuke', 'нюк'],
  ['ancient', 'Ancient', 'эншент'],
  ['anubis', 'Anubis', 'анубис'],
  ['vertigo', 'Vertigo', 'вертиго'],
  ['overpass', 'Overpass', 'оверпасс'],
  ['train', 'Train', 'трейн'],
  ['italy', 'Italy', 'италия'],
  ['office', 'Office', 'офис'],
  ['agency', 'Agency', 'эдженси'],
]
const MAP_PREFIX = [
  ['gayd', 'гайд'],
  ['taktika', 'тактика'],
  ['kak-igrat', 'как играть'],
  ['smoki', 'смоки'],
  ['pozicii', 'позиции'],
  ['callouty', 'коллауты'],
  ['tips', 'советы'],
  ['dlya-novichkov', 'для новичков'],
]
for (const [mapSlug, mapEn, mapRu] of MAPS) {
  for (const [pSlug, pRu] of MAP_PREFIX) {
    for (const g of GAME_TAGS) {
      add(
        `${pSlug}-${mapSlug}-${g.slug}`,
        'cs2',
        'map',
        `${pRu} ${mapEn} ${g.label}`,
        [`${pRu} ${mapRu} ${g.label}`, `карта ${mapEn} ${g.label}`],
      )
    }
  }
}

// —— Weapons ——
const WEAPONS = [
  ['ak47', 'AK-47', 'ак 47'],
  ['m4a1', 'M4A1-S', 'м4а1'],
  ['m4a4', 'M4A4', 'м4а4'],
  ['awp', 'AWP', 'авп'],
  ['deagle', 'Desert Eagle', 'дигл'],
  ['usp', 'USP-S', 'юсп'],
  ['glock', 'Glock-18', 'глок'],
  ['mp9', 'MP9', 'мп9'],
  ['mac10', 'MAC-10', 'мак10'],
  ['p90', 'P90', 'п90'],
  ['famas', 'FAMAS', 'фамас'],
  ['galil', 'Galil AR', 'галил'],
  ['aug', 'AUG', 'ауг'],
  ['sg553', 'SG 553', 'сг553'],
  ['ssg08', 'SSG 08', 'скаут'],
  ['nova', 'Nova', 'нова'],
  ['xm1014', 'XM1014', 'хм'],
  ['negev', 'Negev', 'негев'],
  ['zeus', 'Zeus x27', 'зевс'],
  ['knife', 'нож', 'нож'],
]
const WEAPON_PREFIX = [
  ['gayd', 'гайд'],
  ['kak-igrat', 'как играть'],
  ['spray', 'спрей'],
  ['rekoil', 'отдача'],
  ['bay', 'покупка'],
  ['sovety', 'советы'],
]
for (const [wSlug, wEn, wRu] of WEAPONS) {
  for (const [pSlug, pRu] of WEAPON_PREFIX) {
    for (const g of GAME_TAGS.slice(0, 3)) {
      add(
        `${pSlug}-${wSlug}-${g.slug}`,
        'cs2',
        'weapon',
        `${pRu} ${wEn} ${g.label}`,
        [`${pRu} ${wRu} ${g.label}`],
      )
    }
  }
}

// —— Ranks / modes ——
const RANK_PHRASES = [
  ['kak-podnyat-rang', 'как поднять ранг', 'rank'],
  ['kak-podnyat-premier', 'как поднять Premier', 'rank'],
  ['premier-cs2', 'Premier CS2', 'mode'],
  ['faceit-cs2', 'Faceit CS2', 'mode'],
  ['matchmaking-cs2', 'матчмейкинг CS2', 'mode'],
  ['wingman-cs2', 'Wingman CS2', 'mode'],
  ['deathmatch-cs2', 'Deathmatch CS2', 'mode'],
  ['retake-cs2', 'Retake CS2', 'mode'],
  ['kak-igrat-premier', 'как играть Premier', 'mode'],
  ['calibraciya-ranga', 'калибровка ранга CS2', 'rank'],
]
for (const [slug, kw, topic] of RANK_PHRASES) {
  for (const g of GAME_TAGS) {
    add(`${slug}-${g.slug}`, 'cs2', topic, `${kw} ${g.label}`.replace(/ CS2 CS2/, ' CS2'), [
      kw,
      g.label,
    ])
  }
}

// —— Economy / tips ——
const TIP_PHRASES = [
  ['ekonomika-raunda', 'экономика раунда', 'economy'],
  ['eco-raund', 'эко раунд', 'economy'],
  ['force-bay', 'форс бай', 'economy'],
  ['full-bay', 'фулл бай', 'economy'],
  ['kak-ne-slivit-eco', 'как не слить эко', 'economy'],
  ['sovety-novichkam', 'советы новичкам', 'tip'],
  ['kak-uluchshit-aim', 'как улучшить аим', 'tip'],
  ['kak-trenirovat-aim', 'как тренировать аим', 'tip'],
  ['kak-kinut-smok', 'как кинуть смок', 'tip'],
  ['kak-kinut-flesh', 'как кинуть флешку', 'tip'],
  ['prefire-cs2', 'префаер', 'tip'],
  ['crosshair-placement', 'crosshair placement', 'tip'],
  ['counter-strafe', 'counter strafe', 'tip'],
  ['peek-cs2', 'пик в CS2', 'tip'],
  ['trade-frag', 'трейд фраг', 'tip'],
  ['info-po-zvuku', 'информация по звуку', 'tip'],
  ['kak-slushat-shagi', 'как слушать шаги', 'tip'],
  ['kommunikaciya-v-komande', 'коммуникация в команде', 'tip'],
  ['rol-awper', 'роль авпера', 'tip'],
  ['rol-entry', 'роль энтри', 'tip'],
  ['rol-support', 'роль саппорта', 'tip'],
  ['rol-lurker', 'роль ларкера', 'tip'],
  ['kak-derzhat-sait', 'как держать сайт', 'tip'],
  ['kak-brat-mid', 'как брать мид', 'tip'],
  ['kak-delat-retake', 'как делать ретейк', 'tip'],
  ['kak-save', 'как сейвить раунд', 'tip'],
  ['clutch-situaciya', 'клатч ситуация', 'tip'],
  ['anti-eko', 'анти-эко', 'economy'],
  ['bonus-raund', 'бонус раунд', 'economy'],
  ['loss-bonus', 'loss bonus', 'economy'],
]
for (const [slug, kw, topic] of TIP_PHRASES) {
  for (const g of GAME_TAGS.slice(0, 3)) {
    add(`${slug}-${g.slug}`, 'cs2', topic, `${kw} ${g.label}`, [kw])
  }
}

// —— Settings / launch / performance (broader CS2) ——
const SETTINGS_PHRASES = [
  ['nastrojki-grafiki', 'настройки графики', 'settings'],
  ['nastrojki-video', 'настройки видео', 'settings'],
  ['nizkie-nastrojki', 'низкие настройки', 'settings'],
  ['vysokie-nastrojki', 'высокие настройки', 'fps'],
  ['vsync-cs2', 'выключить VSync', 'fps'],
  ['nvidia-nastrojki', 'настройки NVIDIA для', 'fps'],
  ['amd-nastrojki', 'настройки AMD для', 'fps'],
  ['razreshenie-4-3', 'разрешение 4:3', 'settings'],
  ['razreshenie-16-9', 'разрешение 16:9', 'settings'],
  ['stretched-res', 'stretched разрешение', 'settings'],
  ['parametry-zapuska', 'параметры запуска', 'launch'],
  ['kak-vklyuchit-konsol', 'как включить консоль', 'console'],
  ['gde-cfg', 'где лежит cfg', 'autoexec'],
  ['kak-ustanovit-konfig', 'как установить конфиг', 'config'],
  ['chuvstvitelnost', 'чувствительность', 'mouse'],
  ['dpi-myshi', 'DPI мыши', 'mouse'],
  ['raw-input', 'raw input', 'mouse'],
  ['otklyuchit-myish-accel', 'отключить ускорение мыши', 'mouse'],
  ['nastrojki-zvuka-windows', 'настройки звука Windows для', 'sound'],
  ['stereo-vs-naushniki', 'стерео или наушники', 'sound'],
  ['kak-ubrat-razmytie', 'как убрать размытие', 'settings'],
  ['multisampling', 'сглаживание', 'settings'],
  ['shader-nastrojki', 'шейдеры', 'settings'],
  ['boost-player-contrast', 'boost player contrast', 'settings'],
  ['teammate-colors', 'цвета тиммейтов', 'hud'],
  ['minimapa', 'миникарта', 'radar'],
]
for (const [slug, kw, topic] of SETTINGS_PHRASES) {
  for (const g of GAME_TAGS.slice(0, 3)) {
    add(`${slug}-${g.slug}`, 'cs2', topic, `${kw} ${g.label}`, [kw, 'настройки'])
  }
}

// —— Fill to TARGET with more CS2 long-tails ——
const FILLERS = [
  ['luchshie-nastrojki', 'лучшие настройки', 'settings'],
  ['optimalnye-nastrojki', 'оптимальные настройки', 'settings'],
  ['nastrojki-pro-igrokov', 'настройки про игроков', 'settings'],
  ['kak-sdelat-kak-u-s1mple', 'настройки как у s1mple', 'settings'],
  ['kak-sdelat-kak-u-donk', 'настройки как у donk', 'settings'],
  ['kak-sdelat-kak-u-zywoo', 'настройки как у ZywOo', 'settings'],
  ['trenirovka-aim-bot', 'тренировка аима', 'practice'],
  ['yprac-maps', 'aim map', 'practice'],
  ['warmup-pered-igroj', 'разминка перед игрой', 'practice'],
  ['kak-igrat-ct', 'как играть за CT', 'tip'],
  ['kak-igrat-t', 'как играть за T', 'tip'],
  ['default-smokes', 'дефолт смоки', 'tip'],
  ['one-way-smoke', 'one way smoke', 'tip'],
  ['flashbang-tips', 'советы по флешкам', 'tip'],
  ['molotov-lineup', 'лайнап молотова', 'tip'],
  ['he-damage', 'урон хешки', 'tip'],
  ['bomb-timer', 'таймер бомбы', 'tip'],
  ['defuse-tips', 'советы по дефузу', 'tip'],
  ['plant-tips', 'советы по пленту', 'tip'],
  ['rotate-tips', 'ротации', 'tip'],
  ['mid-control', 'контроль мида', 'tip'],
  ['default-execute', 'дефолт экзекьют', 'tip'],
  ['fast-a', 'быстрый заход A', 'tip'],
  ['fast-b', 'быстрый заход B', 'tip'],
  ['lurk-tips', 'ларк советы', 'tip'],
  ['awp-peek', 'пик на авп', 'weapon'],
  ['rifle-duel', 'дуэль на винтах', 'tip'],
  ['pistoletnyj-raund', 'пистолетный раунд', 'economy'],
  ['anti-eco-loadout', 'анти-эко закуп', 'economy'],
  ['helmet-or-not', 'покупать ли шлем', 'economy'],
  ['utility-usage', 'использование утилит', 'tip'],
  ['smoke-timing', 'тайминги смоков', 'tip'],
  ['flash-pop', 'поп-флеш', 'tip'],
  ['support-flash', 'саппорт флеш', 'tip'],
  ['entry-frag', 'энтри фраг', 'tip'],
  ['trade-kill', 'трейд килл', 'tip'],
  ['positioning', 'позиционирование', 'tip'],
  ['angle-advantage', 'преимущество угла', 'tip'],
  ['jiggle-peek', 'джигл пик', 'tip'],
  ['wide-peek', 'вайд пик', 'tip'],
  ['shoulder-peek', 'шолдер пик', 'tip'],
  ['crouch-spray', 'стрельба с приседа', 'tip'],
  ['tap-shooting', 'тап стрельба', 'tip'],
  ['burst-fire', 'стрельба очередями', 'tip'],
  ['spray-transfer', 'спрей трансфер', 'tip'],
  ['recoil-control', 'контроль отдачи', 'tip'],
  ['movement-error', 'ошибки движения', 'tip'],
  ['counter-strafing-guide', 'гайд по контрстрафу', 'tip'],
  ['bhop-legit', 'бхоп легит', 'tip'],
  ['jump-spot', 'джамп спот', 'map'],
  ['pixel-smoke', 'пиксельный смок', 'tip'],
  ['lineup-guide', 'гайд по лайнапам', 'tip'],
  ['demo-review', 'разбор демо', 'tip'],
  ['kak-smotret-demo', 'как смотреть демо', 'tip'],
  ['pov-demo', 'POV демо', 'tip'],
  ['server-fps', 'FPS на сервере', 'fps'],
  ['var-cs2', 'var CS2', 'net'],
  ['packet-loss', 'packet loss', 'net'],
  ['high-ping-fix', 'высокий пинг', 'net'],
  ['kak-snizit-ping', 'как снизить пинг', 'net'],
  ['router-nastrojki', 'роутер для CS2', 'net'],
  ['wired-vs-wifi', 'кабель или Wi‑Fi', 'net'],
  ['geympad-cs2', 'геймпад в CS2', 'settings'],
  ['klaviatura-dlya-cs2', 'клавиатура для CS2', 'settings'],
  ['mysh-dlya-cs2', 'мышь для CS2', 'mouse'],
  ['kover-dlya-myshi', 'коврик для мыши', 'mouse'],
  ['naushniki-dlya-cs2', 'наушники для CS2', 'sound'],
  ['mikrofon-nastrojki', 'настройки микрофона', 'sound'],
  ['push-to-talk', 'push to talk', 'sound'],
  ['golosovoj-chat', 'голосовой чат', 'sound'],
  ['kak-zamutit', 'как замутить игрока', 'tip'],
  ['report-system', 'репорты в CS2', 'tip'],
  ['trust-factor', 'Trust Factor', 'mode'],
  ['prime-status', 'Prime Status', 'mode'],
  ['kak-poluchit-prime', 'как получить Prime', 'mode'],
  ['inventory-cs2', 'инвентарь CS2', 'tip'],
  ['kak-postavit-agent', 'как поставить агента', 'tip'],
  ['music-kit', 'музыкальный набор', 'tip'],
  ['gladkiy-spray', 'гладкий спрей', 'weapon'],
  ['first-bullet', 'точность первого выстрела', 'weapon'],
  ['movement-inaccuracy', 'неточность в движении', 'tip'],
]
const FILL_GAMES = [
  ...GAME_TAGS.slice(0, 3),
  { label: 'кс го 2', slug: 'ks-go-2' },
]
for (const [slug, kw, topic] of FILLERS) {
  for (const g of FILL_GAMES) {
    if (rows.length >= TARGET) break
    add(`${slug}-${g.slug}`, 'cs2', topic, `${kw} ${g.label}`, [kw, 'ксго2'])
  }
  if (rows.length >= TARGET) break
}

// Extra numeric variants if still short
let n = 1
while (rows.length < TARGET) {
  add(
    `sovet-cs2-${n}`,
    'cs2',
    'tip',
    `совет по CS2 №${n}`,
    ['советы кс2', 'ксго2 советы'],
  )
  n++
  if (n > 80) break
}

const unique = rows.slice(0, TARGET)

const out = `/* AUTO-GENERATED by scripts/generate-seo-catalog.mjs — do not edit by hand */
import type { SeoCatalogRow } from './seoTopicTemplates'

export const SEO_CATALOG: SeoCatalogRow[] = ${JSON.stringify(unique, null, 2)}
`

writeFileSync(join(root, 'src/data/seoCatalog.generated.ts'), out, 'utf8')
console.log(`Wrote ${unique.length} SEO catalog rows (target ${TARGET})`)
if (unique.length < TARGET) {
  console.warn(`WARNING: only ${unique.length} unique rows`)
  process.exitCode = 1
}
