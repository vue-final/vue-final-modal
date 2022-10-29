# Step by Step Basics

:::info
All examples use [Windi CSS](https://windicss.org/).
:::

`vue-final-modal` is a styleless/renderless component. I try not to pre-define any CSS as much as possible. So let's use vue-final-modal to create a Custom Modal component step by step.

## Overlay

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VOverlay.vue')" :importComponentRawFn="() => import('@/components/use-cases/VOverlay.vue?raw')"></CodeBlock>

## Hello, Vue Final Modal

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VBasic.vue')" :importComponentRawFn="() => import('@/components/use-cases/VBasic.vue?raw')"></CodeBlock>

## Background Color

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VBackground.vue')" :importComponentRawFn="() => import('@/components/use-cases/VBackground.vue?raw')"></CodeBlock>

## Centered

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VCentered.vue')" :importComponentRawFn="() => import('@/components/use-cases/VCentered.vue?raw')"></CodeBlock>

## Content

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VContent.vue')" :importComponentRawFn="() => import('@/components/use-cases/VContent.vue?raw')"></CodeBlock>

## Close Button

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VCloseButton.vue')" :importComponentRawFn="() => import('@/components/use-cases/VCloseButton.vue?raw')"></CodeBlock>

## Scrollable

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VScrollable.vue')" :importComponentRawFn="() => import('@/components/use-cases/VScrollable.vue?raw')"></CodeBlock>

## Action Buttons

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VActionButtons.vue')" :importComponentRawFn="() => import('@/components/use-cases/VActionButtons.vue?raw')"></CodeBlock>

## Stackable

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VStackable.vue')" :importComponentRawFn="() => import('@/components/use-cases/VStackable.vue?raw')"></CodeBlock>

## Improve Stackable modal

Create a [VModal](#vmodal-vue) component to improve stackable example.
### VModal.vue

<CodeBlock title="VModal.vue" :importComponentRawFn="() => import('@/components/use-cases/VModal.vue?raw')"></CodeBlock>

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VStackableAdvanced.vue')" :importComponentRawFn="() => import('@/components/use-cases/VStackableAdvanced.vue?raw')"></CodeBlock>


<!-- ## Reuse VModal with Dynamic Modal 



## Reuse VModal with useModal hook

### show, hide, options -->