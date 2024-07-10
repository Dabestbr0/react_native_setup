// Import the necessary libraries and components
import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Import View, Text, and StyleSheet from React Native

// Define the TopTab2 functional component
const TopTab2 = () => (
  // Render a View with some text
  <View style={styles.tabContent}>
    <Text>Top Tab 2 Content</Text>
  </View>
);

// Define the styles for the component using StyleSheet
const styles = StyleSheet.create({
  // Style for the tabContent view
  tabContent: {
    flex: 1, // Make the view take up the entire screen
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
});

// Export the TopTab2 component as the default export
// This allows other parts of the application to import and use the TopTab2 component
export default TopTab2;
