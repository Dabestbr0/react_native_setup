// Import the necessary libraries and components
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer from React Navigation
import BottomTabNavigator from './BottomTabNavigator'; // Import the BottomTabNavigator component from the navigation folder
import { createStackNavigator } from '@react-navigation/stack';
import RunTimerStart from '../screens/RunTimerScreen';

const Stack = createStackNavigator();

// Define the HomeScreen functional component
const AppNavigator = () => (
  // Wrap the BottomTabNavigator in a NavigationContainer
  // This provides the navigation context for the app
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="RunTimerStart" component={RunTimerStart} />
      
    </Stack.Navigator>
  </NavigationContainer>
);

// Export the AppNavigator component as the default export
// This allows other parts of the application to import and use the AppNavigator component
export default AppNavigator;
