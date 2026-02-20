<template>
  <div class="photo-container">
    <button @click="$emit('close')" class="close-button">
      <i class="fas fa-times"></i>
    </button>

    <h3 class="photo-title">
      <i class="fas fa-heart"></i>
      Наши лучшие моменты
      <i class="fas fa-heart"></i>
    </h3>

    <div class="photo-scroll">
      <div 
        v-for="(photo, index) in photos" 
        :key="index" 
        class="photo-card" 
        @click="openPhoto(index)"
      >
        <img :src="photo.thumb" :alt="photo.caption" class="photo-card-img">
        <div class="photo-card-caption">
          <i class="fas fa-heart"></i>
          {{ photo.caption }}
        </div>
      </div>
    </div>

    <div class="scroll-hint">
      <i class="fas fa-arrow-right"></i> Листай вправо 
      <i class="fas fa-arrow-right"></i>
    </div>

    <!-- ИСПРАВЛЕННОЕ МОДАЛЬНОЕ ОКНО -->
    <div v-if="showModal" class="photo-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close-photo" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>

        <button 
          class="modal-nav-photo prev" 
          @click="prevPhoto" 
          :disabled="currentIndex === 0"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <img 
          :src="photos[currentIndex].full" 
          :alt="photos[currentIndex].caption" 
          class="modal-image"
        >

        <button 
          class="modal-nav-photo next" 
          @click="nextPhoto" 
          :disabled="currentIndex === photos.length - 1"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <div class="modal-photo-caption">
          {{ photos[currentIndex].caption }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  photos: Array
})

defineEmits(['close'])

const showModal = ref(false)
const currentIndex = ref(0)

function openPhoto(index) {
  currentIndex.value = index
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  document.body.style.overflow = ''
}

function prevPhoto() {
  if (currentIndex.value > 0) currentIndex.value--
}

function nextPhoto() {
  if (currentIndex.value < props.photos.length - 1) currentIndex.value++
}
</script>

<style scoped>
.photo-container {
  background: linear-gradient(135deg, #f0f9ff, #e6f0fa);
  border-radius: 20px;
  padding: 25px;
  margin: 25px 0;
  border: 2px dashed #4ecdc4;
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

.photo-title {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3em;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: center;
  justify-content: center;
}

.photo-scroll {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 15px 5px;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: #4ecdc4 #f0f0f0;
}

.photo-scroll::-webkit-scrollbar {
  height: 8px;
}

.photo-scroll::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 10px;
}

.photo-scroll::-webkit-scrollbar-thumb {
  background: #4ecdc4;
  border-radius: 10px;
}

.photo-scroll::-webkit-scrollbar-thumb:hover {
  background: #45b7b7;
}

.photo-card {
  flex: 0 0 auto;
  width: 200px;
  scroll-snap-align: start;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid transparent;
}

.photo-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 30px rgba(78, 205, 196, 0.3);
  border-color: #4ecdc4;
}

.photo-card-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  transition: transform 0.3s;
}

.photo-card:hover .photo-card-img {
  transform: scale(1.1);
}

.photo-card-caption {
  padding: 10px;
  text-align: center;
  color: #2c3e50;
  font-size: 0.9em;
  background: white;
  font-style: italic;
}

/* ===== СТИЛИ ДЛЯ МОДАЛЬНОГО ОКНА ===== */
.photo-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
}

.modal-photo-caption {
  color: white;
  text-align: center;
  margin-top: 15px;
  font-size: 1.2em;
  font-style: italic;
}

.modal-close-photo {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 50px;
  height: 50px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10;
}

.modal-close-photo:hover {
  transform: scale(1.1);
  background: #ff5252;
}

.modal-nav-photo {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10;
}

.modal-nav-photo:hover:not(:disabled) {
  background: rgba(78, 205, 196, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.modal-nav-photo.prev {
  left: -70px;
}

.modal-nav-photo.next {
  right: -70px;
}

.modal-nav-photo:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.scroll-hint {
  text-align: center;
  margin-top: 15px;
  color: #666;
  font-size: 0.9em;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
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
  z-index: 10;
}

.close-button:hover {
  background: #ff5252;
  transform: scale(1.1);
}
</style>