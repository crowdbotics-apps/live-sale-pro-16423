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
import { setupHttpConfig } from './src/api/apiClient';
import RootNavigator from './src/navigation/RootNavigator';

setupHttpConfig()

export default () => {
    return <RootNavigator />
};

