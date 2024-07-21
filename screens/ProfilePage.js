import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState('Benjamin');
  const [numberOfRuns, setNumberOfRuns] = useState(0);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedProfilePic = await AsyncStorage.getItem('profilePic');
        if (storedName) setName(storedName);
        if (storedProfilePic) setProfilePic(storedProfilePic);

        const runData = await fetchRunData();
        setNumberOfRuns(runData.length);
      } catch (error) {
        console.error('Failed to load profile data', error);
      }
    };
    loadProfileData();
  }, []);

  const fetchRunData = async () => {
    try {
      const storedRuns = await AsyncStorage.getItem('runHistory');
      return storedRuns ? JSON.parse(storedRuns) : [];
    } catch (error) {
      console.error('Failed to fetch run data', error);
      return [];
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePic(uri);
      await AsyncStorage.setItem('profilePic', uri);
    }
  };

  const saveProfile = async () => {
    await AsyncStorage.setItem('name', name);
    setIsEditMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.greeting}>Hello,</Text>
          {isEditMode ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />
          ) : (
            <Text style={styles.userName}>{name}</Text>
          )}
        </View>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          <Image source={{ uri: profilePic }} style={styles.profileImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)} style={styles.editButton}>
          <Icon name={isEditMode ? "checkmark" : "pencil"} size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      {isEditMode && <Button title="Save" onPress={saveProfile} />}
      <Text style={styles.sectionTitle}>Stats</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{numberOfRuns}</Text>
          <Text style={styles.statLabel}>Number of Runs</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A', // Dark blue background
    paddingHorizontal: 20,
    paddingTop: 60, // Increase the top padding for better spacing
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // Move the profile container up
  },
  nameContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    color: '#FFD700', // Yellow color for greeting
  },
  userName: {
    fontSize: 32, // Increase font size for a better look
    fontWeight: 'bold',
    color: '#FFFFFF', // White color for user name
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80, // Increase image size for a better look
    height: 80,
    borderRadius: 40,
  },
  editButton: {
    marginLeft: 15, // Increase left margin for better spacing
  },
  input: {
    fontSize: 24,
    color: '#FFFFFF', // White color for input text
    borderBottomWidth: 1,
    borderColor: '#FFD700', // Yellow color for input border
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFD700', // Yellow color for section title
    marginTop: 40, // Increase top margin for better spacing
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the stats box for a better look
    marginTop: 20,
  },
  statBox: {
    width: '50%', // Adjust width for a better look
    backgroundColor: '#1B263B', // Darker blue for stats box background
    padding: 20, // Increase padding for a better look
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28, // Increase font size for a better look
    fontWeight: 'bold',
    color: '#FFFFFF', // White color for stat value
  },
  statLabel: {
    fontSize: 16,
    color: '#FFD700', // Yellow color for stat label
  },
});

export default ProfilePage;
