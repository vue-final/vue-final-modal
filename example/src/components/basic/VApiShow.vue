<template>
  <div>
    <v-modal v-model="showModal" name="VApiShow" @confirm="showModal = false" @cancel="showModal = false">
      <template #default="{ params }"> Hi {{ params.userName }} </template>
      <template #title>$vfm.show</template>
    </v-modal>
    <button class="vfm-btn" @click="$vfm.show('VApiShow', { userName: 'vue-final-modal' })">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>
