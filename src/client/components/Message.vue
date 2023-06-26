<template>
  <transition-group name="demoblock-fade-transition" tag="div" class="demoblock-messages">
    <template v-for="item in messages" :key="item.name">
      <div class="demoblock-message-wrap">
        <div :class="['demoblock-message', item.type ? `demoblock-message--${item.type}` : '']">
          <component :is="components[item.type]" class="demoblock-message-icon" />
          <div class="demoblock-message-content">{{ item.content }}</div>
        </div>
      </div>
    </template>
  </transition-group>
</template>

<script>
import { ref, defineComponent } from 'vue'
import FluentCheckmarkCircle16Filled from '../icons/FluentCheckmarkCircle16Filled.vue'
import FluentDismissCircle16Filled from '../icons/FluentDismissCircle16Filled.vue'
import FluentErrorCircle16Filled from '../icons/FluentErrorCircle16Filled.vue'

let seed = 0
function getUuid() {
  return 'message_' + seed++
}
export default defineComponent({
  components: {
    FluentCheckmarkCircle16Filled,
    FluentDismissCircle16Filled,
    FluentErrorCircle16Filled
  },
  setup() {
    const components = {
      info: 'FluentErrorCircle16Filled',
      success: 'FluentCheckmarkCircle16Filled',
      warning: 'FluentDismissCircle16Filled',
      error: 'FluentErrorCircle16Filled'
    }

    const messages = ref([])
    function add(props) {
      const name = getUuid()
      const _message = { name, show: true, ...props }
      messages.value.push(_message)
      const duration = props.duration
      setTimeout(() => {
        remove(name)
      }, duration * 1000)
    }
    function remove(name) {
      for (const [i, v] of messages.value.entries()) {
        if (v.name === name) {
          messages.value.splice(i, 1)
          break
        }
      }
    }
    function hidden(name) {
      const message = messages.value.find(x => x.name === name)
      message.show = false
    }

    return { components, messages, add, remove }
  }
})
</script>

<style scoped>
.demoblock-messages {
  /*position: fixed;
width: 100%;
top: 16px;
pointer-events: none;
display: flex;
flex-direction: column;
align-items: center;
z-index: 1000;*/

  transition: color 0.3s var(--demoblock-bezier) 0s,
    background-color 0.3s var(--demoblock-bezier) 0s;

  z-index: 6000;
  position: fixed;
  height: 0;
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: center;

  top: 12px;
  left: 0;
  right: 0;
}

.demoblock-messages {
  --demoblock-bezier: cubic-bezier(0.4, 0, 0.2, 1);
  --demoblock-icon-color-info: #2080f0;
  --demoblock-icon-color-success: #18a058;
  --demoblock-icon-color-warning: #f0a020;
  --demoblock-icon-color-error: #d03050;
  --demoblock-message-text-color: rgb(51, 54, 57);
  --demoblock-message-bg-color: #fff;
}

html.dark .demoblock-messages {
  --demoblock-icon-color-info: #70c0e8;
  --demoblock-icon-color-success: #63e2b7;
  --demoblock-icon-color-warning: #f2c97d;
  --demoblock-icon-color-error: #e88080;
  --demoblock-message-text-color: rgba(255, 255, 255, 0.82);
  --demoblock-message-bg-color: rgb(72, 72, 78);
}

.demoblock-message-wrap {
  margin: 0 0 8px 0;
  z-index: 0;
  transform-origin: top center;
  display: flex;
  align-items: flex-start;
}

.demoblock-message {
  display: flex;
  align-items: center;
  transition: color 0.3s var(--demoblock-bezier), box-shadow 0.3s var(--demoblock-bezier),
    background-color 0.3s var(--demoblock-bezier), opacity 0.3s var(--demoblock-bezier),
    transform 0.3s var(--demoblock-bezier), margin-bottom 0.3s var(--demoblock-bezier);
  padding: 10px 20px;
  border-radius: 3px;
  flex-wrap: nowrap;
  overflow: hidden;
  max-width: 720px;
  color: var(--demoblock-message-text-color);
  background-color: var(--demoblock-message-bg-color);
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.demoblock-message-icon {
  position: relative;
  margin: 0 10px 0 0;
  height: 23px;
  width: 23px;
  font-size: 23px;
  flex-shrink: 0;
  transition: color 0.3s var(--demoblock-bezier);
}

/*.demoblock-message .demoblock-message-icon > * {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}*/

.demoblock-message .demoblock-message-icon {
  transition: color 0.3s var(--demoblock-bezier);
}

.demoblock-message--info .demoblock-message-icon {
  color: var(--demoblock-icon-color-info);
}
.demoblock-message--success .demoblock-message-icon {
  color: var(--demoblock-icon-color-success);
}
.demoblock-message--warning .demoblock-message-icon {
  color: var(--demoblock-icon-color-warning);
}
.demoblock-message--error .demoblock-message-icon {
  color: var(--demoblock-icon-color-error);
}

.demoblock-message-content {
  display: inline-block;
  line-height: 1.6;
  font-size: 14px;
}

/*.demoblock-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.demoblock-fade-leave-active {
  position: absolute;
}

.demoblock-fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}*/

.demoblock-fade-transition-leave-from,
.demoblock-fade-transition-enter-to {
  transform: scale(1);
  opacity: 1;
}

.demoblock-fade-transition-leave-to,
.demoblock-fade-transition-enter-from {
  transform: scale(0.85);
  opacity: 0;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.demoblock-fade-transition-leave-active {
  overflow: visible;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s,
    opacity 0.3s var(--demoblock-bezier) 0s, margin-top 0.3s var(--demoblock-bezier) 0s,
    margin-bottom 0.3s var(--demoblock-bezier) 0s, padding-top 0.3s var(--demoblock-bezier) 0s,
    padding-bottom 0.3s var(--demoblock-bezier) 0s, transform 0.3s var(--demoblock-bezier);
}

.demoblock-fade-transition-enter-active {
  overflow: visible;
  transition: max-height 0.3s var(--demoblock-bezier), opacity 0.3s cubic-bezier(0.4, 0, 1, 1),
    margin-top 0.3s var(--demoblock-bezier), margin-bottom 0.3s var(--demoblock-bezier),
    padding-top 0.3s var(--demoblock-bezier), padding-bottom 0.3s var(--demoblock-bezier),
    transform 0.3s var(--demoblock-bezier);
}
</style>
