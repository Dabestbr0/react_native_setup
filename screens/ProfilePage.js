import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, ScrollView, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useRoute, useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebase';

const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [numberOfRuns, setNumberOfRuns] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [runData, setRunData] = useState([]);
  const [firstName, setFirstName] = useState('');

  const navigation = useNavigation(); 
  const route = useRoute();

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

      // Calculate additional stats
      const totalDist = runs.reduce((acc, run) => acc + parseFloat(run.distance), 0);
      setTotalDistance(totalDist.toFixed(2));

      const avgSpeed = runs.length ? (totalDist / runs.length).toFixed(2) : 0;
      setAverageSpeed(avgSpeed);

      const totalCalories = runs.reduce((acc, run) => acc + parseFloat(run.calories), 0);
      setCaloriesBurned(totalCalories.toFixed(2));
    };

    fetchUserData();

    const focusListener = navigation.addListener('focus', fetchUserData); // Refresh data when navigating back

    return () => {
      focusListener.remove();
    };
  }, [navigation]);

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

  const signOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login'); // Navigate to the login screen or any other screen
    } catch (error) {
      Alert.alert('Sign Out Error', error.message);
    }
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
        <Button title="Sign Out" onPress={signOut} color="#FF6347" />
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Icon name="walk" size={28} color="#FFA500" style={styles.statIcon} />
            <Text style={styles.statValue}>{numberOfRuns}</Text>
            <Text style={styles.statLabel}>Number of Runs</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="footsteps" size={28} color="#FFA500" style={styles.statIcon} />
            <Text style={styles.statValue}>{totalDistance} m</Text>
            <Text style={styles.statLabel}>Total Distance</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="speedometer" size={28} color="#FFA500" style={styles.statIcon} />
            <Text style={styles.statValue}>{averageSpeed} m/s</Text>
            <Text style={styles.statLabel}>Average Speed</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="flame" size={28} color="#FFA500" style={styles.statIcon} />
            <Text style={styles.statValue}>{caloriesBurned} kcal</Text>
            <Text style={styles.statLabel}>Calories Burned</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Progress</Text>
        {runData.length > 0 ? (
          <ScrollView horizontal>
          <LineChart
            data={formatRunDataForChart()}
            width={Dimensions.get('window').width * 2} 
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
                if (index % 2 === 1) { 
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
        </ScrollView>
        ) : (
          <Text>No run data available.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nameContainer: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: 200,
    textAlign: 'center',
    marginTop: 10,
  },
  imageContainer: {
    position: 'relative',
    marginTop: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFA500',
    borderRadius: 50,
    padding: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    width: '48%',
  },
  statIcon: {
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
  },
});

export default ProfilePage;
