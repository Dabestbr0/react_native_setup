import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform, Image, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';
import { SettingsContext } from '../contexts/SettingsData';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';

const HomeContent = () => {
    const navigation = useNavigation();
    const { distanceGoal, setDistanceGoal } = useContext(SettingsContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalRuns, setTotalRuns] = useState(0);
    const [personalBest, setPersonalBest] = useState(null);
    const [progress, setProgress] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [timeGreeting, setTimeGreeting] = useState('');
    const [dailyQuote, setDailyQuote] = useState('');

    useEffect(() => {
        if (auth.currentUser?.displayName) {
            const nameParts = auth.currentUser.displayName.split(' ');
            setFirstName(nameParts[0]);
        }
        fetchRunData();
        setGreetingMessage();
        setMotivationalQuote();
    }, []);

    useEffect(() => {
        if (progress >= 1) {
            handleGoalReached();
        }
    }, [progress]);

    const setGreetingMessage = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setTimeGreeting('Good Morning');
        } else if (currentHour < 18) {
            setTimeGreeting('Good Afternoon');
        } else {
            setTimeGreeting('Good Evening');
        }
    };

    const setMotivationalQuote = () => {
        const quotes = [
            "Don’t watch the clock; do what it does. Keep going.",
            "The only way to achieve the impossible is to believe it is possible.",
            "You are your only limit.",
            "Push yourself because no one else is going to do it for you.",
            "Success is what comes after you stop making excuses."
        ];
        const today = new Date().getDate();
        setDailyQuote(quotes[today % quotes.length]);
    };

    const fetchRunData = async () => {
        try {
            const storedRuns = await AsyncStorage.getItem('runHistory');
            const runHistory = storedRuns ? JSON.parse(storedRuns) : [];

            let distance = 0;
            runHistory.forEach(run => {
                distance += parseFloat(run.distance);
            });

            const bestRun = runHistory.reduce((best, run) => {
                const [minutes, seconds, milliseconds] = run.timeElapsed.split(':').map(Number);
                const totalMilliseconds = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
                if (!best || totalMilliseconds < best.totalMilliseconds) {
                    return { ...run, totalMilliseconds };
                }
                return best;
            }, null);

            setTotalDistance(distance.toFixed(2));
            setTotalRuns(runHistory.length);
            setPersonalBest(bestRun ? bestRun.timeElapsed : 'N/A');
            if (distanceGoal) {
                setProgress(distance / distanceGoal);
            }
        } catch (error) {
            console.error('Failed to fetch run data', error);
        }
    };

    const selectDistance = (value) => {
        setDistanceGoal(value);
        setModalVisible(false);
    };

    const requestBackgroundLocationPermissions = async () => {
        try {
            if (Platform.OS === 'android') {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Foreground location permission not granted');
                    return;
                }
            }

            let { status: statusBackground } = await Location.requestBackgroundPermissionsAsync({
                rationale: 'We need access to your location in the background to provide accurate run tracking even when the app is closed.',
            });

            if (statusBackground !== 'granted') {
                console.error('Background location permission not granted');
                return;
            }

            navigation.navigate('RunTimerStart');
        } catch (error) {
            console.error('Error requesting location permissions:', error);
        }
    };

    const handleGoalReached = () => {
        Alert.alert(
            'Congratulations!',
            'You have reached your distance goal!',
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
                { text: 'Set New Goal', onPress: () => setModalVisible(true) }
            ],
            { cancelable: false }
        );
    };

    return (
        <ImageBackground 
            source={{ uri: 'https://d2w9rnfcy7mm78.cloudfront.net/20123634/original_603a3a7a1e06dead8c2838f090575ff1.gif?1675116798' }} 
            style={styles.background}
            blurRadius={3}
        >
            <View style={styles.headerContainer}>
                <Image source={require('../assets/logo2.png')} style={styles.logo} />
                <Text style={styles.logoText}>SPRINT O' CLOCK</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.userInfoContainer}>
                    <Text style={styles.welcome}>{timeGreeting}, {firstName}!</Text>
                </View>
                <View style={styles.motivationContainer}>
                    <Text style={styles.motivationText}>{dailyQuote}</Text>
                    <Progress.Bar 
                        progress={progress} 
                        width={null} 
                        height={10} 
                        color='#00FF00' 
                        unfilledColor='#FFFFFF' 
                        borderWidth={0} 
                        borderRadius={5} 
                        style={styles.progressBar} 
                    />
                    <Text style={styles.progressLabel}>Progress towards goal</Text>
                </View>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>Total Distance: {totalDistance} meters</Text>
                    <Text style={styles.statsText}>Total Runs: {totalRuns}</Text>
                    <Text style={styles.statsText}>Personal Best: {personalBest}</Text>
                </View>
                <View style={styles.footer}>
                    {distanceGoal !== null && (
                        <Text style={styles.goalText}>Current Goal: {distanceGoal}m</Text>
                    )}

                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={requestBackgroundLocationPermissions}
                    >
                        <Text style={styles.buttonText}>START RUN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={styles.setAGoalButton}
                    >
                        <Text style={styles.buttonText}>SET GOAL</Text>
                    </TouchableOpacity>

                    <Modal visible={modalVisible} transparent animationType="slide">
                        <View style={styles.modalContainer}>
                            <ScrollView contentContainerStyle={styles.modalContent}>
                                {distanceOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={styles.modalItem}
                                        onPress={() => selectDistance(option.value)}
                                    >
                                        <Text style={styles.modalItemText}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </Modal>
                </View>
            </View>
        </ImageBackground>
    );
};

const distanceOptions = [
    { label: 'None', value: null },
    { label: '60m', value: 60 },
    { label: '100m', value: 100 },
    { label: '200m', value: 200 },
    { label: '300m', value: 300 },
    { label: '400m', value: 400 },
    { label: '800m', value: 800 },
    { label: '1600m', value: 1600 },
];

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: '#FFFFFF', // White background
        paddingTop: 30,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },    
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        textShadowColor: '#FF8C00', // Add black shadow
        textShadowOffset: { width: -1, height: 1 }, // Adjust shadow offset
        textShadowRadius: 6, // Adjust shadow radius
        color: '#FF8C00',
    },
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        paddingTop: 80, // Adjusted to accommodate the new header
    },
    userInfoContainer: {
        alignItems: 'center',
        marginTop: 20, // Adjusted margin to place it below the header
    },
    welcome: {
        fontSize: 23, // Adjusted font size for better visibility
        fontWeight: 'bold',
        color: '#000', // Changed to white for better visibility
        textShadowColor: '#000', // Add black shadow
        textShadowOffset: { width: -1, height: 1 }, // Adjust shadow offset
        textShadowRadius: 2, // Adjust shadow radius
        marginBottom: 5,
    },
    motivationContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    motivationText: {
        fontSize: 19, // Adjusted font size for better visibility
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#FF8C00', // Changed to white for better visibility
        textShadowColor: '#000', // Add black shadow
        textShadowOffset: { width: -1, height: 0.2 }, // Adjust shadow offset
        textShadowRadius: 10, // Adjust shadow radius
        textAlign: 'center',
        marginBottom: 10,
    },
    progressBar: {
        width: '80%',
        marginBottom: 10,
    },
    progressLabel: {
        fontSize: 14,
        color: '#00FF00',
        textShadowColor: '#000',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
    },
    statsContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    statsText: {
        fontSize: 18,
        color: '#FFF', // Changed to white for better visibility
        textShadowColor: '#008C00', // Add black shadow
        textShadowOffset: { width: -1, height: 1 }, // Adjust shadow offset
        textShadowRadius: 50, // Adjust shadow radius
        marginBottom: 5,
    },
    goalText: {
        fontSize: 20,
        color: '#FFF', // Changed to white for better visibility
        textShadowColor: '#000', // Add black shadow
        textShadowOffset: { width: -1, height: 1 }, // Adjust shadow offset
        textShadowRadius: 2, // Adjust shadow radius
        marginBottom: 20,
        fontWeight: 'bold',
    },
    startButton: {
        width: '90%',
        height: 70,
        borderRadius: 15, // Make the button circular
        backgroundColor: '#FF8C00', // Dark orange background
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 20,
    },
    setAGoalButton: {
        width: '90%',
        height: 70,
        borderRadius: 15,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 20,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
        maxHeight: 400,
    },
    modalItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalItemText: {
        fontSize: 16,
    },
});

export default HomeContent;
