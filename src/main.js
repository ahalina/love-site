import { createApp } from 'vue'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css'

createApp(App).mount('#app')
console.log('Компоненты:', {
  DayCounter: typeof DayCounter,
  LoveMessage: typeof LoveMessage,
  // ... остальные
})
