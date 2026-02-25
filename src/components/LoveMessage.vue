<template>
  <div class="love-message">
    <i class="fas fa-heart"></i>
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String
})

</script>

<style scoped>
.love-message {
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #fff0f5, #ffe4e1);
  border-radius: 10px;
  color: #764ba2;
  animation: fadeIn 0.5s;
  border: 2px solid #ffb6c1;
  text-align: center;
  font-size: 1.2em;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>