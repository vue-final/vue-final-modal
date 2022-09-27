import type { ExtractDefaultPropTypes, ExtractPropTypes } from 'vue'
import type { O } from 'ts-toolbelt'

export type ExternalProps<T extends Record<string | number | symbol, any>> = O.Optional<
  ExtractPropTypes<T>,
  keyof ExtractDefaultPropTypes<T>
>
