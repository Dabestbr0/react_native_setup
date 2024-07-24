import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, ScrollView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [numberOfRuns, setNumberOfRuns] = useState(0);
  const [runData, setRunData] = useState([]);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedProfilePic = await AsyncStorage.getItem('profilePic');
        if (storedFirstName) {
          setFirstName(storedFirstName);
          console.log("First name loaded: ", storedFirstName);
        }
        if (storedProfilePic) setProfilePic(storedProfilePic);

        const runs = await fetchRunData();
        setRunData(runs);
        setNumberOfRuns(runs.length);
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
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePic(uri);
      await AsyncStorage.setItem('profilePic', uri);
    }
  };

  const saveProfile = async () => {
    await AsyncStorage.setItem('firstName', firstName);
    console.log("First name saved: ", firstName);
    setIsEditMode(false);
  };

  const formatTime = (time) => {
    const [minutes, seconds, milliseconds] = time.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds + milliseconds / 100;
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);
    return hours > 0 
      ? `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRunDataForChart = () => {
    const labels = runData.map(run => formatTime(run.timeElapsed));

    const distances = runData.map(run => parseFloat(run.distance));
    const times = runData.map(run => {
      const [minutes, seconds, milliseconds] = run.timeElapsed.split(':').map(Number);
      return minutes + seconds / 60 + milliseconds / 6000;
    });

    return {
      labels,
      datasets: [
        {
          data: distances,
          color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`, // Pink
          strokeWidth: 2,
          dotColor: 'pink',
        },
        {
          data: times,
          color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green
          strokeWidth: 2,
          dotColor: 'green',
        },
      ],
      legend: ["Distance (m)", "Time (min)"],
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.greeting}>Hello, {firstName}!</Text>
            {isEditMode ? (
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
              />
            ) : null}
          </View>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profileImage} />
            ) : (
              <Icon name="person-circle" size={80} color="#E0E0E0" />
            )}
            <View style={styles.editIconContainer}>
              <Icon name="pencil" size={20} color="#FFF" />
            </View>
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
        <Text style={styles.sectionTitle}>Progress</Text>
        {runData.length > 0 ? (
          <LineChart
            data={formatRunDataForChart()}
            width={Dimensions.get('window').width - 40}
            height={300}
            yAxisLabel=""
            yAxisSuffix="m"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: (dot, index) => {
                let color = '#ffa726';
                if (index % 2 === 1) { // Time data is the second dataset
                  color = 'green';
                }
                return {
                  r: '6',
                  strokeWidth: '2',
                  stroke: color,
                };
              },
            }}
            bezier
            style={styles.chart}
          />
        ) : (
          <Text style={styles.noDataText}>No run data available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  nameContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    color: '#FFA500',
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  imageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFA500',
    borderRadius: 15,
    padding: 5,
  },
  input: {
    fontSize: 24,
    color: '#FFA500',
    borderBottomWidth: 1,
    borderColor: '#FFA500',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFA500',
    marginTop: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  statBox: {
    width: '50%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  statLabel: {
    fontSize: 16,
    color: '#FFA500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default ProfilePage;
