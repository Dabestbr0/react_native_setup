import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Vibration, Button } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { SettingsContext } from '../contexts/SettingsData';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const RunTimerStart = () => {
  const navigation = useNavigation(); // Initialize the navigation object
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
  const stopwatchIntervalRef = useRef(null); // Ref to store the stopwatch interval
  const timerIntervalRef = useRef(null); // Ref to store the timer interval

  useEffect(() => {
    if (isRandomEnabled) {
      setGetSet_Interval(Math.floor(Math.random() * 10) + 1);
    }
  }, [isRandomEnabled, setGetSet_Interval]);

  useEffect(() => {
    if (isVibrationEnabled) {
      Vibration.vibrate();
    }
  }, [isVibrationEnabled]);

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

        console.log('Playing On Your Mark sound');
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

  useEffect(() => {
    if (timer === 0) {
      if (word === 'On Your Marks...') {
        setWord('Get Set...');
        setTimer(GetSet_interval);
        setProgress(1);
        setRunningPosition(require('../assets/images/getsetposition.png'));
        console.log('Playing Get Set sound');
        getSetSound && getSetSound.playAsync();
      } else if (word === 'Get Set...') {
        setWord('GO!');
        setTimer(0);
        setProgress(1);
        setRunningPosition(require('../assets/images/goposition.png'));
        console.log('Playing GO sound');
        goSound && goSound.playAsync();
        setRunning(true);
        setIsStopwatchRunning(true);
        setStartTime(new Date()); // Record start time
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

  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatch(prevTime => prevTime + 1);
      }, 10);
    } else {
      clearInterval(stopwatchIntervalRef.current);
    }

    return () => clearInterval(stopwatchIntervalRef.current);
  }, [isStopwatchRunning]);

  const endRun = async () => {
    setIsStopwatchRunning(false);
    clearInterval(stopwatchIntervalRef.current); // Clear the interval immediately
    clearInterval(timerIntervalRef.current); // Clear the interval for timer as well

    const finishTime = new Date(); // Record finish time
    setFinishTime(finishTime);

    // Calculate time elapsed
    const timeElapsed = stopwatch / 100; // in seconds

    // Save run data to AsyncStorage
    const runData = {
      date: startTime.toISOString().split('T')[0],
      startTime: startTime.toLocaleTimeString(),
      finishTime: finishTime.toLocaleTimeString(),
      timeElapsed: formatTime(stopwatch)
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
    navigation.navigate('Home'); // Navigate back to the Home screen
  };

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 6000)).padStart(2, '0');
    const seconds = String(Math.floor((time % 6000) / 100)).padStart(2, '0');
    const milliseconds = String(time % 100).padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bold}>
        {word}
      </Text>
      <Progress.Circle
        size={200}
        progress={progress}
        showsText={true}
        formatText={() => isStopwatchRunning ? formatTime(stopwatch) : timer.toString()}
        textStyle={styles.progressText}
        thickness={10}
        color="#FFD700"
        borderWidth={0}
      />
      <Image
        source={runningPosition}
        style={styles.image}
      />
      {running && (
        <Button title="Stop Run" onPress={endRun} />
      )}
    </View>
  );
};

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
    marginTop: 20,
  },
});

export default RunTimerStart;


