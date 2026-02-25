<template>
    <div class="calendar-container">
        <button @click="$emit('close')" class="close-button">
            <i class="fas fa-times"></i>
        </button>
        <h3 class="calendar-title">
            <i class="fas fa-calendar-alt"></i>
            Наш календарь планов
            <i class="fas fa-calendar-alt"></i>
        </h3>

        <div class="calendar-header">
            <button @click="prevMonth" class="month-nav">
                <i class="fas fa-chevron-left"></i>
            </button>
            <h2 class="month-year">{{ currentMonthName }} {{ currentYear }}</h2>
            <button @click="nextMonth" class="month-nav">
                <i class="fas fa-chevron-right"></i>
            </button>

        </div>

        <div class="weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday">
                {{ day }}
            </div>
        </div>


        <div class="calendar-grid">

            <div v-for="n in emptyDays" :key="'empty-' + n" class="calendar-day empty"></div>
            <div v-for="day in daysInMonth" :key="day" class="calendar-day" :class="{ 'today': isToday(day) }">
                <span class="day-number">{{ day }}</span>
            </div>
        </div>

    </div>
</template>

<script setup>

import { ref, computed } from 'vue'


const currentDate = ref(new Date())


const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => {
    return new Date(currentYear.value, currentMonth.value).toLocaleString('ru', { month: 'long' })
})


const daysInMonth = computed(() => {

    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})


const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const prevMonth = () => {
    currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}


const nextMonth = () => {
    currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}
const emptyDays = computed(() => {
    const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1
})


const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() &&
        currentMonth.value === today.getMonth() &&
        currentYear.value === today.getFullYear()
}


const selectedDay = ref(null)

const selectDay = (day) => {
    selectedDay.value = day
    console.log('Выбран день:', day)
}


</script>

<style scoped>
.calendar-container {
    background: linear-gradient(135deg, #fff9f9, #fff0f5);
    border-radius: 20px;
    padding: 25px;
    margin: 25px 0;
    border: 2px dashed #ff6b6b;
    position: relative;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: #ff6b6b;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-button:hover {
    background: #ff5252;
}

.calendar-title {
    color: #764ba2;
    margin-bottom: 20px;
    font-size: 1.3em;
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
}

.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    background: white;
    padding: 10px;
    border-radius: 50px;
}

.month-nav {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #764ba2;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.month-nav:hover {
    background: #8a5fc0;
}

.month-year {
    color: #764ba2;
    font-size: 1.3em;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    margin-bottom: 10px;
}

.weekday {
    text-align: center;
    font-weight: bold;
    color: #666;
    padding: 10px;
    font-size: 0.9em;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    margin-bottom: 20px;
}

.calendar-day {
    aspect-ratio: 1;
    background: white;
    border-radius: 10px;
    padding: 5px;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.calendar-day:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
    border-color: #ff6b6b;
}

.calendar-day.empty {
    background: transparent;
    box-shadow: none;
    cursor: default;
}

.calendar-day.empty:hover {
    transform: none;
    border-color: transparent;
}

.day-number {
    font-size: 1.1em;
    font-weight: bold;
    color: #2c3e50;
}

.calendar-day.today {
    background: linear-gradient(135deg, #fff0f5, #ffe4e1);
    border-color: #ff6b6b;
    font-weight: bold;
}
</style>