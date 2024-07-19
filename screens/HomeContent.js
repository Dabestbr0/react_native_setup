import React, {useState, useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase'; 
import { SettingsContext } from '../contexts/SettingsData';
import * as Location from 'expo-location'; // Import Location from Expo

const HomeContent = () => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch(error => alert(error.message));
  };

  const { 
    distanceGoal, setDistanceGoal,
  } = useContext(SettingsContext);


   // State for modal visibility
   const [modalVisible, setModalVisible] = useState(false);

  //  Code distanceGoal code for HomeScreen
  const distanceOptions = [
    { label: 'None', value: null },
    { label: '60m', value: 60 },
    { label: '100m', value: 100 },
    { label: '200m', value: 200 },
    { label: '300m', value: 300 },
    { label: '400m', value: 400 },
    { label: '800m', value: 800 },
    { label: '1600m', value: 1600 },
  ];

  const selectDistance = (value) => {
    setDistanceGoal(value);
    setModalVisible(false); // Close the modal after selection (if using a modal)
  };

  // Function to request background location permissions
  const requestBackgroundLocationPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Foreground location permission not granted');
          return;
        }
      }
  
      let { status: statusBackground } = await Location.requestBackgroundPermissionsAsync({
        rationale: 'We need access to your location in the background to provide accurate run tracking even when the app is closed.',
      });
  
      if (statusBackground !== 'granted') {
        console.error('Background location permission not granted');
        return; // Return if permission not granted
      }
  
      // Navigate to RunTimerStart screen after permissions are granted
      navigation.navigate('RunTimerStart');
    } catch (error) {
      console.error('Error requesting location permissions:', error);
    }
  };
  
  

  return (
    <ImageBackground 
      source={require('../assets/background.png')} // Ensure the image is saved in this path
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Sprint O' Clock</Text>
          <Text style={styles.email}>Email: { auth.currentUser?.email }</Text>
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={requestBackgroundLocationPermissions} // Request permissions on button press
          >
            <Text style={styles.buttonText}>Start Run</Text>
          </TouchableOpacity>
        </View>

        {/* Modal or Dropdown for selecting distance */}
        <View style={styles.footer}>
          {/* Display selected distance goal if any */}
          {distanceGoal !== null && (
            <Text style={styles.goalText}>Current Goal: {distanceGoal}m</Text>
          )}

          <TouchableOpacity 
            onPress={() => setModalVisible(true)} 
            style={styles.setAGoalButton}
            >
           <Text style={styles.buttonText}>Set a Goal</Text>
          </TouchableOpacity>

          {/* Modal for selecting distance goal */}
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                {distanceOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.modalItem}
                    onPress={() => selectDistance(option.value)}
                  >
                    <Text style={styles.modalItemText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Modal>   
        </View>
        
        {/* Sign out button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  email: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#32CD32', // Green color
    padding: 15,
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  setAGoalButton: {
    backgroundColor: '#0000FF', // Tomato color
    padding: 15,
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  signOutButton: {
    backgroundColor: '#FF6347', // Tomato color
    padding: 15,
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  box: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
    borderRadius: 8,
  },
  boxText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    maxHeight: 400,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
  },
  goalText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default HomeContent;
