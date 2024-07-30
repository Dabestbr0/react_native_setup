@echo off
echo Installing dependencies from package.json...

REM Change directory to the project folder if necessary
REM cd path_to_your_project , use this command to change directory to your project

REM Run npm install to install all dependencies listed in package.json
REM Install each specific library
npm install @react-native-async-storage/async-storage
npm install expo-location
npm install @react-navigation/native
npm install react-native-safe-area-context
npm install react-native-calendars
npm install react-native-progress
npm install date-fns
npm install expo-sensors
npm install @react-native-community/slider
npm install @react-navigation/stack
npm install @react-navigation/bottom-tabs
npm install react-native-vector-icons
npm install @react-navigation/material-top-tabs
npm install react
npm install react-native
REM Add a new library install command right above
echo Installation complete.
pause