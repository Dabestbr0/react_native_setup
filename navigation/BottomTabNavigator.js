// navigation/BottomTabNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeContent from '../screens/HomeContent';
import SettingsScreen from '../screens/SettingsScreen';
import ProfilePage from '../screens/ProfilePage';
import TopTabNavigator from './TopTabNavigator';


const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <BottomTab.Navigator>
    <BottomTab.Screen name="Home" component={HomeContent} />
    <BottomTab.Screen name="Settings" component={SettingsScreen} />
    <BottomTab.Screen name="Profile" component={ProfilePage} />
    <BottomTab.Screen name="Tabs" component={TopTabNavigator} />
  </BottomTab.Navigator>
);

export default BottomTabNavigator;
