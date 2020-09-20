<template>
  <iframe
    height="600"
    style="width: 100%;"
    scrolling="no"
    title="Plain style - Vue Final Modal"
    src="https://codepen.io/hunterliu1003/embed/ZEWoYeE?height=265&theme-id=dark&default-tab=js,result"
    frameborder="no"
    loading="lazy"
    allowtransparency="true"
    allowfullscreen="true"
  >
    See the Pen
    <a href="https://codepen.io/hunterliu1003/pen/ZEWoYeE"
      >Plain style - Vue Final Modal</a
    >
    by Hunter (<a href="https://codepen.io/hunterliu1003">@hunterliu1003</a>) on
    <a href="https://codepen.io">CodePen</a>.
  </iframe>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

<style>
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  position: relative;
  width: 50%;
  max-height: 300px;
  padding: 16px;
  overflow: auto;
  background-color: #fff;
  border-radius: 4px;
}
.modal-close {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  margin: 8px 8px 0 0;
  cursor: pointer;
}
.modal-close::hover {
  color: gray;
}
</style>
