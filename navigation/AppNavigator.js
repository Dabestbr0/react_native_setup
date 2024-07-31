import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import RunTimerScreen from '../screens/RunTimerScreen';
import RunCalendar from '../screens/RunCalendar'; // Import the new screen

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RunTimer" component={RunTimerScreen} />
        <Stack.Screen name="Run Calendar" component={RunCalendar} /> {/* Add the new screen here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
