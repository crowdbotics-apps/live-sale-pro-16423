import oAuth2Config from "../config/oAuth2";
import { authorize, AuthorizeResult } from 'react-native-app-auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export function authenticateUser(navigation: any) {
    try {
        const onSuccess = async (result: AuthorizeResult) => {
            console.log('result', result)
            if (result.accessToken !== null) {
                console.log(result.accessToken)
                await AsyncStorage.setItem('access_token', result.accessToken)
                navigation.replace('Home')
            }
        }

        const onError = (error: any) => {
            console.log(`Error Login: ` + error)
        }

        authorize(oAuth2Config)
            .then(onSuccess)
            .catch(onError)
    } catch (error) {
        console.log(error);
    }
}