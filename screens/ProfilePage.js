import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, ScrollView, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useRoute, useNavigation } from '@react-navigation/native';
import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";

// Function to clear AsyncStorage
const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared.');
  } catch (error) {
    console.error('Failed to clear AsyncStorage:', error);
  }
};
const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [numberOfRuns, setNumberOfRuns] = useState(0);
  const [runData, setRunData] = useState([]);
  const [firstName, setFirstName] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName || '');
          setProfilePic(userData.profilePic || '');

          await AsyncStorage.setItem('name', userData.firstName || '');
          await AsyncStorage.setItem('profilePic', userData.profilePic || '');

          const runs = await fetchRunData(user.uid);
          setRunData(runs);
          setNumberOfRuns(runs.length);
        }
      }
    };

    fetchUserData();
  }, []);

  const fetchRunData = async (userId) => {
    try {
      const runsCollection = collection(db, "runHistory");
      const q = query(runsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const runs = querySnapshot.docs.map(doc => doc.data());
      await AsyncStorage.setItem('runHistory', JSON.stringify(runs));
      return runs;
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

      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { profilePic: uri }, { merge: true });
        await AsyncStorage.setItem('profilePic', uri);
      }
    }
  };

  const saveProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { firstName: firstName }, { merge: true });
      await AsyncStorage.setItem('name', firstName);
      setIsEditMode(false);
    }
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

  const handleSignOut = async () => {
    try {
      // need to add a function to save data into cloud storage here
      // the operations may execute in parallel rather than sequentially. use await
      //await 
      await auth.signOut(); 
      await clearStorage(); // Clear AsyncStorage on sign out
      navigation.replace("Login");
    } catch (error) {
      alert(error.message);
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
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{numberOfRuns}</Text>
            <Text style={styles.statLabel}>Number of Runs</Text>
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
          <Text style={styles.noDataText}>No run data available</Text>
        )}
        {/* Sign out button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <Text style={styles.buttonText}>Sign out</Text>
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
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
    borderRadius: 15,
    padding: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666666',
  },
  footer: {
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ProfilePage;
