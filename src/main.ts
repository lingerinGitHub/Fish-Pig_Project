import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { initRouter } from './router/index'
import 'element-plus/dist/index.css'; // 引入element-plus样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
const pinia = createPinia()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
initRouter(app)

app.use(pinia)

app.mount('#app')
