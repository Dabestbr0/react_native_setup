import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Vibration, Button, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SettingsContext } from '../contexts/SettingsData';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';

const RunTimerStart2 = () => {
  const navigation = useNavigation();
  const {
    OnYourMark_interval,
    GetSet_interval,
    setGetSet_Interval,
    isVibrationEnabled,
    isRandomEnabled,
    distanceGoal,
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

  // State variables for tracking
  const [gpsDistance, setGpsDistance] = useState(0);
  const [steps, setSteps] = useState(0);
  const [location, setLocation] = useState(null);
  const [caloriesBurnt, setCaloriesBurnt] = useState(0);
  const calorieFactorPerMeter = 1.36 / 1000; 
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [accelerometerSubscription, setAccelerometerSubscription] = useState(null);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);  // Might be added later.
  const windowHeight = Dimensions.get('window').height;


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
        await onYourMark.loadAsync(
          require("../assets/audio/OnYourMarks_SoundEffect.mp3")
        );
        await getSet.loadAsync(
          require("../assets/audio/GetSet_SoundEffect.mp3")
        );
        await go.loadAsync(require("../assets/audio/GO!_SoundEffect.mp3"));

        setOnYourMarkSound(onYourMark);
        setGetSetSound(getSet);
        setGoSound(go);

        await onYourMark.playAsync();
      } catch (error) {
        console.log("Failed to load sounds", error);
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
      if (word === "On Your Marks...") {
        Vibration.vibrate();
        setWord("Get Set...");
        setTimer(GetSet_interval);
        setProgress(1);
        setRunningPosition(require("../assets/images/getsetposition.png"));
        getSetSound && getSetSound.playAsync();
      } else if (word === "Get Set...") {
        setWord("GO!");
        setTimer(0);
        setProgress(1);
        setRunningPosition(require("../assets/images/goposition.png"));
        goSound && goSound.playAsync();
        setRunning(true);
        setIsStopwatchRunning(true);
        setStartTime(new Date());
        startTracking();
      }
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTime) => {
        const newTime = prevTime - 1;
        setProgress(newTime / OnYourMark_interval);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [timer, word, GetSet_interval, getSetSound, goSound, OnYourMark_interval]);

  useEffect(() => {
    stopwatchIntervalRef.current = setInterval(() => {
      if (isStopwatchRunning) {
        setStopwatch((prevTime) => prevTime + 1);
      }
    }, 10);

    return () => clearInterval(stopwatchIntervalRef.current);
  }, [isStopwatchRunning]);

  useEffect(() => {
    if (!location) {
   //   console.log("Waiting for GPS to initialize...");
    } else {
   //   console.log("GPS is working:", location);
    }
  }, [location]);

  // End the run if GPS distance meets the goal
  useEffect(() => {
    if (distanceGoal != null && gpsDistance >= distanceGoal && word === "GO!") {
      endRun();
    }
  }, [gpsDistance, distanceGoal, word]);

  const previousLocationRef = useRef(null);

  const startTracking = async () => {
    const locSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 500,
        distanceInterval: 1,
      },
      (newLocation) => {
        //    console.log('New location received:', newLocation);
        // Get the max Speed
        const speed = newLocation.coords.speed; // Speed is in meters/second
      //  console.log("New speed received:", speed);

        // Update maxSpeed if the new speed is greater
        setMaxSpeed((prevMaxSpeed) => {
          if (speed > prevMaxSpeed) {
         /*   console.log(
              `New Max Speed: ${speed.toFixed(
                2
              )} (Previous: ${prevMaxSpeed.toFixed(2)})` 
            ); */
            return speed; // Return the new max speed
          }
          return prevMaxSpeed; // Return the previous max speed
        });

        // Get the distance tracked
        if (previousLocationRef.current) {
          // Get the Distance
          const dist = haversineDistance(
            previousLocationRef.current.coords.latitude,
            previousLocationRef.current.coords.longitude,
            newLocation.coords.latitude,
            newLocation.coords.longitude
          );
          setGpsDistance((gpsDistance) => gpsDistance + dist);
        } else {
          // Set the previous location to the first received location
          previousLocationRef.current = newLocation; // Update the ref
         // console.log("Previous location set:", newLocation);
        }
      }
    );
    setLocationSubscription(locSubscription);

    Accelerometer.setUpdateInterval(100);
    const accSubscription = Accelerometer.addListener((accelerometerData) => {
      const acceleration = Math.sqrt(
        accelerometerData.x ** 2 +
          accelerometerData.y ** 2 +
          accelerometerData.z ** 2
      );
      const threshold = 1.2; //Adjust value
      if (acceleration > threshold) {
        setSteps((prevSteps) => prevSteps + 1);
      }
    });
    setAccelerometerSubscription(accSubscription);
  };

  useEffect(() => {
//    console.log("Max Speed updated to:", maxSpeed.toFixed(2));
  }, [maxSpeed]);

  const stopTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
    if (accelerometerSubscription) {
      accelerometerSubscription.remove();
      setAccelerometerSubscription(null);
    }
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371e3;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    setCaloriesBurnt((gpsDistance * calorieFactorPerMeter).toFixed(2));
  }, [gpsDistance]);

  const endRun = async () => {
    setIsStopwatchRunning(false);
    clearInterval(stopwatchIntervalRef.current);
    clearInterval(timerIntervalRef.current);
    stopTracking();

    const finishTime = new Date();
    setFinishTime(finishTime);

    const todayDate = format(new Date(), "yyyy-MM-dd");
    const runData = {
      date: todayDate,
      startTime: startTime.toLocaleTimeString(),
      finishTime: finishTime.toLocaleTimeString(),
      timeElapsed: formatTime(stopwatch),
      steps: steps,
      distance: gpsDistance.toFixed(2),
      calories: caloriesBurnt,
      maxSpeed: maxSpeed.toFixed(2),
    };

    try {
      const storedRuns = await AsyncStorage.getItem("runHistory");
      const runHistory = storedRuns ? JSON.parse(storedRuns) : [];
      runHistory.push(runData);

      await AsyncStorage.setItem("runHistory", JSON.stringify(runHistory));
    } catch (error) {
      console.error("Failed to save run data", error);
    }

    setRunning(false);
    setGpsDistance(0);
    setSteps(0);
    setCaloriesBurnt(0);
    setMaxSpeed(0);
    navigation.navigate("RunHistory");
  };

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 6000)).padStart(2, "0");
    const seconds = String(Math.floor((time % 6000) / 100)).padStart(2, "0");
    const milliseconds = String(time % 100).padStart(2, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bold}>{word}</Text>
      <Progress.Circle
        size={200}
        progress={progress}
        showsText={true}
        formatText={() =>
          isStopwatchRunning ? formatTime(stopwatch) : timer.toString()
        }
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
      {running && <Button title="Stop Run" onPress={endRun} />}
      {running && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Steps: {steps}</Text>
          <Text style={styles.infoText}>
            Distance: {gpsDistance.toFixed(2)} meters
          </Text>
          <Text style={styles.infoText}>Calories: {caloriesBurnt} cal</Text>
          <Text style={styles.infoText}>
            Max Speed: {maxSpeed.toFixed(2)} meters per second
          </Text>
        </View>
      )}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#242c45",
  },
  bold: {
    fontSize: 32,
    color: "#FFD700",
    marginBottom: 10,
    fontWeight: "bold",
  },
  progressText: {
    fontSize: 40,
    color: "#FFD700",
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
    color: "#FFD700",
  },
});

export default RunTimerStart2;
