/** @deprecated Use inspect.ts — kept for re-exports during migration. */
export type {
  InspectConfig as HandsConfig,
} from './inspect'
export {
  DEFAULT_INSPECT as DEFAULT_HANDS,
  RECOMMENDED_INSPECT as RECOMMENDED_HANDS,
  RECOMMENDED_VIEWMODEL,
  DEFAULT_VIEWMODEL,
  clampInspectViewmodel as clampHands,
  buildInspectSettingsLines as buildHandsSettingsLines,
  buildInspectBindLines as buildHandsBindLines,
  formatViewmodelLine,
} from './inspect'
