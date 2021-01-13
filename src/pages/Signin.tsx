import React, { useState } from 'react'
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View, Button, StyleSheet, TextInputProps } from 'react-native'
import { request } from '../api/apiClient'

enum Colors {
    Pink = '#d73776',
    White = '#fff'
}

const UnderlinedInput = ({ title, ...props }: TextInputProps & { title: string }) => (
    <View style={{ width: '100%' }}>
        <View style={styles.inputContainer}>
            <View style={{ minWidth: 100 }}>
                <Text style={styles.inputLabel}>{title}</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
                <TextInput style={styles.inputText} {...props} />
            </View>
        </View>
    </View>
)

export default function Signin({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log("handleLogin", email, password);
        navigation.push('Home')

        // request.post('/api/v1/login/', {
        //     email,
        //     password,
        // })
        // .then(function (response) {
        //     console.log(response);
        //     navigation.push('Home')
        // })
        // .catch(function (error) {
        //     console.log(error)
        // })
    }

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 0, backgroundColor: Colors.Pink }} />
            <SafeAreaView style={{ flex: 1 }} >
                <View style={{ backgroundColor: '#D73776', flexGrow: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/images/logo.png')} />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexGrow: 0.3 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 24, fontFamily: 'Barlow', fontWeight: '400' }}>Welcome to </Text>
                        <Text style={{ fontSize: 24, fontFamily: 'Barlow', fontWeight: '700' }}>Live Stream</Text>
                    </View>

                    <Text style={{ fontSize: 18, fontFamily: 'Barlow' }}>Sign in</Text>

                    <View style={{ paddingHorizontal: 40 }}>
                        <UnderlinedInput 
                        title="Email" 
                        textContentType="emailAddress" 
                        autoCapitalize="none" 
                        onChangeText={text => { setEmail(text) }} />
                    </View>
                    <View style={{ paddingHorizontal: 40 }}>
                        <UnderlinedInput 
                        title="Password" 
                        secureTextEntry={true} 
                        textContentType="password"
                        onChangeText={text => { setPassword(text) }}  />
                    </View>
                    <View style={{ paddingVertical: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Roboto', fontWeight: '400', fontSize: 16 }}>I forgot my password, </Text>
                            <TouchableOpacity><Text style={{ fontFamily: 'Roboto', fontWeight: '700', fontSize: 16, color: '#0084FE' }}>Reset password</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => { handleLogin() }}><Text style={styles.buttonText}>Sign In</Text></TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.Pink,
        borderRadius: 20,
        height: 40,
        paddingVertical: 10
    },
    buttonText: {
        color: Colors.White,
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold'
    },
    inputLabel: {
        fontFamily: 'Barlow',
        fontWeight: '400',
        fontSize: 18,
        color: '#c4c4c4'
    },
    inputText: {
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 18,
        color: '#464646',
    },
    inputContainer: {
        height: 80,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1
    },
    buttonContainer: {
        paddingHorizontal: 40,
        flexGrow: 0.5,
        justifyContent: 'center'
    }
})
