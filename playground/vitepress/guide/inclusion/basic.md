##  来自 inclusion

inclusion

## 基础用法 <Badge type="info" text="default" />

基础的卡片用法。

:::demo

```vue
<template>
  <div class="card-wrap">
    <div class="card">{{ title }}</div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const title = ref('vitepress-theme-demoblock')

    return { title }
  }
})
</script>

<style>
.card-wrap {
  text-align: center;
}

.card-wrap .card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  color: pink;
  background: var(--vp-c-bg);
  border: 1px solid pink;
  height: 80px;
  width: 600px;
}
</style>
```

:::


## Setup TypeScript <Badge type="tip" text="^2.3.0" />

setup typescript 用法。

:::demo

```vue
<template>
  <div class="card-wrap">
    <div class="card">{{ title }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface IObject {
  [k: string]: any
}

const title = ref<any>('vitepress-theme-demoblock')
const cardWidth = ref<string>('600px')
</script>

<style scoped>
.card-wrap {
  text-align: center;
}

.card-wrap .card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  color: var(--vp-c-brand);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand);
  height: 80px;
  width: v-bind('cardWidth');
}
</style>
```

:::


## Jsx <Badge type="tip" text="^2.3.0" />

tsx 用法。

:::demo

```jsx
import { defineComponent, ref } from 'vue'
import '@alias/styles/index.css'

export default defineComponent({
  setup() {
    const title = ref('vitepress-theme-demoblock')
    
    return () => (
      <div class="card-wrap card-wrap--card">
        <div class="card">{ title.value }</div>
      </div>
    )
  }
})
```

:::

## Tsx <Badge type="tip" text="^2.3.0" />

tsx 用法。

:::demo

```tsx
import { defineComponent, ref } from 'vue'
import '@alias/styles/index.css'

interface IObject {
  [k: string]: any
}

export default defineComponent({
  setup() {
    const title = ref<any>('vitepress-theme-demoblock')
    
    return () => (
      <div class="card-wrap card-wrap--card">
        <div class="card">{ title.value }</div>
      </div>
    )
  }
})
```

:::

