export type SeoTopic =
  | 'buy'
  | 'jumpthrow'
  | 'grenade'
  | 'crosshair'
  | 'radar'
  | 'viewmodel'
  | 'unbind'
  | 'fps'
  | 'sound'
  | 'mouse'
  | 'net'
  | 'practice'
  | 'autoexec'
  | 'console'
  | 'share'
  | 'config'
  | 'general'
  | 'hud'
  | 'map'
  | 'rank'
  | 'weapon'
  | 'economy'
  | 'tip'
  | 'mode'
  | 'launch'
  | 'settings'

export type SeoGroup = 'how-to' | 'binds' | 'guides' | 'cs2'

export type SeoCatalogRow = {
  slug: string
  group: SeoGroup
  topic: SeoTopic
  kw: string
  extra?: string[]
}

type TopicPack = {
  ctaHref: string
  ctaLabel: string
  tabHint: string
  about: string
  tip: string
  steps: { name: string; text: string }[]
  /** If true, page is CS2 content with soft funnel to BindLab (not “how to bind X”). */
  softFunnel?: boolean
}

export const TOPIC_PACKS: Record<SeoTopic, TopicPack> = {
  buy: {
    ctaHref: '/?tab=weapons',
    ctaLabel: 'Открыть бай-меню BindLab',
    tabHint: 'вкладке «Оружие»',
    about:
      'Бай-бинд покупает оружие и снаряжение одной клавишей в начале раунда — быстрее, чем кликать по меню покупки.',
    tip: 'Соберите loadout визуально в BindLab, назначьте клавишу и скопируйте команды в консоль CS2.',
    steps: [
      { name: 'Откройте бай-меню', text: 'BindLab → вкладка «Оружие».' },
      { name: 'Отметьте предметы', text: 'Оружие, броня, утилиты.' },
      { name: 'Скопируйте в CS2', text: 'Клавиша → копирование → консоль (~).' },
    ],
  },
  jumpthrow: {
    ctaHref: '/?tab=utilities',
    ctaLabel: 'Сделать jumpthrow в BindLab',
    tabHint: 'утилитах',
    about:
      'Jumpthrow помогает стабильно кидать смоки и флешки. В CS2 удобнее собрать бинд генератором.',
    tip: 'В BindLab включите jumpthrow и скопируйте команды в консоль.',
    steps: [
      { name: 'Откройте утилиты', text: 'BindLab → «Утилиты».' },
      { name: 'Включите jumpthrow', text: 'Назначьте клавишу.' },
      { name: 'Вставьте в игру', text: 'Консоль CS2 или autoexec.cfg.' },
    ],
  },
  grenade: {
    ctaHref: '/?tab=utilities',
    ctaLabel: 'Бинды гранат в BindLab',
    tabHint: 'бинды гранат',
    about: 'Отдельные клавиши на смок, флеш, молотов и HE ускоряют игру.',
    tip: 'Соберите бинды гранат в BindLab и вставьте в консоль.',
    steps: [
      { name: 'Откройте утилиты', text: 'Блок гранат.' },
      { name: 'Назначьте клавиши', text: 'Без конфликтов.' },
      { name: 'Скопируйте', text: 'В консоль (~).' },
    ],
  },
  crosshair: {
    ctaHref: '/?tab=utilities',
    ctaLabel: 'Настроить прицел в BindLab',
    tabHint: 'прицеле',
    about: 'Прицел влияет на комфорт стрельбы — размер, цвет и стиль подбирают под себя.',
    tip: 'Соберите crosshair в BindLab и скопируйте команды в CS2.',
    steps: [
      { name: 'Откройте прицел', text: 'Утилиты → crosshair.' },
      { name: 'Подберите вид', text: 'Размер, цвет, стиль.' },
      { name: 'Примените', text: 'Консоль CS2.' },
    ],
  },
  radar: {
    ctaHref: '/?tab=utilities',
    ctaLabel: 'Настроить радар в BindLab',
    tabHint: 'радаре',
    about: 'Радар показывает карту и тиммейтов — масштаб и центр часто настраивают отдельно.',
    tip: 'Скопируйте настройки радара из BindLab в консоль.',
    steps: [
      { name: 'Откройте радар', text: 'Утилиты → радар.' },
      { name: 'Выставьте параметры', text: 'Масштаб и поведение.' },
      { name: 'Скопируйте', text: 'В CS2.' },
    ],
  },
  viewmodel: {
    ctaHref: '/?tab=utilities',
    ctaLabel: 'Viewmodel в BindLab',
    tabHint: 'viewmodel / FOV',
    about: 'Положение рук и FOV меняют обзор и привычный вид оружия.',
    tip: 'Выберите пресет в BindLab и скопируйте команды.',
    steps: [
      { name: 'Откройте viewmodel', text: 'Утилиты → руки / FOV.' },
      { name: 'Выберите пресет', text: 'Или свои значения.' },
      { name: 'Скопируйте', text: 'В консоль.' },
    ],
  },
  unbind: {
    ctaHref: '/?tab=unbind',
    ctaLabel: 'Сброс биндов в BindLab',
    tabHint: 'сбросе',
    about: 'Unbind снимает назначения клавиш, если конфиг «поехал».',
    tip: 'Скопируйте unbindall или выборочный сброс из BindLab.',
    steps: [
      { name: 'Откройте сброс', text: 'Вкладка «Сброс».' },
      { name: 'Выберите тип', text: 'Полный или выборочный.' },
      { name: 'Вставьте', text: 'В консоль CS2.' },
    ],
  },
  fps: {
    ctaHref: '/?tab=utilities',
    ctaLabel: 'Настройки FPS в BindLab',
    tabHint: 'видео / FPS',
    about: 'Стабильный FPS важен для прицела и реакции в CS2.',
    tip: 'Соберите понятные опции производительности в BindLab.',
    steps: [
      { name: 'Откройте видео/FPS', text: 'Утилиты.' },
      { name: 'Отметьте опции', text: 'Нужный набор.' },
      { name: 'Скопируйте', text: 'В консоль или autoexec.' },
    ],
  },
  sound: {
    ctaHref: '/?tab=utilities',
    ctaLabel: 'Звук в BindLab',
    tabHint: 'звуке',
    about: 'Шаги и информация по звуку — часть преимущества в CS2.',
    tip: 'Скопируйте аудио-настройки из BindLab.',
    steps: [
      { name: 'Откройте звук', text: 'Утилиты → audio.' },
      { name: 'Выставьте параметры', text: 'Нужные опции.' },
      { name: 'Примените', text: 'Консоль CS2.' },
    ],
  },
  mouse: {
    ctaHref: '/?tab=utilities',
    ctaLabel: 'Мышь в BindLab',
    tabHint: 'мыши',
    about: 'Сенса и настройки мыши влияют на точность.',
    tip: 'Сохраните блок настроек мыши через BindLab.',
    steps: [
      { name: 'Откройте мышь', text: 'Утилиты → sensitivity.' },
      { name: 'Задайте значения', text: 'Сенса и связанные опции.' },
      { name: 'Скопируйте', text: 'В CS2.' },
    ],
  },
  net: {
    ctaHref: '/?tab=utilities',
    ctaLabel: 'Сеть в BindLab',
    tabHint: 'сети',
    about: 'Net graph и сеть помогают видеть пинг и стабильность.',
    tip: 'Скопируйте сетевые опции из утилит BindLab.',
    steps: [
      { name: 'Откройте сеть', text: 'Утилиты → net.' },
      { name: 'Отметьте опции', text: 'Мониторинг и сеть.' },
      { name: 'Скопируйте', text: 'В консоль.' },
    ],
  },
  practice: {
    ctaHref: '/?tab=utilities',
    ctaLabel: 'Практика в BindLab',
    tabHint: 'практике',
    about: 'Тренировка гранат и механики требует набора команд.',
    tip: 'Скопируйте practice-команды из BindLab на свой сервер.',
    steps: [
      { name: 'Откройте практику', text: 'Утилиты → practice.' },
      { name: 'Отметьте команды', text: 'Нужный набор.' },
      { name: 'Вставьте', text: 'На practice-сервере.' },
    ],
  },
  autoexec: {
    ctaHref: '/',
    ctaLabel: 'Собрать конфиг в BindLab',
    tabHint: 'генераторе → autoexec.cfg',
    about: 'Autoexec загружает настройки при старте CS2.',
    tip: 'Соберите команды на BindLab и положите в autoexec.cfg.',
    steps: [
      { name: 'Соберите команды', text: 'На BindLab.' },
      { name: 'Создайте autoexec.cfg', text: 'Папка cfg игры.' },
      { name: 'Параметр запуска', text: '+exec autoexec.cfg.' },
    ],
  },
  console: {
    ctaHref: '/',
    ctaLabel: 'Открыть BindLab',
    tabHint: 'консоли (~)',
    about: 'Консоль принимает бинды и команды CS2.',
    tip: 'Скопируйте готовый текст с BindLab и вставьте в консоль.',
    steps: [
      { name: 'Скопируйте с сайта', text: 'Кнопка копирования.' },
      { name: 'Откройте консоль', text: 'Клавиша ~.' },
      { name: 'Вставьте', text: 'Ctrl+V.' },
    ],
  },
  share: {
    ctaHref: '/?tab=profile',
    ctaLabel: 'Профиль BindLab',
    tabHint: 'профиле',
    about: 'Конфиг можно сохранить и отправить ссылкой другу.',
    tip: 'Сохраните набор в профиле BindLab и поделитесь ссылкой.',
    steps: [
      { name: 'Соберите бинды', text: 'Оружие и утилиты.' },
      { name: 'Сохраните', text: 'Профиль → имя конфига.' },
      { name: 'Поделитесь', text: 'Ссылка другу.' },
    ],
  },
  config: {
    ctaHref: '/',
    ctaLabel: 'Собрать конфиг CS2',
    tabHint: 'генераторе конфига',
    about: 'Конфиг — набор настроек и биндов под ваш стиль.',
    tip: 'Соберите конфиг онлайн в BindLab и примените в игре.',
    steps: [
      { name: 'Выберите разделы', text: 'Оружие и утилиты.' },
      { name: 'Скопируйте', text: 'Правая панель.' },
      { name: 'Примените', text: 'Консоль или autoexec.' },
    ],
  },
  general: {
    ctaHref: '/',
    ctaLabel: 'Перейти в BindLab',
    tabHint: 'генераторе биндов',
    about: 'Бинды и настройки ускоряют игру в CS2.',
    tip: 'Соберите свой набор на BindLab и вставьте в консоль.',
    steps: [
      { name: 'Откройте BindLab', text: 'Главная генератора.' },
      { name: 'Соберите нужное', text: 'По вкладкам.' },
      { name: 'Скопируйте в CS2', text: 'Консоль (~).' },
    ],
  },
  hud: {
    ctaHref: '/?tab=utilities',
    ctaLabel: 'Интерфейс в BindLab',
    tabHint: 'HUD / отображении',
    about: 'Элементы интерфейса настраиваются командами.',
    tip: 'Скопируйте опции отображения из BindLab.',
    steps: [
      { name: 'Откройте утилиты', text: 'Блок HUD.' },
      { name: 'Отметьте опции', text: 'Нужный вид.' },
      { name: 'Скопируйте', text: 'В консоль.' },
    ],
  },
  map: {
    softFunnel: true,
    ctaHref: '/',
    ctaLabel: 'Собрать бинды под карту в BindLab',
    tabHint: 'игре на карте',
    about:
      'Карты CS2 отличаются позициями, смоками и темпом. Понимание карты помогает выбирать утилиты и закупки.',
    tip: 'Когда разберётесь с картой — соберите бай-бинды, jumpthrow и гранаты в BindLab, чтобы быстрее применять утилиты в раунде.',
    steps: [
      {
        name: 'Изучите ключевые позиции',
        text: 'Основные точки, выходы и типичные смоки на карте.',
      },
      {
        name: 'Подготовьте утилиты',
        text: 'Смоки и флешки удобнее с готовыми биндами.',
      },
      {
        name: 'Соберите бинды в BindLab',
        text: 'Бай-меню + jumpthrow + гранаты → копирование в консоль.',
      },
    ],
  },
  rank: {
    softFunnel: true,
    ctaHref: '/',
    ctaLabel: 'Ускорить игру биндами — BindLab',
    tabHint: 'рейтинговых матчах',
    about:
      'Ранги и Premier в CS2 отражают стабильность. Механика, утилиты и быстрая закупка помогают расти.',
    tip: 'Чтобы меньше терять время на меню покупки и гранаты — соберите конфиг в BindLab и играйте быстрее.',
    steps: [
      {
        name: 'Стабилизируйте основы',
        text: 'Прицел, сенса, радар — под себя.',
      },
      {
        name: 'Ускорьте закупку',
        text: 'Бай-бинды экономят секунды каждый раунд.',
      },
      {
        name: 'Соберите конфиг в BindLab',
        text: 'Скопируйте команды в консоль CS2.',
      },
    ],
  },
  weapon: {
    softFunnel: true,
    ctaHref: '/?tab=weapons',
    ctaLabel: 'Забиндить покупку оружия — BindLab',
    tabHint: 'закупке оружия',
    about:
      'У оружия CS2 разный спрей, цена и роль в экономике раунда. Важно быстро покупать нужный ствол.',
    tip: 'Сделайте бай-бинд на любимое оружие в BindLab — покупка одной клавишей.',
    steps: [
      {
        name: 'Выберите роль оружия',
        text: 'Райл, AWP, эко-пистолет и т.д.',
      },
      {
        name: 'Соберите бай-бинд',
        text: 'BindLab → «Оружие».',
      },
      {
        name: 'Вставьте в CS2',
        text: 'Консоль (~).',
      },
    ],
  },
  economy: {
    softFunnel: true,
    ctaHref: '/?tab=weapons',
    ctaLabel: 'Эко и фулл-бай бинды — BindLab',
    tabHint: 'экономике раунда',
    about:
      'Экономика CS2 решает, покупать полный бай, форс или эко. Ошибки в бае часто решают раунд.',
    tip: 'Держите отдельные бай-бинды на эко и фулл-бай в BindLab — меньше паники в buy-time.',
    steps: [
      {
        name: 'Поймите типы раундов',
        text: 'Эко, полубай, фулл.',
      },
      {
        name: 'Соберите 2–3 бай-бинда',
        text: 'Разные loadout на разные клавиши.',
      },
      {
        name: 'Скопируйте из BindLab',
        text: 'В консоль CS2.',
      },
    ],
  },
  tip: {
    softFunnel: true,
    ctaHref: '/',
    ctaLabel: 'Улучшить комфорт в BindLab',
    tabHint: 'советах по CS2',
    about:
      'Советы по CS2 помогают быстрее освоить механику, утилиты и настройки.',
    tip: 'Параллельно с тренировкой соберите удобные бинды и настройки в BindLab — меньше отвлечений на меню.',
    steps: [
      {
        name: 'Выберите один навык',
        text: 'Утилиты, прицел или закупка.',
      },
      {
        name: 'Закрепите настройками',
        text: 'Прицел, радар, бай-бинды.',
      },
      {
        name: 'Соберите в BindLab',
        text: 'Скопируйте конфиг в игру.',
      },
    ],
  },
  mode: {
    softFunnel: true,
    ctaHref: '/',
    ctaLabel: 'Подготовить конфиг в BindLab',
    tabHint: 'режиме CS2',
    about:
      'В CS2 есть Premier, обычный матчмейкинг, Faceit-подобные сервисы и режимы для практики.',
    tip: 'Для любого режима удобный конфиг (бинды, прицел, радар) собирается в BindLab за минуту.',
    steps: [
      {
        name: 'Выберите режим',
        text: 'Рейтинг, микс или практика.',
      },
      {
        name: 'Подготовьте настройки',
        text: 'Прицел и бинды под стиль.',
      },
      {
        name: 'Скопируйте из BindLab',
        text: 'В консоль CS2.',
      },
    ],
  },
  launch: {
    softFunnel: true,
    ctaHref: '/guides/autoexec',
    ctaLabel: 'Собрать autoexec в BindLab',
    tabHint: 'запуске CS2',
    about:
      'Параметры запуска и autoexec помогают сразу грузить нужные команды при старте игры.',
    tip: 'Соберите команды на BindLab, сохраните в autoexec.cfg и добавьте +exec в Steam.',
    steps: [
      {
        name: 'Соберите команды',
        text: 'На BindLab.',
      },
      {
        name: 'Создайте autoexec.cfg',
        text: 'Папка cfg.',
      },
      {
        name: 'Параметры запуска',
        text: '+exec autoexec.cfg.',
      },
    ],
  },
  settings: {
    softFunnel: true,
    ctaHref: '/',
    ctaLabel: 'Настроить CS2 в BindLab',
    tabHint: 'настройках игры',
    about:
      'Графика, звук, мышь и интерфейс CS2 сильно влияют на комфорт. Часть опций удобно держать командами в конфиге.',
    tip: 'Соберите рабочие команды настроек в BindLab и применяйте одним копированием.',
    steps: [
      {
        name: 'Выберите блок настроек',
        text: 'Видео, звук, мышь, радар.',
      },
      {
        name: 'Соберите в BindLab',
        text: 'Утилиты и нужные опции.',
      },
      {
        name: 'Примените в CS2',
        text: 'Консоль или autoexec.',
      },
    ],
  },
}
