import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { SettingsContext } from '../contexts/SettingsData'; 

const RunTimerStart = () => {
  const { 
    OnYourMark_interval, 
    GetSet_interval, 
    isVibrationEnabled, 
    isAudioEnabled, 
    isRandomEnabled 
  } = useContext(SettingsContext);


  // Adding Countdown Timer functionallity
  // Times
 //  const [OnYourMarkTimer, setOnYourMarkTimer] = useState(OnYourMark_interval);
 //  const [GetSetTimer, setGetSetTimer] = useState(GetSet_interval);
   // We could just call it Timer
   const [Timer, setTimer] = useState(OnYourMark_interval);
  // const GoGun
    const [word, setWord] = useState('On Your Mark...');

    // useEffect hook to handle the countdown logic
    useEffect(() => {
        // If time left is 0, do nothing
        if (Timer === 0) {
          if (word === 'On Your Mark...') {
            setWord('Get Set...');
            setTimer(GetSet_interval);
            return;
          } else if (word === 'Get Set...') {
            setWord('GO!');
            return;
          }
        }
        // Set an interval to decrease timeLeft by 1 every second
        const intervalId = setInterval(() => {
          setTimer(prevTime => prevTime - 1);
        }, 1000);

        // Cleanup the interval on component unmount or when timeLeft changes
        return () => clearInterval(intervalId);
      }, [Timer]);

   // setWord = 'Get Set...';
    

  return (
    <View style={styles.container}>
      <Text style={styles.content}>Settings Context:</Text>
      <Text style={styles.content}>
        isVibrationEnabled: {"isVibrationEnabled.toString()"}
      </Text>
      <Text style={styles.content}>
        isAudioEnabled: {isAudioEnabled.toString()}
      </Text>
      <Text style={styles.content}>
        isRandomEnabled: {isRandomEnabled.toString()}
      </Text>
      <Text style={styles.content}>
        On Your Mark to Get Set Interval: {OnYourMark_interval} sec
      </Text>
      <Text style={styles.content}>
        Get Set to Go Interval: {GetSet_interval} sec
      </Text>
      <Text style={styles.bold}>
        Start Timer:
      </Text>
      <Text style={styles.bold}>
        {word}
        {Timer}
      </Text>
      <TouchableOpacity
        //onPress={}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Stop</Text>
      </TouchableOpacity>
    </View>   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  bold: {
    fontSize: 32,
    color: '#FF0000',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '30%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },  
});

export default RunTimerStart;
