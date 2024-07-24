import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeContent from './screens/HomeContent';
import RunTimerStartScreen from './screens/RunTimerScreen';
import RunCalendar from './screens/RunCalendar';
import { SettingsProvider } from './contexts/SettingsData';
import BottomTabNavigator from './navigation/BottomTabNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RunTimerStart" component={RunTimerStartScreen} />
          <Stack.Screen name="RunHistory" component={RunCalendar} />
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6', // Light blue background color
  },
});
