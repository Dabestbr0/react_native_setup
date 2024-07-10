import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import HomeContent from './screens/HomeContent'; // Import your HomeContent screen
import RunTimerStartScreen from './screens/RunTimerScreen'; // Import your RunTimerStartScreen
import { SettingsProvider } from './contexts/SettingsData'; // Assuming SettingsProvider is for context

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeContent} />
          <Stack.Screen name="HomeContent" component={HomeContent} />
          <Stack.Screen name="RunTimerStart" component={RunTimerStartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}
