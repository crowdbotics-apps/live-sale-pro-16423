/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack'
import Signin from './src/pages/Signin'
import Home from './src/pages/Home';
import { Button, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const RootStack = createStackNavigator()


export default () => {

  // return <Signin />
  return <NavigationContainer>
    <RootStack.Navigator initialRouteName="Home">
      <RootStack.Screen name="Signin" component={Signin} options={{headerShown: false}} />
      <RootStack.Screen name="Home" component={Home} options={{
        headerStyle: {
          backgroundColor: '#D73776',
        },
        headerTitleStyle: {
          fontFamily: 'Barlow',
          fontSize: 24
        },
        headerTintColor: 'white',
        headerTitle: 'Live Stream',
        headerLeft: props => <TouchableOpacity onPress={() => {}} style={{paddingHorizontal: 20}}>
          <Image source={require('./src/assets/images/menu.png')} />
        </TouchableOpacity>,
        headerRight: props => <TouchableOpacity onPress={() => {}} style={{paddingHorizontal: 20}}>
          <Image source={require('./src/assets/images/settings.png')} />
        </TouchableOpacity>,
        }} />
    </RootStack.Navigator>
  </NavigationContainer>
};

