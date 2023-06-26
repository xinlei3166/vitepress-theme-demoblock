# Card

常用的卡片布局。

## 基础用法

基础的卡片用法。

:::demo

```vue
<template>
  <div class="card-wrap">
    <div class="card">{{ title }}</div>
    <el-button type="primary" style="margin: 16px 16px 0 0" @click="onClick">点击</el-button>
    <el-date-picker v-model="date" style="margin: 16px 16px 0 0" type="date" />
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { ElMessage, ElButton, ElDatePicker } from 'element-plus'

export default defineComponent({
  components: { ElMessage, ElButton, ElDatePicker },
  setup() {
    const title = ref('vitepress-theme-demoblock')
    const date = ref()

    const onClick = () => {
      ElMessage({
        message: title.value,
        type: 'success',
      })
    }

    return { title, date, onClick }
  }
})
</script>

<style lang="less" scoped>
.card-wrap {
  text-align: center;
  .card {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    color: var(--vp-c-brand);
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-brand);
    height: 80px;
    width: 600px;
  }
}
</style>
```

:::


## Setup TypeScript

setup typescript 用法。

:::demo

```vue
<template>
  <div class="card-wrap">
    <div class="card">{{ title }}</div>
    <el-button type="primary" style="margin: 16px 16px 0 0" @click="onClick">点击</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElButton } from 'element-plus'

interface IObject {
  [k: string]: any
}

const title = ref<any>('vitepress-theme-demoblock')

const onClick = () => {
  ElMessage({
    message: title.value,
    type: 'success',
  })
}
</script>

<style lang="less" scoped>
.card-wrap {
  text-align: center;
  .card {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    color: var(--vp-c-brand);
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-brand);
    height: 80px;
    width: 600px;
  }
}
</style>
```

:::

