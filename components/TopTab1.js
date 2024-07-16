import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';

export default function TopTab1() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [pedometerAvailability, setPedometerAvailability] = useState("");

  const windowHeight = Dimensions.get("window").height;
  const stepsToMeters = 0.762; // Average step length in meters (this can be adjusted)
  const distanceFromSteps = stepCount * stepsToMeters;
  const distanceCovered = distanceFromSteps.toFixed(2);
  const caloriesBurnt = ((distanceCovered * 0.5) / 1000).toFixed(2); // Rough estimate: 0.5 kcal per meter

  useEffect(() => {
    let locationSubscription;
    let pedometerSubscription;

    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (newLocation) => {
          handleLocationUpdate(newLocation);
        }
      );

      pedometerSubscription = Pedometer.watchStepCount((result) => {
        setStepCount(result.steps);
      });

      Pedometer.isAvailableAsync().then(
        (result) => {
          setPedometerAvailability(String(result));
        },
        (error) => {
          setPedometerAvailability(error);
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      if (pedometerSubscription) {
        pedometerSubscription.remove();
      }
    };
  }, []);

  const handleLocationUpdate = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{ flex: 1 }}
        source={{ uri: 'https://example.com/your-background-image.jpg' }}
        resizeMode="cover"
      >
        {errorMsg ? (
          <Text>{errorMsg}</Text>
        ) : location ? (
          <>
            <MapView
              style={styles.map}
              region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title={"You are here"}
                description={"Current Location"}
              />
            </MapView>
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Steps: {stepCount}</Text>
              <Text style={styles.infoText}>Distance from steps: {distanceCovered} meters</Text>
              <Text style={styles.infoText}>Calories Burnt: {caloriesBurnt} kcal</Text>
            </View>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  infoText: {
    fontSize: 18,
  },
});
