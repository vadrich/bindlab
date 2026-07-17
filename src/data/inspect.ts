/** Hands / viewmodel config (legacy export name: InspectConfig). */
export type {
  HandsConfig as InspectConfig,
  HandsPresetId,
} from './hands'
export {
  DEFAULT_HANDS as DEFAULT_INSPECT,
  RECOMMENDED_HANDS as RECOMMENDED_INSPECT,
  HANDS_PRESETS,
  clampHands,
  buildHandsSettingsLines,
  buildHandsBindLines,
  buildHandsBindLines as buildInspectBindLines,
} from './hands'
