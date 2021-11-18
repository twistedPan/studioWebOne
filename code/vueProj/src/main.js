import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Scroll index Varaible
Window.Scrollindex = {};
Window.Scrollindex = 0;


createApp(App).use(router).mount('#app')
