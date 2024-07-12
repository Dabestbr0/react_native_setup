import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeContent from './screens/HomeContent';
import RunTimerStartScreen from './screens/RunTimerScreen';
import { SettingsProvider } from './contexts/SettingsData';
import BottomTabNavigator from './navigation/BottomTabNavigator'; // Change

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SettingsProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RunTimerStart" component={RunTimerStartScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6', // Light blue background color
  },
});
