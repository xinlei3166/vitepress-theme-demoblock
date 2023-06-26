<template>
  <div class="demoblock" :class="[customClass ? customClass : '']">
    <div class="demoblock-view">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DemoBlock',
  props: {
    customClass: String
  }
})
</script>

<style scoped>
.demoblock {
  margin: 10px 0;
}
.demoblock .demoblock-view {
  border: solid 1px var(--demoblock-border);
  border-radius: 3px;
  box-sizing: border-box;
  padding: 24px;
  transition: 0.2s;
}
</style>
