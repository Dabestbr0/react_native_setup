import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, ScrollView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useRoute } from '@react-navigation/native';
import { auth } from '../services/firebase'; // Correct the path

const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [numberOfRuns, setNumberOfRuns] = useState(0);
  const [runData, setRunData] = useState([]);
  
  const route = useRoute();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser?.displayName) {
        const nameParts = auth.currentUser.displayName.split(' ');
        setFirstName(nameParts[0]);
      }

      const storedName = await AsyncStorage.getItem('name');
      const storedProfilePic = await AsyncStorage.getItem('profilePic');
      if (storedName) setFirstName(storedName.split(' ')[0]);
      if (storedProfilePic) setProfilePic(storedProfilePic);

      const runs = await fetchRunData();
      setRunData(runs);
      setNumberOfRuns(runs.length);
    };

    fetchUserData();
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
    await AsyncStorage.setItem('name', firstName);
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
            <Text style={styles.greeting}>Hello, <Text style={styles.boldText}>{firstName}</Text>!</Text>
            {isEditMode ? (
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Name"
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
  boldText: {
    fontSize: 24,
    fontWeight: 'bold',
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
