import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState('Name');
  const [username, setUsername] = useState('Username');
  const [location, setLocation] = useState('Location');

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedUsername = await AsyncStorage.getItem('username');
        const storedLocation = await AsyncStorage.getItem('location');
        const storedProfilePic = await AsyncStorage.getItem('profilePic');

        if (storedName) setName(storedName);
        if (storedUsername) setUsername(storedUsername);
        if (storedLocation) setLocation(storedLocation);
        if (storedProfilePic) setProfilePic(storedProfilePic);
      } catch (error) {
        console.error('Failed to load profile data', error);
      }
    };

    loadProfileData();
  }, []);

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
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('location', location);
    setIsEditMode(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.profilePicContainer}>
            <Image
              source={profilePic ? { uri: profilePic } : require('../assets/profile-placeholder.png')}
              style={styles.profilePic}
            />
            <Icon name="pencil-outline" size={20} color="#000" style={styles.editIcon} />
          </View>
        </TouchableOpacity>
        {isEditMode ? (
          <>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Location"
            />
            <Button title="Save" onPress={saveProfile} />
          </>
        ) : (
          <>
            <Text style={styles.username}>{name}</Text>
            <Text style={styles.userDetail}>{username}</Text>
            <Text style={styles.userDetail}>{location}</Text>
            <Button title="Edit Profile" onPress={() => setIsEditMode(true)} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F1F2',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userDetail: {
    fontSize: 16,
    color: '#888',
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#888',
    marginBottom: 10,
    width: '80%',
    textAlign: 'center',
  },
});

export default ProfilePage;
