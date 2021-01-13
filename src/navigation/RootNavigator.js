/**
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signin from '../pages/Signin'
import Home from '../pages/Home';

const Stack = createStackNavigator();
const Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        primary: '#fff',
        background: '#fff',
        card: '#D73776',
        text: '#000',
    },
};

const RootNavigator = () => {
    console.log("root navigator")
    const signedIn = true;
    return (
        <NavigationContainer theme={Theme}>
            <Stack.Navigator initialRouteName="SignIn">
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        title: 'Live Stream',
                        headerTintColor: '#fff',
                        headerStyle: {
                            borderBottomColor: '#D73776',
                            backgroundColor: '#D73776',
                        },
                    }}
                />
                <Stack.Screen
                    name="SignIn"
                    component={Signin}
                    options={{ headerShown: false }} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
