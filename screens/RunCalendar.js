import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';

const RunCalendar = () => {
  const [runHistory, setRunHistory] = useState([]);

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

  const getMarkedDates = () => {
    const markedDates = {};
    runHistory.forEach(run => {
      markedDates[run.date] = { marked: true };
    });
    return markedDates;
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={getMarkedDates()}
      />
      <FlatList
        data={runHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.runItem}>
            <Text style={styles.runText}>Date: {item.date}</Text>
            <Text style={styles.runText}>Start Time: {item.startTime}</Text>
            <Text style={styles.runText}>End Time: {item.endTime}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noDataText}>No run history available.</Text>}
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
