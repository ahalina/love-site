<template>
  <div class="falling-hearts">
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
    <div class="falling-heart">❤️</div>
  </div>
  <div class="app-container">
    <h1>
      Привет, {{ boyfriendName }}!
      <span class="heart">❤️</span>
    </h1>

    <p class="message-row">{{ message }}</p>

    <div class="button-group">
      <button v-if="!showCounter" @click="showCounter = true" class="button">
        <i class="fas fa-calendar-alt"></i>
        Показать счетчик дней
      </button>

      <button @click="showLoveMessage" class="button secondary">
        <i class="fas fa-heart"></i>
        Показать сообщение
      </button>

      <button v-if="!showPhoto" @click="showPhoto = true" class="button third">
        <i class="fas fa-camera"></i>
        Показать фото
      </button>

      <button v-if="!showTest" @click="showTest = true" class="button fourth">
        <i class="fas fa-pencil"></i>
        Показать тест
      </button>
    </div>

    <button v-if="!showCalendar" @click="showCalendar = true" class="button fifth">
      <i class="fas fa-calendar-alt"></i>
      Наш календарь
    </button>


    <DayCounter v-if="showCounter" :start-date="startDate" :today="today" @close="showCounter = false" />

    <LoveMessage v-if="showMessage" :message="loveMessage" />

    <PhotoGallery v-if="showPhoto" :photos="photos" @close="showPhoto = false" />

    <LoveTest v-if="showTest" @close="showTest = false" />

    <PlanCalendar v-if="showCalendar" @close="showCalendar = false" />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import DayCounter from './components/DayCounter.vue'
import LoveMessage from './components/LoveMessage.vue'
import PhotoGallery from './components/PhotoGallery.vue'
import LoveTest from './components/LoveTest.vue'
import PlanCalendar from './components/PlanCalendar.vue'


const boyfriendName = ref('Никита')
const message = ref('Ты мой самый любимый мальчик')
const showMessage = ref(false)
const loveMessage = ref('')
const showCounter = ref(false)
const showPhoto = ref(false)
const showTest = ref(false)

const startDate = ref(new Date(2025, 8, 3))
const today = ref(new Date())

const showCalendar = ref(false)

const photos = ref([
  {
    thumb: new URL('./assets/photos/photo3.png', import.meta.url).href,
    full: new URL('./assets/photos/photo3.png', import.meta.url).href,
    caption: 'Наше первое фото'
  },
  {
    thumb: new URL('./assets/photos/photo1.png', import.meta.url).href,
    full: new URL('./assets/photos/photo1.png', import.meta.url).href,
    caption: 'И мы счастливы'
  },
  {
    thumb: new URL('./assets/photos/photo4.png', import.meta.url).href,
    full: new URL('./assets/photos/photo4.png', import.meta.url).href,
    caption: 'Мой любимый'
  },
  {
    thumb: new URL('./assets/photos/photo2.png', import.meta.url).href,
    full: new URL('./assets/photos/photo2.png', import.meta.url).href,
    caption: 'Наша прогулка'
  },
  {
    thumb: new URL('./assets/photos/photo5.png', import.meta.url).href,
    full: new URL('./assets/photos/photo5.png', import.meta.url).href,
    caption: 'Ты и я'
  }
])


const loveMessages = [
  'Я тебя очень сильно люблю! 💕',
  'Ты самый лучший на свете! 💖',
  'Я скучаю по тебе каждый день 🥺',
  'Ты мое счастье ✨',
  'Обожаю тебя до луны и обратно 🌙',
  'С тобой каждый день как праздник 🎉',
  'Ты моя половинка ❤️',
  'Я так рада, что ты у меня есть 🌸',
  'Ты делаешь мою жизнь ярче 🌈',
  'Мое сердце бьется только для тебя 💓',
  'Ты мой самый родной человечек 🤗',
  'Спасибо, что ты просто есть 🙏',
  'Ты мой наркотик счастья ✨',
  'Я люблю тебя больше жизни 💝',
  'Ты лучшее, что случилось в моей жизни 🌟'
]


function showLoveMessage() {

  const randomIndex = Math.floor(Math.random() * loveMessages.length)
  loveMessage.value = loveMessages[randomIndex]
  showMessage.value = true


  setTimeout(() => {
    showMessage.value = false
  }, 3000)
}
</script>

<style scoped></style>