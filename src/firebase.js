
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set, off } from 'firebase/database'


const firebaseConfig = {
    apiKey: "AIzaSyBFFV2Rve92vJurgvxkQUkjdQP4h6pT3Os",
    authDomain: "love-calendar-d14cc.firebaseapp.com",
    projectId: "love-calendar-d14cc",
    storageBucket: "love-calendar-d14cc.firebasestorage.app",
    messagingSenderId: "1059277549975",
    appId: "1:1059277549975:web:ceb1c38d18f802da8794d2",
    databaseURL: "https://love-calendar-d14cc-default-rtdb.firebaseio.com/"
};




const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

// Функция для подписки на изменения планов
export const subscribeToPlans = (callback) => {
    const plansRef = ref(db, 'plans')

    onValue(plansRef, (snapshot) => {
        const data = snapshot.val()
        callback(data || {})
    })

    return () => off(plansRef)
}

// Функция для сохранения планов
export const savePlansToCloud = async (plans) => {
    const plansRef = ref(db, 'plans')
    try {
        await set(plansRef, plans)
        console.log('✅ Планы сохранены в облаке')
        return true
    } catch (error) {
        console.error('❌ Ошибка сохранения:', error)
        return false
    }
}