import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { useIsFocused } from '@react-navigation/native';

const RunCalendar = () => {
  const [runHistory, setRunHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [runsForSelectedDate, setRunsForSelectedDate] = useState([]);
  const isFocused = useIsFocused(); // Hook to detect if screen is focused

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
      const runs = runHistory.filter(run => formatDateToCentralTime(run.date) === selectedDate);
      setRunsForSelectedDate(runs);
    }
  }, [selectedDate, runHistory]);

  const getMarkedDates = () => {
    const markedDates = {};
    runHistory.forEach(run => {
      const formattedDate = formatDateToCentralTime(run.date);
      markedDates[formattedDate] = { marked: true, selected: formattedDate === selectedDate };
    });
    return markedDates;
  };

  const formatDateToCentralTime = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const centralTimeOffset = -5 * 3600000; // UTC-5 for Central Time during standard time
    const centralTimeDate = new Date(date.getTime() + offset + centralTimeOffset);
    return format(centralTimeDate, 'yyyy-MM-dd');
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

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={getMarkedDates()}
        onDayPress={(day) => setSelectedDate(day.dateString)}
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
        data={runsForSelectedDate}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.runItem}>
            <Text style={styles.runTextTitle}>Run Details</Text>
            <View style={styles.runDetail}>
              <Text style={styles.runLabel}>Date:</Text>
              <Text style={styles.runValue}>{formatDateToCentralTime(item.date)}</Text>
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
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noDataText}>No run history available for this date.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
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

export default RunCalendar;

