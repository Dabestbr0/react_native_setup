// Import necessary libraries and components
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import the screens for the Home, Settings, and SignIn
import HomeScreen from './components/HomeScreen';
import SettingsScreen from './components/SettingsScreen';
import SignInScreen from './components/SignInScreen';

// Create a Stack Navigator
const Stack = createStackNavigator();

// Define the main App component
export default function App() {
  return (
    // Wrap the navigator inside NavigationContainer to manage the navigation tree
    <NavigationContainer>
      {/* Define the stack navigator and set the initial route to SignIn */}
      <Stack.Navigator initialRouteName="SignIn">
        {/* Define the SignIn screen route */}
        <Stack.Screen name="SignIn" component={SignInScreen} />
        {/* Define the Home screen route */}
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Define the Settings screen route */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
