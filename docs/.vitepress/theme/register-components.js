import TableDemo from '../components/table/demo.vue'
import Demo from '../../../components/Demo.vue'
import DemoBlock from '../../../components/DemoBlock.vue'
export function registerComponents(app) {
  app.component('TableDemo', TableDemo)
  app.component('Demo', Demo)
  app.component('DemoBlock', DemoBlock)
}
