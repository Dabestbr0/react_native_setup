import React, { useState, useContext } from 'react';
import { View, Text, Switch, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { SettingsContext } from '../contexts/SettingsData';

const SettingsScreen = () => {
  // State to manage the switch for enabling phone vibration
  const { 
    OnYourMark_interval, setOnYourMark_Interval, 
    GetSet_interval, setGetSet_Interval,
    isVibrationEnabled, setIsVibrationEnabled,
    isAudioEnabled, setIsAudioEnabled,
    isRandomEnabled, setIsRandomEnabled
  } = useContext(SettingsContext);

  // Function to toggle the phone vibration switch
  const toggleVibrationSwitch = () => setIsVibrationEnabled(previousState => !previousState);

  // Function to toggle the feedback audio switch
  const toggleAudioSwitch = () => setIsAudioEnabled(previousState => !previousState);

  // Function to toggle the random start switch
  const toggleRandomSwitch = () => setIsRandomEnabled(previousState => !previousState);

  // Get the width of the screen
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      {/* Title for the System settings */}
      <Text style={styles.title}>System</Text>
      
      {/* Switch to enable or disable Phone Vibration */}
      <View style={styles.setting}>
        <Text>Phone Vibration</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isVibrationEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleVibrationSwitch}
          value={isVibrationEnabled}
        />
      </View>

      {/* Switch to enable or disable Feedback Audio */}
      <View style={styles.setting}>
        <Text>Feedback Audio</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isAudioEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleAudioSwitch}
          value={isAudioEnabled}
        />
      </View>
      
      {/* Title for the Timer settings */}
      <Text style={styles.title}>Timer settings</Text>

      {/* Switch to enable or disable Random Start */}
      <View style={styles.set}>
        <Text>Random Start</Text>
        <Text style={styles.descriptionText}>Randomly set the time interval from "GET SET" to "GO" within a range of 1 to 10 seconds. </Text>
        <Switch 
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isRandomEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleRandomSwitch}
          value={isRandomEnabled}
        />
      </View>

      {/* Slider to set the ON YOUR MARK to SET interval */}
      <View style={styles.intervalSetting}>
        <Text>Interval from ON YOUR MARK to GET SET: {OnYourMark_interval} sec</Text>
        <Slider
          style={{ width: screenWidth - 50, height: 40 }} // Adjust the width based on screen width with padding
          minimumValue={3}
          maximumValue={10}
          step={1}
          value={OnYourMark_interval}
          onValueChange={value => setOnYourMark_Interval(value)}
          minimumTrackTintColor="#81b0ff"
          maximumTrackTintColor="#000000"
          thumbTintColor="#f5dd4b"
        />
      </View>

      {/* Slider to set the SET to GO interval */}
      <View style={styles.intervalSetting}>
        <Text>Interval from GET SET to GO: {GetSet_interval} sec</Text>
        <Slider
          style={{ width: screenWidth - 50, height: 40 }} // Adjust the width based on screen width with padding
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={GetSet_interval}
          onValueChange={value => setGetSet_Interval(value)}
          minimumTrackTintColor="#81b0ff"
          maximumTrackTintColor="#000000"
          thumbTintColor="#f5dd4b"
        />
      </View>
    </View>
  );
}

// Styles for the settings screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  intervalSetting: {
    marginBottom: 20,
  },
  descriptionText: {
    color: '#808080',
  },
});

export default SettingsScreen;
