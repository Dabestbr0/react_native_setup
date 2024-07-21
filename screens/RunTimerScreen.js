import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Vibration, Button, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { SettingsContext } from '../contexts/SettingsData';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';

const RunTimerStart = () => {
  const navigation = useNavigation();
  const {
    OnYourMark_interval,
    GetSet_interval,
    setGetSet_Interval,
    isVibrationEnabled,
    isRandomEnabled,
  } = useContext(SettingsContext);

  const [timer, setTimer] = useState(OnYourMark_interval);
  const [word, setWord] = useState('On Your Marks...');
  const [progress, setProgress] = useState(1);
  const [onYourMarkSound, setOnYourMarkSound] = useState(null);
  const [getSetSound, setGetSetSound] = useState(null);
  const [goSound, setGoSound] = useState(null);
  const [runningPosition, setRunningPosition] = useState(require('../assets/images/onyourmarksposition.png'));
  const [running, setRunning] = useState(false);
  const [stopwatch, setStopwatch] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
  const stopwatchIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // State variables for step tracking
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [pedometerAvailability, setPedometerAvailability] = useState("");
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [pedometerSubscription, setPedometerSubscription] = useState(null);

  const windowHeight = Dimensions.get("window").height;
  const stepsToMeters = 0.762;
  const distanceFromSteps = stepCount * stepsToMeters;
  const distanceCovered = distanceFromSteps.toFixed(2);
  const caloriesBurnt = ((distanceCovered * 0.5) / 1000).toFixed(2);

  // Effect to randomize Get Set interval
  useEffect(() => {
    if (isRandomEnabled) {
      setGetSet_Interval(Math.floor(Math.random() * 10) + 1);
    }
  }, [isRandomEnabled, setGetSet_Interval]);

  // Effect to trigger vibration
  useEffect(() => {
    if (isVibrationEnabled) {
      Vibration.vibrate();
    }
  }, [isVibrationEnabled]);

  // Effect to load audio files
  useEffect(() => {
    const loadSounds = async () => {
      const onYourMark = new Audio.Sound();
      const getSet = new Audio.Sound();
      const go = new Audio.Sound();

      try {
        await onYourMark.loadAsync(require('../assets/audio/OnYourMarks_SoundEffect.mp3'));
        await getSet.loadAsync(require('../assets/audio/GetSet_SoundEffect.mp3'));
        await go.loadAsync(require('../assets/audio/GO!_SoundEffect.mp3'));

        setOnYourMarkSound(onYourMark);
        setGetSetSound(getSet);
        setGoSound(go);

        await onYourMark.playAsync();
      } catch (error) {
        console.log('Failed to load sounds', error);
      }
    };

    loadSounds();

    return () => {
      onYourMarkSound && onYourMarkSound.unloadAsync();
      getSetSound && getSetSound.unloadAsync();
      goSound && goSound.unloadAsync();
    };
  }, []);

  // Effect to handle timer logic and running status
  useEffect(() => {
    if (timer === 0) {
      if (word === 'On Your Marks...') {
        Vibration.vibrate();
        setWord('Get Set...');
        setTimer(GetSet_interval);
        setProgress(1);
        setRunningPosition(require('../assets/images/getsetposition.png'));
        getSetSound && getSetSound.playAsync();
      } else if (word === 'Get Set...') {
        setWord('GO!');
        setTimer(0);
        setProgress(1);
        setRunningPosition(require('../assets/images/goposition.png'));
        goSound && goSound.playAsync();
        setRunning(true);
        setIsStopwatchRunning(true);
        setStartTime(new Date());
        startTracking(); // Start tracking steps and location
      }
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer(prevTime => {
        const newTime = prevTime - 1;
        setProgress(newTime / OnYourMark_interval);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [timer, word, GetSet_interval, getSetSound, goSound, OnYourMark_interval]);

  // Effect to handle stopwatch logic
  useEffect(() => {
    stopwatchIntervalRef.current = setInterval(() => {
      if (isStopwatchRunning) {
        setStopwatch(prevTime => prevTime + 1);
      }
    }, 10);

    return () => clearInterval(stopwatchIntervalRef.current);
  }, [isStopwatchRunning]);

  // Function to start tracking location and steps
  const startTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    const locSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (newLocation) => {
        setLocation(newLocation);
      }
    );
    setLocationSubscription(locSubscription);

    const pedSubscription = Pedometer.watchStepCount((result) => {
      setStepCount(result.steps);
    });
    setPedometerSubscription(pedSubscription);

    Pedometer.isAvailableAsync().then(
      (result) => {
        setPedometerAvailability(String(result));
      },
      (error) => {
        setPedometerAvailability(error);
      }
    );
  };

  // Function to stop tracking location and steps
  const stopTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
    if (pedometerSubscription) {
      pedometerSubscription.remove();
      setPedometerSubscription(null);
    }
  };

  // Function to handle end of run
  const endRun = async () => {
    setIsStopwatchRunning(false);
    clearInterval(stopwatchIntervalRef.current);
    clearInterval(timerIntervalRef.current);
    stopTracking(); // Stop tracking steps and location

    const finishTime = new Date();
    setFinishTime(finishTime);

    const todayDate = format(new Date(), 'yyyy-MM-dd');
    const runData = {
      date: todayDate,
      startTime: startTime.toLocaleTimeString(),
      finishTime: finishTime.toLocaleTimeString(),
      timeElapsed: formatTime(stopwatch),
      steps: stepCount,
      distance: distanceCovered,
      calories: caloriesBurnt,
    };

    try {
      const storedRuns = await AsyncStorage.getItem('runHistory');
      const runHistory = storedRuns ? JSON.parse(storedRuns) : [];
      runHistory.push(runData);

      await AsyncStorage.setItem('runHistory', JSON.stringify(runHistory));
    } catch (error) {
      console.error('Failed to save run data', error);
    }

    setRunning(false);
    navigation.navigate('Home');
  };

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 6000)).padStart(2, '0');
    const seconds = String(Math.floor((time % 6000) / 100)).padStart(2, '0');
    const milliseconds = String(time % 100).padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bold}>{word}</Text>
      <Progress.Circle
        size={200}
        progress={progress}
        showsText={true}
        formatText={() => (isStopwatchRunning ? formatTime(stopwatch) : timer.toString())}
        textStyle={styles.progressText}
        thickness={10}
        color="#FFD700"
        borderWidth={0}
      />
      <Image
        source={runningPosition}
        style={styles.image}
        resizeMode="contain"
      />
      {running && (
        <Button title="Stop Run" onPress={endRun} />
      )}
      {running && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Steps: {stepCount}</Text>
          <Text style={styles.infoText}>Distance: {distanceCovered} meters</Text>
          <Text style={styles.infoText}>Calories: {caloriesBurnt} kcal</Text>
        </View>
      )}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242c45',
  },
  bold: {
    fontSize: 32,
    color: '#FFD700',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 40,
    color: '#FFD700',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#FFD700',
  },
});

export default RunTimerStart; // Export the RunTimerStart component