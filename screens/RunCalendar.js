import React, { useState, useEffect } from 'react'; // Import React and hooks
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native'; // Import React Native components
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for persistent storage
import { Calendar } from 'react-native-calendars'; // Import Calendar component
import { format } from 'date-fns'; // Import date-fns for date formatting
import { useIsFocused } from '@react-navigation/native'; // Import hook to detect if screen is focused
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView for safe area handling



const RunCalendar = () => {
  const [runHistory, setRunHistory] = useState([]); // State to hold run history
  const [selectedDate, setSelectedDate] = useState(null); // State to hold selected date
  const [runsForSelectedDate, setRunsForSelectedDate] = useState([]); // State to hold runs for selected date
  const isFocused = useIsFocused(); // Hook to detect if screen is focused

  // Effect to fetch run history when screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchRunHistory(); // Fetch run history when screen is focused
    }
  }, [isFocused]);

  // Function to fetch run history from AsyncStorage
  const fetchRunHistory = async () => {
    try {
      const storedRuns = await AsyncStorage.getItem('runHistory'); // Get stored run history
      const history = storedRuns ? JSON.parse(storedRuns) : []; // Parse stored runs or initialize empty array
      setRunHistory(history); // Set run history in state
    } catch (error) {
      console.error('Failed to fetch run data', error); // Log error if fetching fails
    }
  };

  // Effect to update runs for selected date when selected date or run history changes
  useEffect(() => {
    if (selectedDate) {
      const runs = runHistory.filter(run => run.date === selectedDate); // Filter runs for selected date
      setRunsForSelectedDate(runs); // Set runs for selected date in state
    }
  }, [selectedDate, runHistory]);

  // Function to get marked dates for the calendar
  const getMarkedDates = () => {
    const markedDates = {}; // Initialize marked dates object
    runHistory.forEach(run => {
      const formattedDate = run.date; // Format run date to Central Time
      markedDates[formattedDate] = { marked: true, selected: formattedDate === selectedDate }; // Mark and select dates
    });
    return markedDates; // Return marked dates
  };


  // Function to format elapsed time
  const formatElapsedTime = (elapsedTime) => {
    const [minutes, seconds, milliseconds] = elapsedTime.split(':').map(Number); // Split and parse elapsed time
    let formattedTime = ''; // Initialize formatted time string
    if (minutes > 0) {
      formattedTime += `${minutes}m `; // Add minutes to formatted time if greater than 0
    }
    if (seconds > 0 || minutes > 0) {
      formattedTime += `${seconds}s `; // Add seconds to formatted time if greater than 0 or if there are minutes
    }
    formattedTime += `${milliseconds}ms`; // Add milliseconds to formatted time
    return formattedTime.trim(); // Return formatted time string
  };

  // Render UI
  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        markedDates={getMarkedDates()} // Marked dates for the calendar
        onDayPress={(day) => setSelectedDate(day.dateString)} // Handle day press
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          arrowColor: 'orange',
          monthTextColor: '#000', // Changed from blue to black and removed bold
          indicatorColor: 'blue', 
          textDayFontWeight: '300',
          textMonthFontWeight: '300', // Removed bold style from month
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
      />
      <FlatList
        data={runsForSelectedDate} // Runs for selected date
        keyExtractor={(item, index) => index.toString()} // Key extractor for FlatList
        renderItem={({ item }) => (
          <View style={styles.runItem}>
            <Text style={styles.runTextTitle}>Run Details</Text>
            <View style={styles.runDetail}>
              <Text style={styles.runLabel}>Date:</Text>
              <Text style={styles.runValue}>{(item.date)}</Text>
            </View>
            <View style={styles.runDetail}>
              <Text style={styles.runLabel}>Start Time:</Text>
              <Text style={styles.runValue}>{item.startTime}</Text>
            </View>
            <View style={styles.runDetail}>
              <Text style={styles.runLabel}>End Time:</Text>
              <Text style={styles.runValue}>{item.finishTime}</Text>
            </View>
            <View style={styles.runDetail}>
              <Text style={styles.runLabel}>Elapsed Time:</Text>
              <Text style={styles.runValue}>{formatElapsedTime(item.timeElapsed)}</Text>
            </View>
            <View style={styles.runDetail}>
              <Text style={styles.runLabel}>Distance:</Text>
              <Text style={styles.runValue}>{item.distance}m</Text>
            </View>
            <View style={styles.runDetail}>
              <Text style={styles.runLabel}>Steps:</Text>
              <Text style={styles.runValue}>{item.steps}</Text>
            </View>
            <View style={styles.runDetail}>
              <Text style={styles.runLabel}>Calories:</Text>
              <Text style={styles.runValue}>{item.calories} cal</Text>
            </View>
            <View style={styles.runDetail}>
              <Text style={styles.runLabel}>Max Speed:</Text>
              <Text style={styles.runValue}>{item.maxSpeed} m/s</Text>
            </View>
          </View>
  
        )}
        ListEmptyComponent={<Text style={styles.noDataText}>No run history available for this date.</Text>} // Display when no run history
      />
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 'true',
  },
  runItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: Platform.OS === 'ios' ? '#000' : '#6200ee',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  runTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  runDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  runLabel: {
    fontSize: 16,
    color: '#555',
  },
  runValue: {
    fontSize: 16,
    color: '#000',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default RunCalendar; // Export the RunCalendar component