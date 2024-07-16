import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import { SettingsContext } from '../contexts/SettingsData';

const RunTimerStart = () => {
  const {
    OnYourMark_interval,
    GetSet_interval,
    setGetSet_Interval,
    isVibrationEnabled,
    isRandomEnabled,
  } = useContext(SettingsContext);

  const [timer, setTimer] = useState(OnYourMark_interval);
  const [word, setWord] = useState('On Your Marks...');
  const [onYourMarkSound, setOnYourMarkSound] = useState(null);
  const [getSetSound, setGetSetSound] = useState(null);
  const [goSound, setGoSound] = useState(null);
  const [runningPosition, setRunningPosition] = useState(require('../assets/images/onyourmarksposition.png'));

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
        setRunningPosition(require('../assets/images/getsetposition.png'));
        console.log('Playing Get Set sound');
        getSetSound && getSetSound.playAsync();
      } else if (word === 'Get Set...') {
        setWord('GO!');
        setTimer(0);
        setRunningPosition(require('../assets/images/goposition.png'));
        console.log('Playing GO sound');
        goSound && goSound.playAsync();
      }
    }

    const intervalId = setInterval(() => {
      setTimer(prevTime => prevTime - 1);
    }, 1000);

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
    width: 200,
    height: 200,
  },
});

export default RunTimerStart;
