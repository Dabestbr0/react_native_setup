import React, { useState, useContext } from 'react';
import { View, Text, Switch, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { SettingsContext } from '../contexts/SettingsData';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const { 
    OnYourMark_interval, setOnYourMark_Interval, 
    GetSet_interval, setGetSet_Interval,
    isVibrationEnabled, setIsVibrationEnabled,
    isAudioEnabled, setIsAudioEnabled,
    isRandomEnabled, setIsRandomEnabled
  } = useContext(SettingsContext);

  const navigation = useNavigation();

  const toggleVibrationSwitch = () => setIsVibrationEnabled(previousState => !previousState);
  const toggleAudioSwitch = () => setIsAudioEnabled(previousState => !previousState);
  const toggleRandomSwitch = () => setIsRandomEnabled(previousState => !previousState);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch(error => alert(error.message));
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>SYSTEM SETTINGS</Text>
        
        <View style={styles.setting}>
          <MaterialCommunityIcons name="vibrate" size={24} color="#FFA726" />
          <Text style={styles.settingText}>Phone Vibration</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#FFA726" }}
            thumbColor={isVibrationEnabled ? "#FF7043" : "#F4F3F4"}
            onValueChange={toggleVibrationSwitch}
            value={isVibrationEnabled}
          />
        </View>

        <View style={styles.setting}>
          <Icon name="volume-high" size={24} color="#FFA726" />
          <Text style={styles.settingText}>Feedback Audio</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#FFA726" }}
            thumbColor={isAudioEnabled ? "#FF7043" : "#F4F3F4"}
            onValueChange={toggleAudioSwitch}
            value={isAudioEnabled}
          />
        </View>
        
        <Text style={styles.title}>TIMER SETTINGS</Text>

        <View style={styles.setting}>
          <Icon name="shuffle" size={24} color="#FFA726" />
          <Text style={styles.settingText}>Random Start</Text>
          <Switch 
            trackColor={{ false: "#767577", true: "#FFA726" }}
            thumbColor={isRandomEnabled ? "#FF7043" : "#F4F3F4"}
            onValueChange={toggleRandomSwitch}
            value={isRandomEnabled}
          />
        </View>
        <Text style={styles.descriptionText}>
          Randomly set the time interval from "GET SET" to "GO" within a range of 1 to 10 seconds.
        </Text>

        <View style={styles.intervalSetting}>
          <Text style={styles.intervalTitle}>Interval from "ON YOUR MARK" to "GET SET": {OnYourMark_interval} sec</Text>
          <Slider
            style={{ width: screenWidth - 50, height: 40 }}
            minimumValue={3}
            maximumValue={10}
            step={1}
            value={OnYourMark_interval}
            onValueChange={value => setOnYourMark_Interval(value)}
            minimumTrackTintColor="#FFA726"
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#FF7043"
          />
        </View>

        <View style={styles.intervalSetting}>
          <Text style={styles.intervalTitle}>Interval from "GET SET" to "GO": {GetSet_interval} sec</Text>
          <Slider
            style={{ width: screenWidth - 50, height: 40 }}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={GetSet_interval}
            onValueChange={value => setGetSet_Interval(value)}
            minimumTrackTintColor="#FFA726"
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#FF7043"
          />
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          <Text style={styles.buttonText}>SIGN OUT</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F7F8FA', // Light background color
  },
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#0D1B2A',
    fontWeight: 'bold',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
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
    marginLeft: 15,
    color: '#333',
  },
  intervalSetting: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
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
    color: '#0D1B2A',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  signOutButton: {
    backgroundColor: '#FF0000', // Red color for sign out button
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: 'center', // Center the button horizontally
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default SettingsScreen;

