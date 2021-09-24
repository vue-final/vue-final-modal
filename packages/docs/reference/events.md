# Events

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VEvents.vue')" :importComponentRawFn="() => import('@/components/use-cases/VEvents.vue?raw')"></CodeBlock>

## `@click-outside`

Emits while modal container on click.

:::tip
If prop [`clickToClose`](/reference/properties#clicktoclose) is `false`, the event will still be emitted.
:::

## `@before-open`

Emits while modal is still invisible, but before transition starting.

:::tip
Further opening of the modal can be blocked from this event listener by calling `event.stop()`.

```vue
<template>
  <vue-final-modal @beforeOpen="e => e.stop()"></vue-final-modal>
</template>

```
:::

## `@opened`

Emits after modal became visible and transition ended.

## `@before-close`

Emits before modal is going to be closed.

:::tip
Further closing of the modal can be blocked from this event listener by calling `event.stop()`.

```vue
<template>
  <vue-final-modal @beforeClose="e => e.stop()"></vue-final-modal>
</template>
```
:::


## `@closed`

Emits right before modal is destroyed.

:::tip
Further after the modal was closed, you can avoid the modal to reset the [`params`](/reference/params) to empty object by calling `event.stop()`.
:::


## `@drag:start`

Emits on drag start.

## `@drag:move`

Emits on drag move.

## `@drag:end`

Emits on drag end.

## `@resize:start`

Emits on resize start.

## `@resize:move`

Emits on resize move.

## `@resize:end`

Emits on resize end.
