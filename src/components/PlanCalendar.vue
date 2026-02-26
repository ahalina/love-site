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

        <!-- Индикатор загрузки -->
        <div v-if="isLoading" class="loading">
            <i class="fas fa-spinner fa-spin"></i> Загрузка планов...
        </div>

        <!-- Индикатор синхронизации -->
        <div v-if="syncStatus" class="sync-status" :class="{ error: syncStatus.includes('❌') }">
            <i :class="syncStatus.includes('✅') ? 'fas fa-check-circle' :
                syncStatus.includes('❌') ? 'fas fa-exclamation-circle' :
                    'fas fa-sync-alt fa-spin'"></i>
            {{ syncStatus }}
        </div>

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

            <div v-for="day in daysInMonth" :key="day" class="calendar-day" :class="{
                'today': isToday(day),
                'selected': selectedDay === day,
                'has-plans': hasPlans(day)
            }" @click="selectDay(day)">
                <span class="day-number">{{ day }}</span>

                <div class="plan-indicators">
                    <span v-for="(plan, index) in getPlansForDay(day).slice(0, 3)" :key="index" class="plan-dot"
                        :style="{ backgroundColor: plan.color || '#ff6b6b' }" :title="plan.text"></span>
                    <span v-if="getPlansForDay(day).length > 3" class="more-dot">
                        +{{ getPlansForDay(day).length - 3 }}
                    </span>
                </div>
            </div>
        </div>

        <div v-if="selectedDay" class="plans-panel">
            <div class="plans-header">
                <h4>
                    <i class="fas fa-calendar-check"></i>
                    Планы на {{ selectedDay }} {{ currentMonthName }}
                </h4>
                <button @click="showAddForm = true" class="add-plan-btn">
                    <i class="fas fa-plus"></i> Добавить план
                </button>
            </div>


            <div v-if="showAddForm" class="add-plan-form">
                <input v-model="newPlan.text" type="text" placeholder="Что планируем?" class="plan-input"
                    @keyup.enter="addPlan">
                <div class="plan-form-controls">
                    <select v-model="newPlan.color" class="plan-color-select">
                        <option value="#ff6b6b">❤️ Красный</option>
                        <option value="#4ecdc4">💙 Бирюзовый</option>
                        <option value="#ffb6c1">💗 Розовый</option>
                        <option value="#764ba2">💜 Фиолетовый</option>
                        <option value="#4caf50">💚 Зеленый</option>
                        <option value="#ff9f4b">🧡 Оранжевый</option>
                    </select>
                    <button @click="addPlan" class="save-plan-btn">
                        <i class="fas fa-save"></i> {{ editingPlanIndex !== null ? 'Сохранить' : 'Добавить' }}
                    </button>
                    <button @click="cancelEdit" class="cancel-plan-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div class="plans-list">
                <div v-for="(plan, index) in getPlansForDay(selectedDay)" :key="index" class="plan-item"
                    :style="{ borderLeftColor: plan.color }">
                    <div class="plan-content">
                        <span class="plan-text">{{ plan.text }}</span>
                    </div>
                    <div class="plan-actions">
                        <button @click="editPlan(index)" class="edit-plan-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button @click="deletePlan(index)" class="delete-plan-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <p v-if="getPlansForDay(selectedDay).length === 0" class="no-plans">
                    ✨ Пока нет планов на этот день
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { subscribeToPlans, savePlansToCloud } from '../firebase'

const emit = defineEmits(['close'])


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

const prevMonth = () => {
    currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
    currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}


const selectedDay = ref(null)

const selectDay = (day) => {
    selectedDay.value = day
}


const plans = ref({})
const isLoading = ref(true)
const syncStatus = ref('')
let unsubscribe = null

// Подписка на Firebase
onMounted(() => {
    isLoading.value = true
    syncStatus.value = '🔄 Загрузка планов...'

    unsubscribe = subscribeToPlans((data) => {
        plans.value = data
        isLoading.value = false
        syncStatus.value = '✅ Синхронизировано'

        setTimeout(() => {
            syncStatus.value = ''
        }, 3000)
    })
})

// Отписка
onUnmounted(() => {
    if (unsubscribe) {
        unsubscribe()
    }
})

// Автосохранение в Firebase
watch(plans, (newPlans) => {
    if (!isLoading.value) {
        syncStatus.value = '🔄 Сохранение...'
        savePlansToCloud(newPlans).then((success) => {
            if (success) {
                syncStatus.value = '✅ Сохранено'
            } else {
                syncStatus.value = '❌ Ошибка сохранения'
            }
            setTimeout(() => {
                syncStatus.value = ''
            }, 3000)
        })
    }
}, { deep: true })


const getDateKey = (day) => {
    return `${currentYear.value}-${currentMonth.value + 1}-${day}`
}

const getPlansForDay = (day) => {
    const key = getDateKey(day)
    return plans.value[key] || []
}

const hasPlans = (day) => {
    return getPlansForDay(day).length > 0
}


const showAddForm = ref(false)
const editingPlanIndex = ref(null)

const newPlan = ref({
    text: '',
    color: '#ff6b6b'
})

const addPlan = () => {
    if (!newPlan.value.text.trim() || !selectedDay.value) return

    const key = getDateKey(selectedDay.value)

    if (!plans.value[key]) {
        plans.value[key] = []
    }

    if (editingPlanIndex.value !== null) {

        plans.value[key][editingPlanIndex.value] = { ...newPlan.value }
        editingPlanIndex.value = null
    } else {

        plans.value[key].push({ ...newPlan.value })
    }


    newPlan.value = { text: '', color: '#ff6b6b' }
    showAddForm.value = false
}

const editPlan = (index) => {
    const key = getDateKey(selectedDay.value)
    const plan = plans.value[key][index]
    newPlan.value = { ...plan }
    editingPlanIndex.value = index
    showAddForm.value = true
}

const deletePlan = (index) => {
    if (!confirm('Удалить этот план?')) return

    const key = getDateKey(selectedDay.value)
    plans.value[key].splice(index, 1)

    if (plans.value[key].length === 0) {
        delete plans.value[key]
    }
}

const cancelEdit = () => {
    newPlan.value = { text: '', color: '#ff6b6b' }
    editingPlanIndex.value = null
    showAddForm.value = false
}
</script>



<style scoped>
.loading {
    text-align: center;
    padding: 10px;
    color: #764ba2;
    font-size: 0.95em;
}

.sync-status {
    margin: 10px 0;
    padding: 8px;
    border-radius: 8px;
    background: #e8f5e9;
    color: #2e7d32;
    text-align: center;
    font-size: 0.9em;
}

.sync-status.error {
    background: #ffebee;
    color: #c62828;
}

.fa-spin {
    animation: fa-spin 2s infinite linear;
}

@keyframes fa-spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.plans-panel {
    background: white;
    border-radius: 15px;
    padding: 20px;
    margin-top: 20px;
    border: 2px solid #ffb6c1;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}


.plans-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    flex-wrap: wrap;
    gap: 10px;
}

.plans-header h4 {
    color: #764ba2;
    font-size: 1.1em;
    display: flex;
    align-items: center;
    gap: 8px;
}


.add-plan-btn {
    background: #4ecdc4;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9em;
}

.add-plan-btn:hover {
    background: #45b7b7;
    transform: scale(1.05);
}

.add-plan-form {
    background: #f8f0ff;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
    animation: slideDown 0.3s;
}

.plan-input {
    width: 100%;
    padding: 10px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1em;
    margin-bottom: 10px;
    transition: border-color 0.3s;
}

.plan-input:focus {
    outline: none;
    border-color: #764ba2;
}

.plan-form-controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.plan-color-select {
    padding: 8px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    flex: 1;
    min-width: 120px;
}

.save-plan-btn {
    background: #4caf50;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 5px;
}

.save-plan-btn:hover {
    background: #45a049;
    transform: scale(1.05);
}

.cancel-plan-btn {
    background: #ff6b6b;
    color: white;
    border: none;
    width: 35px;
    height: 35px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cancel-plan-btn:hover {
    background: #ff5252;
    transform: scale(1.05);
}

.plans-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 300px;
    overflow-y: auto;
    padding-right: 5px;
}


.plan-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f8f0ff;
    border-radius: 10px;
    border-left: 4px solid #ff6b6b;
    animation: slideIn 0.3s;
    transition: transform 0.2s;
}

.plan-item:hover {
    transform: translateX(5px);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.plan-content {
    flex: 1;
}

.plan-text {
    color: #2c3e50;
    font-size: 1em;
}

/* Кнопки действий */
.plan-actions {
    display: flex;
    gap: 5px;
}

.edit-plan-btn,
.delete-plan-btn {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.edit-plan-btn {
    background: #764ba2;
}

.edit-plan-btn:hover {
    background: #8a5fc0;
    transform: scale(1.1);
}

.delete-plan-btn {
    background: #ff6b6b;
}

.delete-plan-btn:hover {
    background: #ff5252;
    transform: scale(1.1);
}


.no-plans {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 20px;
}

.plans-list::-webkit-scrollbar {
    width: 5px;
}

.plans-list::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
}

.plans-list::-webkit-scrollbar-thumb {
    background: #ff6b6b;
    border-radius: 10px;
}

.plans-list::-webkit-scrollbar-thumb:hover {
    background: #ff5252;
}




.calendar-day.has-plans {
    background: #f8f0ff;
    font-weight: bold;
}


.plan-indicators {
    display: flex;
    gap: 3px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 5px;
}


.plan-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    transition: transform 0.2s;
}

.plan-dot:hover {
    transform: scale(1.5);
}

.more-dot {
    font-size: 0.7em;
    color: #666;
    background: #e0e0e0;
    border-radius: 10px;
    padding: 0 4px;
    min-width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}


.calendar-day.selected .plan-dot {
    transform: scale(1.1);
}

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