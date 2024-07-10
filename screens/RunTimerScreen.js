import React, { useContext, useState, useEffect } from 'react'; // Import necessary hooks from React
import { View, Text, StyleSheet, Image, Vibration } from 'react-native'; // Import components from React Native
import { Audio } from 'expo-av'; // Import Audio API from Expo
import { SettingsContext } from '../contexts/SettingsData'; // Import the context for settings

const RunTimerStart = () => {
  // Destructure settings values from the context
  const {
    OnYourMark_interval,
    GetSet_interval,
    setGetSet_Interval,
    isVibrationEnabled,
    isRandomEnabled,
  } = useContext(SettingsContext);

  // State variables to manage timer, displayed word, and audio sounds
  const [timer, setTimer] = useState(OnYourMark_interval);
  const [word, setWord] = useState('On Your Marks...');
  const [onYourMarkSound, setOnYourMarkSound] = useState(null);
  const [getSetSound, setGetSetSound] = useState(null);
  const [goSound, setGoSound] = useState(null);
  const [runningPosition, setRunningPosition] = useState(require('../assets/images/onyourmarksposition.png'));

  // useEffect to set random interval if isRandomEnabled is true
  useEffect(() => {
    if (isRandomEnabled) {
      setGetSet_Interval(Math.floor(Math.random() * 10) + 1);
    }
  }, [isRandomEnabled, setGetSet_Interval]);

  // useEffect to vibrate at the start of the timer if enabled
  useEffect(() => {
    if (isVibrationEnabled) {
      Vibration.vibrate();
    }
  }, [isVibrationEnabled]);

  // useEffect to load sounds when the component mounts
  useEffect(() => {
    const loadSounds = async () => {
      const onYourMark = new Audio.Sound();
      const getSet = new Audio.Sound();
      const go = new Audio.Sound();

      try {
        // Load sound files
        await onYourMark.loadAsync(require('../assets/audio/OnYourMarks_SoundEffect.mp3'));
        await getSet.loadAsync(require('../assets/audio/GetSet_SoundEffect.mp3'));
        await go.loadAsync(require('../assets/audio/GO!_SoundEffect.mp3'));

        // Set sound state variables
        setOnYourMarkSound(onYourMark);
        setGetSetSound(getSet);
        setGoSound(go);

        // Play "On Your Mark" sound immediately after loading
        onYourMark.replayAsync();
      } catch (error) {
        console.log('Failed to load sounds', error);
      }
    };

    loadSounds();

    // Cleanup sounds when the component unmounts
    return () => {
      onYourMarkSound && onYourMarkSound.unloadAsync();
      getSetSound && getSetSound.unloadAsync();
      goSound && goSound.unloadAsync();
    };
  }, []);

  // useEffect to handle the timer and word changes
  useEffect(() => {
    if (timer === 0) {
      // When timer reaches 0, change the word and reset the timer accordingly
      if (word === 'On Your Marks...') {
        setWord('Get Set...');
        setTimer(GetSet_interval);
        setRunningPosition(require('../assets/images/getsetposition.png'));
        getSetSound.replayAsync(); // Play sound
      } else if (word === 'Get Set...') {
        setWord('GO!');
        setTimer(0); // Set to 0 or any other value if needed
        setRunningPosition(require('../assets/images/goposition.png'));
        goSound.replayAsync(); // Play sound
      }
    }

    // Set an interval to decrease the timer every second
    const intervalId = setInterval(() => {
      setTimer(prevTime => prevTime - 1);
    }, 1000);

    // Cleanup the interval on component unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [timer, word, GetSet_interval, getSetSound, goSound]);

  return (
    <View style={styles.container}>
      <Text style={styles.bold}>
        {word}
      </Text>
      <Text style={styles.bold}>
        {timer}
      </Text>
      <Image
        source={runningPosition}
        style={styles.image}
      />
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
  image: {
 
  },
});

export default RunTimerStart;
