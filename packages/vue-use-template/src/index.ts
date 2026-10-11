/** Types */
import {
  createProvider,
  createTemplateOutlet,
  createTemplateProvider,
  createTemplateProviderComponent,
  createTemplateState,
  createUseTemplate,
  createUseTemplateFrom,
  resolveInstalledTemplateState,
} from './createTemplateProvider'

export type { InstanceResolver } from './createInstanceResolver'

export { createInstanceResolver, isBrowser, markServer } from './createInstanceResolver'

export type {
  Provider,
  Template,
  TemplateState,
  UseTemplate,
} from './types'

export {
  defineTemplate,
  isTemplate,
  mergeTemplateAttrs,
  templateToVNodeFn,
} from './utils'

export {
  createProvider,
  createTemplateOutlet,
  createTemplateProvider,
  createTemplateState,
  createUseTemplate,
}

/** Only pure calls at the top level: destructuring or reading a property here keeps bundlers from dropping the default provider. */
const defaultState = /* @__PURE__ */ createTemplateState()
const getState = () => resolveInstalledTemplateState() ?? defaultState
export const TemplateProvider = /* @__PURE__ */ createTemplateProviderComponent(getState)
export const useTemplate = /* @__PURE__ */ createUseTemplateFrom(getState)
