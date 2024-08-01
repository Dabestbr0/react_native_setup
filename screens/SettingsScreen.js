import React, { useContext, useState } from 'react';
import { View, Text, Switch, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
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

  const [isEditMode, setIsEditMode] = useState(false);
  const toggleVibrationSwitch = () => setIsVibrationEnabled(previousState => !previousState);
  const toggleAudioSwitch = () => setIsAudioEnabled(previousState => !previousState);
  const toggleRandomSwitch = () => setIsRandomEnabled(previousState => !previousState);

  const screenWidth = Dimensions.get('window').width;

  const handleReset = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default values?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => {
          // Set all default settings to ON
          setOnYourMark_Interval(3);
          setGetSet_Interval(1);
          setIsVibrationEnabled(true);
          setIsAudioEnabled(true);
          setIsRandomEnabled(true);
        }},
      ],
      { cancelable: true }
    );
  };

  const handleSave = () => {
    setIsEditMode(false);
    Alert.alert("Settings Saved", "Your settings have been successfully saved.");
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>SYSTEM SETTINGS</Text>
        
        <View style={styles.card}>
          <View style={styles.setting}>
            <MaterialCommunityIcons name="vibrate" size={24} color="#FF8C00" />
            <Text style={styles.settingText}>Phone Vibration</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#FF8C00" }}
              thumbColor={isVibrationEnabled ? "#FF7043" : "#F4F3F4"}
              onValueChange={toggleVibrationSwitch}
              value={isVibrationEnabled}
              style={styles.switch}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.setting}>
            <Icon name="volume-high" size={24} color="#FF8C00" />
            <Text style={styles.settingText}>Feedback Audio</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#FF8C00" }}
              thumbColor={isAudioEnabled ? "#FF7043" : "#F4F3F4"}
              onValueChange={toggleAudioSwitch}
              value={isAudioEnabled}
              style={styles.switch}
            />
          </View>
        </View>

        <Text style={styles.title}>TIMER SETTINGS</Text>

        <View style={styles.card}>
          <View style={styles.setting}>
            <Icon name="shuffle" size={24} color="#FF8C00" />
            <Text style={styles.settingText}>Random Start</Text>
            <Switch 
              trackColor={{ false: "#767577", true: "#FF8C00" }}
              thumbColor={isRandomEnabled ? "#FF7043" : "#F4F3F4"}
              onValueChange={toggleRandomSwitch}
              value={isRandomEnabled}
              style={styles.switch}
            />
          </View>
          <Text style={styles.descriptionText}>
            Randomly set the time interval from "GET SET" to "GO" within a range of 1 to 10 seconds.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.intervalSetting}>
            <Text style={styles.intervalTitle}>Interval from "ON YOUR MARK" to "GET SET": {OnYourMark_interval} sec</Text>
            <Slider
              style={{ width: screenWidth - 50, height: 40 }}
              minimumValue={3}
              maximumValue={10}
              step={1}
              value={OnYourMark_interval}
              onValueChange={value => setOnYourMark_Interval(value)}
              minimumTrackTintColor="#FF8C00"
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
              minimumTrackTintColor="#FF8C00"
              maximumTrackTintColor="#D3D3D3"
              thumbTintColor="#FF7043"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset to Default</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F7F8FA', // Light background color
  },
  container: {
    flexGrow: 1,
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#FF8C00', // Dark Orange color
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: '#000', // Black outline
    textShadowOffset: { width: -1, height: 1 }, // Position of shadow
    textShadowRadius: 2, // Blur radius for shadow
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingText: {
    fontSize: 18,
    flex: 1,
    marginLeft: 15,
    color: '#333',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
  },
  intervalSetting: {
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FF8C00',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#FF4500', // Darker red for reset
  },
});

export default SettingsScreen;
