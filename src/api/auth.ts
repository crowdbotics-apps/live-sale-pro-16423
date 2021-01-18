import oAuth2Config from "../config/oAuth2";
import { authorize, AuthorizeResult, refresh, RefreshResult, revoke } from 'react-native-app-auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

export function authenticateUser() {
    try {
        const onSuccess = async (result: AuthorizeResult) => {
            console.log('result', result)
            if (result.accessToken !== null) {
                console.log(result.accessToken)
                await AsyncStorage.setItem('access_token', result.accessToken)
                await AsyncStorage.setItem('refresh_token', result.refreshToken)
            }
        }

        const onError = (error: any) => {
            console.log(`Error Login: ` + error)
        }

        return authorize(oAuth2Config)
                .then(onSuccess)
                .catch(onError)
    } catch (error) {
        console.log(error);
    }
}

export async function refreshSession() {
    try {
        const onSuccess = async (result: RefreshResult) => {
            console.log('result', result)
            if (result.accessToken !== null) {
                await AsyncStorage.setItem('access_token', result.accessToken)
            }
            if (result.refreshToken !== null) {
                await AsyncStorage.setItem('refresh_token', result.refreshToken)
            }
        }

        const onError = (error: any) => {
            console.log(`Error Login: ` + error)
        }

        const refreshToken = await AsyncStorage.getItem('refresh_token')
        if (refreshToken !== null) {
            refresh(oAuth2Config, {
                refreshToken: refreshToken
            })
            .then(onSuccess)
            .catch(onError)
        }
    } catch (error) {
        console.log(error);
    }
}

export async function logout() {
    try {
        const onSuccess = async () => {
            console.log("Successfully logged out: ")
            await AsyncStorage.removeItem("access_token")
            await AsyncStorage.removeItem('refresh_token')
        }

        const onError = (error: any) => {
            console.log(`Error Logout: ` + error)
        }

        const accessToken = await AsyncStorage.getItem('access_token')
        if (accessToken !== null) {
            return revoke(oAuth2Config, {
                        tokenToRevoke: accessToken,
                        includeBasicAuth: true,
                        sendClientId: true,
                    })
                    .then(onSuccess)
                    .catch(onError)
        }
        
    } catch (error) {
        console.log(error);
    }
}