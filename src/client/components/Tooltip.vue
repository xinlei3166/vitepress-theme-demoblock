<template>
  <div class="demoblock-tooltip">
    <div ref="reference" class="demoblock-tooltip-trigger" v-on="componentProps">
      <slot />
    </div>
    <div v-show="showFloating" ref="floating" class="demoblock-tooltip-content">{{ content }}</div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { offset, flip, shift, computePosition } from '@floating-ui/vue'

export default {
  props: {
    placement: { type: String, default: 'top' },
    content: { type: String, default: '' }
  },
  setup(props) {
    const reference = ref(null)
    const floating = ref(null)
    const showFloating = ref(false)

    function update() {
      computePosition(reference.value, floating.value, {
        placement: props.placement,
        middleware: [offset(11), flip(), shift()]
      }).then(({ x, y, placement, middlewareData }) => {
        Object.assign(floating.value?.style, {
          left: 0,
          top: 0,
          transform: `translate(${x}px, ${y}px)`,
          willChange: 'transform',
          pointerEvents: 'none'
        })
      })
    }

    function showTooltip() {
      showFloating.value = true
      update()
    }

    function hideTooltip() {
      showFloating.value = false
    }

    const componentProps = {
      mouseenter: showTooltip,
      mouseleave: hideTooltip,
      focus: showTooltip,
      blur: hideTooltip
    }

    return {
      reference,
      floating,
      showFloating,
      componentProps,
      showTooltip
    }
  }
}
</script>

<style scoped>
.demoblock-tooltip {
  position: relative;
}

.demoblock-tooltip-content {
  display: inline-block;
}

.demoblock-tooltip-content {
  width: max-content;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  inset: 0 auto auto 0;
  border-radius: 4px;
  padding: 5px 11px;
  font-size: 12px;
  line-height: 20px;
  min-width: 10px;
  word-wrap: break-word;
}

.demoblock-tooltip-content {
  color: #ffffff;
  background: #303133;
  border: 1px solid #303133;
}

html.dark .demoblock-tooltip-content {
  color: #141414;
  background: #e5eaf3;
  border: 1px solid #e5eaf3;
}
</style>
