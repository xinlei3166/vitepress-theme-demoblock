import { defineCustomElement } from 'vue'

export default defineCustomElement({
  name: 'CustomButton',
  setup(props) {
    return () => <button class="custom-button"><slot>按钮</slot></button>
  }
})
