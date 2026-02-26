// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, off } from 'firebase/database';

// 🔥 Ключи теперь берутся из переменных окружения!
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Функция для подписки на изменения планов
export const subscribeToPlans = (callback) => {
  const plansRef = ref(db, 'plans');
  
  onValue(plansRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  });
  
  return () => off(plansRef);
};

// Функция для сохранения планов
export const savePlansToCloud = async (plans) => {
  const plansRef = ref(db, 'plans');
  try {
    await set(plansRef, plans);
    console.log('✅ Планы сохранены в облаке');
    return true;
  } catch (error) {
    console.error('❌ Ошибка сохранения:', error);
    return false;
  }
};