<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import ModalLongScroll from './ModalLongScroll.vue'

const p = `<p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ullamcorper,
      ex at blandit iaculis, nibh urna lacinia tellus, a auctor lorem libero a
      lectus. Nulla bibendum mollis sapien, nec euismod mi mattis cursus.
      Curabitur accumsan erat eu viverra fringilla. Interdum et malesuada fames
      ac ante ipsum primis in faucibus. Phasellus ut neque eu diam vehicula
      efficitur. Vivamus ultricies purus facilisis augue porttitor vestibulum a
      non neque. Nunc egestas risus elit, sed fringilla velit posuere et.
    </p>`

const { open, close } = useModal({
  component: ModalLongScroll,
  attrs: {
    title: 'Hello World!',
    onConfirm: () => close(),
  },
  slots: {
    default: p + p + p + p + p + p + p + p + p + p + p + p,
  },
})
</script>

<template>
  <VButton @click="open">
    Open Modal
  </VButton>

  <ModalsContainer />
</template>
