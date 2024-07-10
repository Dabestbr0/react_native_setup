import 'react-native-gesture-handler'; // Add this import if not already present
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AppNavigator from './navigation/AppNavigator'; // Assuming AppNavigator contains additional navigations
import { SettingsProvider } from './contexts/SettingsData'; // Assuming SettingsProvider is for context

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AppNavigator" component={AppNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
