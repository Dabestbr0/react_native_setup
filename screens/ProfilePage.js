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

  const navigation = useNavigation(); 

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch(error => alert(error.message));
  };
  
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

      // Calculate additional stats
      const totalDist = runs.reduce((acc, run) => acc + parseFloat(run.distance), 0);
      setTotalDistance(totalDist.toFixed(2));

      const avgSpeed = totalDist / runs.length;
      setAverageSpeed(avgSpeed.toFixed(2));

      const totalCalories = runs.reduce((acc, run) => acc + parseFloat(run.calories), 0);
      setCaloriesBurned(totalCalories.toFixed(2));
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
              width={Dimensions.get('window').width * 2} // Double the width for horizontal scrolling
              height={300}
              yAxisLabel=""
              yAxisSuffix="m"
              xLabelsOffset={-5}
              hidePointsAtIndex={[0]} // Hides point at index 0
              yAxisInterval={1} // optional, defaults to 1
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
                propsForBackgroundLines: {
                  strokeDasharray: "", // Removes dashed lines
                  strokeWidth: 1,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
                },
              }}
              bezier
              style={styles.chart}
              accessor="distance"
              horizontalLabelRotation={-45}
              verticalLabelRotation={30}
              segments={4} // Customize number of segments
            />
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>No run data available</Text>
        )}

         {/* Sign out button */}
         <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <Text style={styles.buttonText}>SIGN OUT</Text>
          </TouchableOpacity>
        </View>

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
    fontSize: 24,
    color: '#FFA500',
    marginTop: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  statBox: {
    width: '45%',
    backgroundColor: '#FFEBE8', // Light coral background
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFA500',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
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
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  signOutButton: {
    backgroundColor: '#FF0000', // Tomato color
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
});

export default ProfilePage;