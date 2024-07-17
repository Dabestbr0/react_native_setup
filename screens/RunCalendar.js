import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';

const RunCalendar = () => {
  const [runHistory, setRunHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [runsForSelectedDate, setRunsForSelectedDate] = useState([]);

  useEffect(() => {
    const fetchRunHistory = async () => {
      try {
        const storedRuns = await AsyncStorage.getItem('runHistory');
        const history = storedRuns ? JSON.parse(storedRuns) : [];
        setRunHistory(history);
      } catch (error) {
        console.error('Failed to fetch run data', error);
      }
    };

    fetchRunHistory();
  }, []);

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
    const centralTimeOffset = -6 * 3600000; // UTC-6 for Central Time during standard time
    const centralTimeDate = new Date(date.getTime() + offset + centralTimeOffset);
    return format(centralTimeDate, 'yyyy-MM-dd');
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={getMarkedDates()}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />
      <FlatList
        data={runsForSelectedDate}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.runItem}>
            <Text style={styles.runText}>Date: {formatDateToCentralTime(item.date)}</Text>
            <Text style={styles.runText}>Start Time: {item.startTime}</Text>
            <Text style={styles.runText}>End Time: {item.finishTime}</Text>
            <Text style={styles.runText}>Elapsed Time: {item.timeElapsed}</Text>
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
    padding: 20,
    backgroundColor: '#fff',
  },
  runItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  runText: {
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default RunCalendar;


