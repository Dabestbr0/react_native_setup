import React, { useState, useContext } from 'react';
import { View, Text, Switch, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import Slider from '@react-native-community/slider';
import { SettingsContext } from '../contexts/SettingsData';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';


const SettingsScreen = () => {
  const { 
    OnYourMark_interval, setOnYourMark_Interval, 
    GetSet_interval, setGetSet_Interval,
    isVibrationEnabled, setIsVibrationEnabled,
    isAudioEnabled, setIsAudioEnabled,
    isRandomEnabled, setIsRandomEnabled
  } = useContext(SettingsContext);

  const toggleVibrationSwitch = () => setIsVibrationEnabled(previousState => !previousState);
  const toggleAudioSwitch = () => setIsAudioEnabled(previousState => !previousState);
  const toggleRandomSwitch = () => setIsRandomEnabled(previousState => !previousState);

  const screenWidth = Dimensions.get('window').width;

  return (
    <ImageBackground
      source={require('../assets/settingsbgm.jpg')} 
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>System Settings</Text>
        
        <View style={styles.setting}>
          <MaterialCommunityIcons name="vibrate" size={24} color="#333" />
          <Text style={styles.settingText}>Phone Vibration</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#ffa726" }}
            thumbColor={isVibrationEnabled ? "#ff7043" : "#f4f3f4"}
            onValueChange={toggleVibrationSwitch}
            value={isVibrationEnabled}
          />
        </View>

        <View style={styles.setting}>
          <Icon name="volume-high" size={24} color="#333" />
          <Text style={styles.settingText}>Feedback Audio</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#ffa726" }}
            thumbColor={isAudioEnabled ? "#ff7043" : "#f4f3f4"}
            onValueChange={toggleAudioSwitch}
            value={isAudioEnabled}
          />
        </View>
        
        <Text style={styles.title}>Timer Settings</Text>

        <View style={styles.setting}>
          <Icon name="shuffle" size={24} color="#333" />
          <Text style={styles.settingText}>Random Start</Text>
          <Switch 
            trackColor={{ false: "#767577", true: "#ffa726" }}
            thumbColor={isRandomEnabled ? "#ff7043" : "#f4f3f4"}
            onValueChange={toggleRandomSwitch}
            value={isRandomEnabled}
          />
        </View>
        <Text style={styles.descriptionText}>
          Randomly set the time interval from "GET SET" to "GO" within a range of 1 to 10 seconds.
        </Text>

        <View style={styles.intervalSetting}>
          <Text style={styles.intervalTitle}>Interval from ON YOUR MARK to GET SET: {OnYourMark_interval} sec</Text>
          <Slider
            style={{ width: screenWidth - 50, height: 40 }}
            minimumValue={3}
            maximumValue={10}
            step={1}
            value={OnYourMark_interval}
            onValueChange={value => setOnYourMark_Interval(value)}
            minimumTrackTintColor="#ffa726"
            maximumTrackTintColor="#000000"
            thumbTintColor="#ff7043"
          />
        </View>

        <View style={styles.intervalSetting}>
          <Text style={styles.intervalTitle}>Interval from GET SET to GO: {GetSet_interval} sec</Text>
          <Slider
            style={{ width: screenWidth - 50, height: 40 }}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={GetSet_interval}
            onValueChange={value => setGetSet_Interval(value)}
            minimumTrackTintColor="#ffa726"
            maximumTrackTintColor="#000000"
            thumbTintColor="#ff7043"
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  settingText: {
    fontSize: 18,
    flex: 1,
    marginLeft: 10,
    color: '#333',
  },
  intervalSetting: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  intervalTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
});

export default SettingsScreen;
