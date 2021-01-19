/**
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signin from '../pages/Signin'
import Home from '../pages/Home';
import routes from './routes';

const Stack = createStackNavigator();
const theme = {
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
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator initialRouteName={routes.LOGIN}>
                <Stack.Screen
                    name={routes.HOME}
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
                    name={routes.LOGIN}
                    component={Signin}
                    options={{ 
                        headerShown: false,
                        animationTypeForReplace: 'pop'
                    }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
