<template>
  <ClientOnly>
    <div ref="demoblock" :class="['demoblock', blockClass, customClass ? customClass : '']">
      <div class="demoblock-view">
        <slot />
      </div>
      <div class="demoblock-divider demoblock-divider--horizontal"></div>
      <div class="demoblock-op-btns">
        <Tooltip v-if="false" placement="top" :content="locale['edit-in-editor']">
          <RiFlaskLine class="demoblock-op-btn" @click="onPlaygroundClick" />
        </Tooltip>
        <Tooltip v-if="false" placement="top" :content="locale['edit-on-github']">
          <RiGithubLine class="demoblock-op-btn" />
        </Tooltip>
        <Tooltip placement="top" :content="locale['copy-code']">
          <RiFileCopyLine class="demoblock-op-btn" @click="onCopy" />
        </Tooltip>
        <Tooltip placement="top" :content="locale['view-source']">
          <RiCodeLine class="demoblock-op-btn" @click="onControlClick" />
        </Tooltip>
      </div>
      <CollapseTransition>
        <div v-show="isExpanded" ref="source" class="demoblock-source">
          <div class="highlight">
            <slot name="highlight" />
          </div>
        </div>
      </CollapseTransition>
      <Transition name="demoblock-fade-in-linear">
        <div v-show="isExpanded" ref="control" class="demoblock-control" @click="onControlClick">
          <EpCaretTop class="control-icon" />
          <span class="control-text">{{ locale['hide-source'] }}</span>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<script>
import { useRoute, useData } from 'vitepress'
import { ref, computed, watch, getCurrentInstance, onMounted } from 'vue'
import { useClipboard, isClient } from '@vueuse/core'
import { usePlayground } from '../../hooks'
import message from './message'
import RiFlaskLine from '../icons/RiFlaskLine.vue'
import RiGithubLine from '../icons/RiGithubLine.vue'
import RiFileCopyLine from '../icons/RiFileCopyLine.vue'
import RiCodeLine from '../icons/RiCodeLine.vue'
import EpCaretTop from '../icons/EpCaretTop.vue'
import Tooltip from './Tooltip.vue'
import CollapseTransition from './CollapseTransition.vue'

export default {
  components: {
    RiFlaskLine,
    RiGithubLine,
    RiFileCopyLine,
    RiCodeLine,
    EpCaretTop,
    Tooltip,
    CollapseTransition
  },
  props: {
    customClass: String,
    sourceCode: String,
    options: String // JSON.stringify
  },
  setup(props, ctx) {
    // ====================== Hooks ======================
    const { copy } = useClipboard()
    const data = useData()
    const route = useRoute()

    // ====================== Lifecycle ======================
    let instance
    onMounted(() => {
      instance = getCurrentInstance()
    })
    watch(
      () => route.path,
      path => {
        pathArr.value = path.split('/')
      }
    )

    // ====================== Components ======================
    const pathArr = ref(route.path.split('/'))
    const component = computed(() => pathArr.value[pathArr.value.length - 1].split('.')[0])
    const blockClass = computed(() => {
      return `demo-${component.value}`
    })

    const source = ref(null)
    const control = ref(null)
    const demoblock = ref(null)

    // Playground
    const onPlaygroundClick = () => {
      const { link } = usePlayground(props.sourceCode)
      if (!isClient) return
      window.open(link)
    }

    // Expand
    const isExpanded = ref(false)
    const onControlClick = () => {
      isExpanded.value = !isExpanded.value
    }

    const locale = computed(() => {
      return (
        data.theme.value.demoblock?.[data.localeIndex.value] ?? {
          // 'view-source': 'View source',
          // 'hide-source': 'Hide source',
          // 'edit-in-editor': 'Edit in Playground',
          // 'edit-on-github': 'Edit on GitHub',
          // 'copy-code': 'Copy code',
          // 'copy-success': 'Copy success',
          // 'copy-error': 'Copy error',
          'view-source': '查看源代码',
          'hide-source': '隐藏源代码',
          'edit-in-editor': '在 Playground 中编辑',
          'edit-on-github': '在 Github 中编辑',
          'copy-code': '复制代码',
          'copy-success': '复制成功',
          'copy-error': '复制失败'
        }
      )
    })

    // Copy
    const onCopy = async () => {
      const options = JSON.parse(props.options)
      try {
        copy(props.sourceCode)
        if (options.onCopySuccess) {
          const onCopySuccess = eval(options.onCopySuccess)
          onCopySuccess(instance, locale.value['copy-success'])
        } else {
          message.success(locale.value['copy-success'])
        }
      } catch (err) {
        if (options.onCopyError) {
          const onCopyError = eval(options.onCopyError)
          onCopyError(instance, locale.value['copy-error'])
        } else {
          message.error(locale.value['copy-error'])
        }
      }
    }

    return {
      blockClass,
      locale,
      source,
      control,
      demoblock,
      isExpanded,
      onControlClick,
      onCopy,
      onPlaygroundClick
    }
  }
}
</script>

<style scoped>
:global(.vp-doc .demoblock div[class*='language-']) {
  border-radius: 0 !important;
}

:global(.highlight div[class*='language-']) {
  margin: 0 !important;
}

.demoblock {
  margin: 10px 0;
  border: solid 1px var(--demoblock-border);
  border-radius: 3px;
  transition: 0.2s;
}

.demoblock {
  --demoblock-op-btn-color: #909399;
  --demoblock-op-btn-hover-color: #303133;
}

html.dark .demoblock {
  --demoblock-op-btn-color: #a3a6ad;
  --demoblock-op-btn-hover-color: #e5eaf3;
}

.demoblock-view {
  box-sizing: border-box;
  padding: 24px;
  transition: 0.2s;
  overflow: auto;
}

.demoblock-divider {
  position: relative;
}

.demoblock-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  border-top: 1px solid var(--demoblock-border);
}

.demoblock-op-btns {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
}

.demoblock-op-btn {
  margin: 0 0.5rem;
  cursor: pointer;
  font-size: 16px;
  color: var(--demoblock-op-btn-color);
  transition: 0.2s;
}
.demoblock-op-btn:hover {
  color: var(--demoblock-op-btn-hover-color);
}

.demoblock-source {
  overflow: hidden;
}

.demoblock-control {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--demoblock-border);
  height: 44px;
  box-sizing: border-box;
  background-color: var(--demoblock-control-bg);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-top: -1px;
  color: var(--demoblock-control);
  cursor: pointer;
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.demoblock-control .control-icon {
  display: inline-block;
  font-size: 18px;
}

.demoblock-control .control-text {
  margin-left: 10px;
  font-size: 14px;
}

.demoblock-control:hover {
  color: var(--vp-c-brand);
}
</style>
