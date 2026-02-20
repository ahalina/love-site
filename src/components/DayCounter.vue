<template>
  <div class="counter-container">
    <button @click="$emit('close')" class="close-button">
      <i class="fas fa-times"></i>
    </button>

    <div class="days-number">{{ daysTogether }}</div>
    <div class="days-label">дней вместе</div>

    <div class="date-info">
      <span>
        <i class="fas fa-calendar-alt"></i>
        Начали: {{ formatDate(startDate) }}
      </span>
      <span>
        <i class="fas fa-calendar-check"></i>
        Сегодня: {{ formatDate(today) }}
      </span>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
    </div>

    <div class="weeks-info">
      <span><i class="fas fa-clock"></i> {{ weeksTogether }} недель</span>
      <span><i class="fas fa-moon"></i> {{ monthsTogether }} месяцев</span>
      <span><i class="fas fa-star"></i> {{ remainingDays }} дней до года</span>
    </div>

    <p class="day-message">
      <i class="fas fa-heart"></i>
      {{ dayMessage }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  startDate: Date,
  today: Date
})

defineEmits(['close'])

const daysTogether = computed(() => {
  const diffTime = Math.abs(props.today - props.startDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const weeksTogether = computed(() => Math.floor(daysTogether.value / 7))
const monthsTogether = computed(() => Math.floor(daysTogether.value / 30))
const remainingDays = computed(() => 365 - (daysTogether.value % 365))
const progressPercentage = computed(() => (daysTogether.value % 365) * 100 / 365)

const dayMessage = computed(() => {
  const days = daysTogether.value
  if (days < 90) return '🌸 Уже целый сезон!'
  if (days < 180) return '🌞 Полгода счастья!'
  if (days < 365) return '🎉 Скоро годовщина!'
  if (days === 365) return '🎊 С ГОДОВЩИНОЙ! 🎊'
  return '💖 Каждый день с тобой особенный!'
})

function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0')
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const y = date.getFullYear()
  return `${d}.${m}.${y}`
}
</script>

<style scoped>
.counter-container::before {
    content: "❤️";
    position: absolute;
    font-size: 60px;
    opacity: 0.1;
    left: -10px;
    bottom: -10px;
    transform: rotate(15deg);
    z-index: 0;
}

.day-message {
    margin-top: 15px;
    color: #764ba2;
    font-style: italic;
    position: relative;
    z-index: 1;
}
.close-button {
  position: absolute !important;
  top: 10px !important;
  right: 10px !important;
  padding: 8px 12px !important;
  margin: 0 !important;
  background: #ff6b6b !important;
  min-width: auto !important;
  width: 35px !important;
  height: 35px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 1.2em !important;
  z-index: 10 !important;
}
            
        

.close-button:hover {
    background: #ff5252 !important;
    transform: scale(1.1) !important;
}

.counter-container {
    background: linear-gradient(135deg, #f8f0ff, #f0e6ff);
    border-radius: 20px;
    padding: 25px;
    margin: 25px 0;
    text-align: center;
    border: 2px dashed #764ba2;
    position: relative;
    overflow: visible;
    animation: slideDown 0.5s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

         

.counter-container::after {
    content: "❤️";
    position: absolute;
    font-size: 60px;
    opacity: 0.1;
    right: -10px;
    top: -10px;
    transform: rotate(-15deg);
    z-index: 0;
}



.days-number {
    font-size: 4em;
    font-weight: bold;
    color: #764ba2;
    line-height: 1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
}

.days-label {
    font-size: 1.2em;
    color: #666;
    margin: 10px 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
    z-index: 1;
}

.date-info {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 15px 0;
    color: #888;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
}

.date-info span {
    background: white;
    padding: 5px 15px;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.progress-bar {
    width: 100%;
    height: 10px;
    background: #e0e0e0;
    border-radius: 5px;
    margin: 20px 0;
    overflow: hidden;
    position: relative;
    z-index: 1;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff6b6b, #ffb6c1);
    width: v-bind(progressPercentage + '%');
    transition: width 0.5s ease;
}

.weeks-info {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;
    color: #666;
    background: rgba(255, 255, 255, 0.5);
    padding: 10px;
    border-radius: 10px;
    position: relative;
    z-index: 1;
}
</style>