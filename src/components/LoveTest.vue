<template>
  <div class="test-container" v-if="!showTest">
    <button @click="startTest" class="start-test-btn">
      Начать тест и получить подарок 🎁
    </button>
  </div>

  <div v-else class="test-container">
    <button @click="$emit('close')" class="close-button">
      <i class="fas fa-times"></i>
    </button>

    <h3 class="test-title">
      <i class="fas fa-heart"></i>
      Тест для Никиты
      <i class="fas fa-heart"></i>
    </h3>


    <div v-if="!testCompleted" class="question-block">
      <h4 class="question">{{ questions[currentQuestion].text }}</h4>
      
      <div class="options">
        <div 
          v-for="(option, index) in questions[currentQuestion].options" 
          :key="index"
          class="option"
          :class="{ 
            selected: selectedOption === index,
            correct: showResult && index === questions[currentQuestion].correct,
            wrong: showResult && selectedOption === index && index !== questions[currentQuestion].correct
          }"
          @click="selectOption(index)"
        >
          {{ option }}
          <span v-if="showResult && index === questions[currentQuestion].correct" class="result-icon">
            <i class="fas fa-check-circle"></i>
          </span>
          <span v-else-if="showResult && selectedOption === index && index !== questions[currentQuestion].correct" class="result-icon">
            <i class="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div class="test-controls">
        <button 
          v-if="showResult && currentQuestion < questions.length - 1"
          @click="nextQuestion"
          class="next-btn"
        >
          Следующий вопрос <i class="fas fa-arrow-right"></i>
        </button>
        <button 
          v-if="showResult && currentQuestion === questions.length - 1"
          @click="finishTest"
          class="finish-btn"
        >
          Узнать результат <i class="fas fa-gift"></i>
        </button>
        <button 
          v-if="!showResult && selectedOption !== null"
          @click="checkAnswer"
          class="check-btn"
        >
          Проверить <i class="fas fa-check"></i>
        </button>
      </div>

  
      <div class="score" v-if="score > 0">
        Правильных ответов: {{ score }} / {{ questions.length }}
      </div>
    </div>


    <div v-else class="result-block">

      <div class="result-content">
        <div class="big-heart">❤️</div>
        <h2 class="congrats">ПОЗДРАВЛЯЮ! 🎉</h2>
        <p class="result-message">
          Ты ответил правильно на {{ score }} из {{ questions.length }} вопросов!
        </p>
        <div class="gift-box">
          <i class="fas fa-gift"></i>
          <h3>ТВОЙ ПОДАРОК:</h3>
          <p class="gift-message">
            Бесконечная любовь и обнимашки! <br>
          </p>
        </div>
        <button @click="resetTest" class="again-btn">
          <i class="fas fa-redo"></i>
          Пройти еще раз
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, } from 'vue'

const emit = defineEmits(['close'])


const showTest = ref(false)
const currentQuestion = ref(0)
const selectedOption = ref(null)
const showResult = ref(false)
const score = ref(0)
const testCompleted = ref(false)

const questions = ref([
  {
    text: 'Какой цвет глаз у Алины ?',
    options: ['Карие', 'Голубые', 'Зеленые', 'Серые'],
    correct: 0 
  },
  {
    text: 'Какое любимое блюдо Алины?',
    options: ['Пельмени', 'Мамина еда', 'Суши', 'Борщ'],
    correct: 1
  },
  {
    text: 'Где мы познакомились?',
    options: ['В парке', 'В кафе', 'В институте', 'В интернете'],
    correct: 2
  },
  {
    text: 'Какое у Алины хобби?',
    options: ['Спорт', 'Рисование', 'Музыка', 'Игры'],
    correct: 0
  },
  {
    text: 'Какой подарок Алина хочет больше всего?',
    options: ['Машину', 'Твою любовь', 'Новый телефон', 'Путешествие'],
    correct: 1
  }
])


function startTest() {
  showTest.value = true
  resetTest()
}

function selectOption(index) {
  if (!showResult.value) {
    selectedOption.value = index
  }
}

function checkAnswer() {
  if (selectedOption.value === null) return
  showResult.value = true
  if (selectedOption.value === questions.value[currentQuestion.value].correct) {
    score.value++
  }
}

function nextQuestion() {
  currentQuestion.value++
  selectedOption.value = null
  showResult.value = false
}

function finishTest() {
  testCompleted.value = true
  startConfetti()
}

function resetTest() {
  currentQuestion.value = 0
  selectedOption.value = null
  showResult.value = false
  score.value = 0
  testCompleted.value = false
}

</script>

<style scoped>
.test-container {
  background: linear-gradient(135deg, #fff9f9, #fff0f5);
  border-radius: 20px;
  padding: 25px;
  margin: 25px 0;
  border: 2px dashed #ff6b6b;
  position: relative;
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

.start-test-btn {
  background: linear-gradient(45deg, #ff6b6b, #ffb6c1);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  animation: pulse 2s infinite;
}

.start-test-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.4);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
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
  transition: all 0.3s;
  z-index: 2;
}

.close-button:hover {
  background: #ff5252;
  transform: scale(1.1);
}

.test-title {
  color: #764ba2;
  margin-bottom: 20px;
  font-size: 1.3em;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  margin: 20px 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ffb6c1);
  transition: width 0.3s ease;
}

.question-block {
  text-align: center;
}

.question {
  color: #2c3e50;
  font-size: 1.2em;
  margin: 20px 0;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.option {
  padding: 15px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.1em;
}

.option:hover:not(.selected):not(.correct):not(.wrong) {
  border-color: #ff6b6b;
  transform: translateX(5px);
}

.option.selected {
  border-color: #764ba2;
  background: #f8f0ff;
}

.option.correct {
  border-color: #4caf50;
  background: #e8f5e9;
  animation: correctFlash 0.5s;
}

.option.wrong {
  border-color: #f44336;
  background: #ffebee;
}

@keyframes correctFlash {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.result-icon {
  font-size: 1.2em;
}

.fa-check-circle {
  color: #4caf50;
}

.fa-times-circle {
  color: #f44336;
}

.test-controls {
  margin: 20px 0;
}

.check-btn, .next-btn, .finish-btn, .again-btn {
  background: #764ba2;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.check-btn:hover, .next-btn:hover, .finish-btn:hover, .again-btn:hover {
  transform: scale(1.05);
  background: #8a5fc0;
}

.finish-btn {
  background: linear-gradient(45deg, #ff6b6b, #ffb6c1);
  animation: pulse 2s infinite;
}

.score {
  margin-top: 15px;
  color: #764ba2;
  font-size: 1.1em;
  font-weight: bold;
}

/* Результат */
.result-block {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}



.result-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: popIn 0.5s;
  max-width: 400px;
}

@keyframes popIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.big-heart {
  font-size: 5em;
  animation: heartbeat 1s infinite;
  margin-bottom: 20px;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); color: #ff1744; }
}

.congrats {
  color: #ff6b6b;
  font-size: 2em;
  margin-bottom: 20px;
}

.result-message {
  color: #2c3e50;
  font-size: 1.2em;
  margin-bottom: 20px;
}

.gift-box {
  background: linear-gradient(135deg, #fff0f5, #ffe4e1);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  border: 2px dashed #ff6b6b;
}

.gift-box i {
  font-size: 3em;
  color: #ffd700;
  margin-bottom: 10px;
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}

.gift-message {
  color: #764ba2;
  font-size: 1.2em;
  line-height: 1.5;
}

.small {
  font-size: 0.9em;
  color: #666;
  font-style: italic;
}

.again-btn {
  background: #4ecdc4;
}

.again-btn:hover {
  background: #45b7b7;
}
</style>