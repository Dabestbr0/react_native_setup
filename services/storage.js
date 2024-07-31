// src/services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebase'; // Ensure this path is correct
import { doc, setDoc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";

export const storeRunData = async (runData) => {
    try {
        const user = auth.currentUser;
        if (user) {
            await db.collection('users').doc(user.uid).collection('runs').add(runData);
            await syncLocalWithFirestore();
        } else {
            console.error('No user is logged in');
        }
    } catch (error) {
        console.error('Failed to save run data', error);
    }
};

export const getRunData = async () => {
    try {
        const data = await AsyncStorage.getItem('runData');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error fetching run data', error);
        return [];
    }
};

const syncLocalWithFirestore = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            const runCollection = await db.collection('users').doc(user.uid).collection('runs').get();
            const runData = runCollection.docs.map(doc => doc.data());
            await AsyncStorage.setItem('runs', JSON.stringify(runData));
        } else {
            console.error('No user is logged in');
        }
    } catch (error) {
        console.error('Failed to sync local data with Firestore', error);
    }
};
