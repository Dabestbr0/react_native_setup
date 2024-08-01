import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, Button, Alert, TouchableOpacity, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RunCalendar = () => {
  const [runHistory, setRunHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [runsForSelectedDate, setRunsForSelectedDate] = useState([]);
  const isFocused = useIsFocused();

  // Effect to fetch run history when screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchRunHistory();
    }
  }, [isFocused]);

  const fetchRunHistory = async () => {
    try {
      const storedRuns = await AsyncStorage.getItem('runHistory');
      const history = storedRuns ? JSON.parse(storedRuns) : [];
      setRunHistory(history);
    } catch (error) {
      console.error('Failed to fetch run data', error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      const runs = runHistory.filter(run => run.date === selectedDate);
      setRunsForSelectedDate(runs);
    }
  }, [selectedDate, runHistory]);

  const getMarkedDates = () => {
    const markedDates = {};
    runHistory.forEach(run => {
      const formattedDate = run.date;
      markedDates[formattedDate] = { marked: true, selected: formattedDate === selectedDate };
    });
    return markedDates;
  };

  const formatElapsedTime = (elapsedTime) => {
    const [minutes, seconds, milliseconds] = elapsedTime.split(':').map(Number);
    let formattedTime = '';
    if (minutes > 0) {
      formattedTime += `${minutes}m `;
    }
    if (seconds > 0 || minutes > 0) {
      formattedTime += `${seconds}s `;
    }
    formattedTime += `${milliseconds}ms`;
    return formattedTime.trim();
  };

  const deleteRun = async (runToDelete) => {
    Alert.alert(
      'Delete Run',
      'Are you sure you want to delete this run?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            const updatedHistory = runHistory.filter(run => run !== runToDelete);
            setRunHistory(updatedHistory);
            setRunsForSelectedDate(updatedHistory.filter(run => run.date === selectedDate));
            await AsyncStorage.setItem('runHistory', JSON.stringify(updatedHistory));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const shareRunDetails = async (run) => {
    try {
      const result = await Share.share({
        message: `Run Details:\nDate: ${run.date}\nStart Time: ${run.startTime}\nEnd Time: ${run.finishTime}\nElapsed Time: ${formatElapsedTime(run.timeElapsed)}\nDistance: ${run.distance}m\nSteps: ${run.steps}\nCalories: ${run.calories}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const renderSummary = () => {
    const totalDistance = runHistory.reduce((sum, run) => sum + parseFloat(run.distance), 0);
    const totalCalories = runHistory.reduce((sum, run) => sum + parseFloat(run.calories), 0);
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total Runs: {runHistory.length}</Text>
        <Text style={styles.summaryText}>Total Distance: {totalDistance.toFixed(2)} m</Text>
        <Text style={styles.summaryText}>Total Calories: {totalCalories.toFixed(2)} kcal</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        markedDates={getMarkedDates()}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          arrowColor: 'orange',
          monthTextColor: '#000',
          indicatorColor: 'blue',
          textDayFontWeight: '300',
          textMonthFontWeight: '300',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />
      {renderSummary()}
      <FlatList
        data={runsForSelectedDate}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.runItem}>
            <Text style={styles.runTextTitle}>Run Details</Text>
            <View style={styles.runDetail}>
              <Text style={styles.runLabel}>Date:</Text>
              <Text style={styles.runValue}>{item.date}</Text>
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
              <Text style={styles.runValue}>{item.calories}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => deleteRun(item)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>DELETE RUN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => shareRunDetails(item)} style={styles.shareButton}>
                <Text style={styles.shareButtonText}>SHARE RUN</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noDataText}>No run history available for this date.</Text>}
      />
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  runItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
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
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    flex: 1,
  },
  shareButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: 'bold',
  },
});

export default RunCalendar;
