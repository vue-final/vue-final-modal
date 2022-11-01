---
title: 手動
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
category: 範例
fullscreen: true
position: 9
version: 3
---

## 兩種開啟 modal 的方式

- **將 `v-model` 設為 `true`**

<sfc-view>

  ```vue
  <template>
    <div>
      <vue-final-modal v-model="showModal">
        Modal Content Here
      </vue-final-modal>
      <button @click="showModal = true">Open Modal</button>
    </div>
  </template>
  ```
  ```vue
  <script>
  export default {
    data: () => ({
      showModal: false
    })
  }
  </script>
  ```

  </sfc-view>

- **使用 [API](/zh-Hant/api) 開啟 modal**

<alert>當使用 `$vfm.show(name)` API 開啟，`v-model` 為必要的屬性。</alert>

  <sfc-view>

  ```vue
  <template>
    <vue-final-modal v-model="showModal" name="example">
        Modal Content Here
    </vue-final-modal>
    <button @click="openModalExample">Open Modal</button>
  </template>
  ```

  ```vue
  <script>
  export default {
    data: () => ({
        showModal: false
    }),
    methods: {
      openModalExample() {
        this.$vfm.show('example')
      }
    }
  }
  </script>
  ```

  </sfc-view>

## 一步步使用

- **開始 `vue-final-modal`**

  <v-basic class="mb-4"></v-basic>

  <sfc-view>

  ```vue
  <template>
    <div>
      <vue-final-modal v-model="showModal">
        <span class="modal__title">Hello, vue-final-modal</span>
      </vue-final-modal>
      <v-button @click="showModal = true">Open modal</v-button>
    </div>
  </template>
  ```

  ```vue
  <script>
  export default {
    data: () => ({
      showModal: false
    })
  }
  </script>
  ```

  ```vue
  <style scoped>
  .modal__title {
    font-size: 1.5rem;
    font-weight: 700;
  }
  </style>
  ```

  </sfc-view>

- **加上 `background-color`, `border-radius`**

  <v-background class="mb-4"></v-background>

  <sfc-view>

  ```vue
  <template>
    <div>
      <vue-final-modal v-model="showModal" content-class="modal-content">
        <span class="modal__title">Hello, vue-final-modal</span>
      </vue-final-modal>
      <v-button @click="showModal = true">Open modal</v-button>
    </div>
  </template>
  ```

  ```vue
  <script>
  export default {
    data: () => ({
      showModal: false
    })
  }
  </script>
  ```

  ```vue
  <style scoped>
  ::v-deep .modal-content {
    display: inline-block;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
  }
  .modal__title {
    font-size: 1.5rem;
    font-weight: 700;
  }
  </style>

  <style scoped>
  .dark-mode div::v-deep .modal-content {
    border-color: #2d3748;
    background-color: #1a202c;
  }
  </style>
  ```

  </sfc-view>

- **置中 modal**

  <v-centered class="mb-4"></v-centered>

  <sfc-view>

  ```vue
  <template>
    <div>
      <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
        <span class="modal__title">Hello, vue-final-modal</span>
      </vue-final-modal>
      <v-button @click="showModal = true">Open modal</v-button>
    </div>
  </template>
  ```

  ```vue
  <script>
  export default {
    data: () => ({
      showModal: false
    })
  }
  </script>
  ```

  ```vue
  <style scoped>
  ::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .modal-content {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
  }
  .modal__title {
    font-size: 1.5rem;
    font-weight: 700;
  }
  </style>

  <style scoped>
  .dark-mode div::v-deep .modal-content {
    border-color: #2d3748;
    background-color: #1a202c;
  }
  </style>
  ```

  </sfc-view>

- **加上內容**

  <v-content class="mb-4"></v-content>

  <sfc-view>

  ```vue
  <template>
    <div>
      <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
        <span class="modal__title">Hello, vue-final-modal</span>
        <div class="modal__content">
          <p>Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.</p>
        </div>
      </vue-final-modal>
      <v-button @click="showModal = true">Open modal</v-button>
    </div>
  </template>
  ```

  ```vue
  <script>
  export default {
    data: () => ({
      showModal: false
    })
  }
  </script>
  ```

  ```vue
  <style scoped>
  ::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .modal-content {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
  }
  .modal__title {
    font-size: 1.5rem;
    font-weight: 700;
  }
  </style>

  <style scoped>
  .dark-mode div::v-deep .modal-content {
    border-color: #2d3748;
    background-color: #1a202c;
  }
  </style>
  ```

  </sfc-view>

- **加上關閉的按鈕**

  <v-close-button class="mb-4"></v-close-button>

  <sfc-view>

  ```vue
  <template>
    <div>
      <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
        <button class="modal__close" @click="showModal = false">
          <mdi-close></mdi-close>
        </button>
        <span class="modal__title">Hello, vue-final-modal</span>
        <div class="modal__content">
          <p>Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.</p>
        </div>
      </vue-final-modal>
      <v-button @click="showModal = true">Open modal</v-button>
    </div>
  </template>
  ```

  ```vue
  <script>
  export default {
    data: () => ({
      showModal: false
    })
  }
  </script>
  ```

  ```vue
  <style scoped>
  ::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
  }
  .modal__title {
    margin: 0 2rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  .modal__close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
  </style>

  <style scoped>
  .dark-mode div::v-deep .modal-content {
    border-color: #2d3748;
    background-color: #1a202c;
  }
  </style>
  ```

  </sfc-view>

- **使內容是可以滾動的（Scrollable）**

  <v-scrollable class="mb-4"></v-scrollable>

  <sfc-view>

  ```vue
  <template>
    <div>
      <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
        <button class="modal__close" @click="showModal = false">
          <mdi-close></mdi-close>
        </button>
        <span class="modal__title">Hello, vue-final-modal</span>
        <div class="modal__content">
          <p v-for="i in 100" :key="i">
            Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
          </p>
        </div>
      </vue-final-modal>
      <v-button @click="showModal = true">Open modal</v-button>
    </div>
  </template>
  ```

  ```vue
  <script>
  export default {
    data: () => ({
      showModal: false
    })
  }
  </script>
  ```

  ```vue
  <style scoped>
  ::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 90%;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
  }
  .modal__title {
    margin: 0 2rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  .modal__content {
    flex-grow: 1;
    overflow-y: auto;
  }
  .modal__close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
  </style>

  <style scoped>
  .dark-mode div::v-deep .modal-content {
    border-color: #2d3748;
    background-color: #1a202c;
  }
  </style>
  ```

  </sfc-view>

- **加上確認（confirm） 以及取消（cancel）按鈕**

  <v-action-buttons class="mb-4"></v-action-buttons>

  <sfc-view>

  ```vue
  <template>
    <div>
      <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
        <button class="modal__close" @click="showModal = false">
          <mdi-close></mdi-close>
        </button>
        <span class="modal__title">Hello, vue-final-modal</span>
        <div class="modal__content">
          <p v-for="i in 100" :key="i">
            Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
          </p>
        </div>
        <div class="modal__action">
          <v-button @click="showModal = false">confirm</v-button>
          <v-button @click="showModal = false">cancel</v-button>
        </div>
      </vue-final-modal>
      <v-button @click="showModal = true">Open modal</v-button>
    </div>
  </template>
  ```

  ```vue
  <script>
  export default {
    data: () => ({
      showModal: false
    })
  }
  </script>
  ```

  ```vue
  <style scoped>
  ::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 90%;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
  }
  .modal__title {
    margin: 0 2rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  .modal__content {
    flex-grow: 1;
    overflow-y: auto;
  }
  .modal__action {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    padding: 1rem 0 0;
  }
  .modal__close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
  </style>

  <style scoped>
  .dark-mode div::v-deep .modal-content {
    border-color: #2d3748;
    background-color: #1a202c;
  }
  </style>
  ```

  </sfc-view>

- **建立可堆疊的（Stackable） modal**

  <v-stackable class="mb-4"></v-stackable>

  <sfc-view>

  ```vue
  <template>
    <div>
      <!-- First modal -->
      <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
        <button class="modal__close" @click="showModal = false">
          <mdi-close></mdi-close>
        </button>
        <span class="modal__title">Hello, vue-final-modal</span>
        <div class="modal__content">
          <p v-for="i in 5" :key="i">
            Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
          </p>
        </div>
        <div class="modal__action">
          <v-button highlight @click="showConfirmModal = true">confirm</v-button>
          <v-button @click="showModal = false">cancel</v-button>
        </div>
      </vue-final-modal>

      <!-- Second modal -->
      <vue-final-modal v-model="showConfirmModal" classes="modal-container" content-class="modal-content">
        <button class="modal__close" @click="showConfirmModal = false">
          <mdi-close></mdi-close>
        </button>
        <span class="modal__title">Confirm</span>
        <div class="modal__content">Confirm to submit.</div>
        <div class="modal__action">
          <v-button @click="confirm">confirm</v-button>
          <v-button @click="showConfirmModal = false">cancel</v-button>
        </div>
      </vue-final-modal>

      <v-button @click="showModal = true">Open modal</v-button>
    </div>
  </template>
  ```

  ```vue
  <script>
  export default {
    data: () => ({
      showModal: false,
      showConfirmModal: false
    }),
    methods: {
      confirm() {
        this.showConfirmModal = false
        this.showModal = false
      }
    }
  }
  </script>
  ```

  ```vue
  <style scoped>
  ::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 90%;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
  }
  .modal__title {
    margin: 0 2rem 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  .modal__content {
    flex-grow: 1;
    overflow-y: auto;
  }
  .modal__action {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    padding: 1rem 0 0;
  }
  .modal__close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
  </style>

  <style scoped>
  .dark-mode div::v-deep .modal-content {
    border-color: #2d3748;
    background-color: #1a202c;
  }
  </style>
  ```

  </sfc-view>

- **無障礙**

  <v-accessibility class="mb-4"></v-accessibility>

  <sfc-view>

  ```vue
  <template>
    <vue-final-modal ... focus-trap>
      ...modal content
    </vue-final-modal>
  </template>
  ```

  </sfc-view>