import React from 'react';
import { View, Text, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

function HomeContent({ navigation }) {
  return (

      // Render Data from SettingScreen
   
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>
            Home Content
          </Text>
          <Button
            title="Start"
            onPress={() => navigation.navigate('RunTimerStart')}
           />
        </View>

        

  );
}

export default HomeContent;

//Let's try to navigate with homescreen to the app timer with the button. Just by
// using the navigation container. 
