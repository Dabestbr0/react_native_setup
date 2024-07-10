// Import the necessary libraries and components
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; // Import the top tab navigator from React Navigation
import TopTab1 from '../components/TopTab1'; // Import the TopTab1 component from the components folder
import TopTab2 from '../components/TopTab2'; // Import the TopTab2 component from the components folder

// Create a TopTabNavigator instance
const TopTab = createMaterialTopTabNavigator();

// Define the TopTabNavigator component
// This component sets up the top tab navigation structure
const TopTabNavigator = () => (
  <TopTab.Navigator>
    {/* Define the TopTab1 tab, which renders the TopTab1 component */}
    <TopTab.Screen name="TopTab1" component={TopTab1} />
    {/* Define the TopTab2 tab, which renders the TopTab2 component */}
    <TopTab.Screen name="TopTab2" component={TopTab2} />
  </TopTab.Navigator>
);

// Export the TopTabNavigator component as the default export
// This allows other parts of the application to import and use the TopTabNavigator component
export default TopTabNavigator;
