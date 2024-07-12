// src/services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestore, auth } from './firebase';

export const storeRunData = async (runData) => {
    try {
        const user = auth().currentUser;
        if (user) {
            await firestore().collection('users').doc(user.uid).collection('runs').add(runData);
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
        const user = auth().currentUser;
        if (user) {
            const cachedData = await AsyncStorage.getItem('runs');
            if (cachedData) {
                return JSON.parse(cachedData);
            } else {
                const runCollection = await firestore().collection('users').doc(user.uid).collection('runs').get();
                const runData = runCollection.docs.map(doc => doc.data());
                await AsyncStorage.setItem('runs', JSON.stringify(runData));
                return runData;
            }
        } else {
            console.error('No user is logged in');
        }
    } catch (error) {
        console.error('Failed to fetch run data', error);
    }
};

const syncLocalWithFirestore = async () => {
    try {
        const user = auth().currentUser;
        if (user) {
            const runCollection = await firestore().collection('users').doc(user.uid).collection('runs').get();
            const runData = runCollection.docs.map(doc => doc.data());
            await AsyncStorage.setItem('runs', JSON.stringify(runData));
        } else {
            console.error('No user is logged in');
        }
    } catch (error) {
        console.error('Failed to sync local data with Firestore', error);
    }
};
