import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeContent from '../screens/HomeContent';
import SettingsScreen from '../screens/SettingsScreen';
import ProfilePage from '../screens/ProfilePage';
import TopTabNavigator from './TopTabNavigator';
import RunCalendar from '../screens/RunCalendar';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <BottomTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Settings':
            iconName = focused ? 'settings' : 'settings-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          case 'Tabs':
            iconName = focused ? 'grid' : 'grid-outline';
            break;
          case 'Run Calendar':
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          default:
            iconName = 'help-circle';
            break;
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        display: 'flex',
      },
      headerShown: false, // This will hide the header for all screens
    })}
  >
    <BottomTab.Screen name="Home" component={HomeContent} />
    <BottomTab.Screen name="Settings" component={SettingsScreen} />
    <BottomTab.Screen name="Profile" component={ProfilePage} />
    <BottomTab.Screen name="Tabs" component={TopTabNavigator} />
    <BottomTab.Screen name="Run Calendar" component={RunCalendar} />
  </BottomTab.Navigator>
);

export default BottomTabNavigator;
