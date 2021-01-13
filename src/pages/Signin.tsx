import React from 'react'
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View, Button, StyleSheet, TextInputProps } from 'react-native'

enum Colors {
    Pink = '#d73776',
    White = '#fff'
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.Pink,
        borderRadius: 20,
        paddingVertical: 8
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
    }
})

const LInput = ({title, ...props}: TextInputProps & {title: string}) =>  <View style={{width: '100%'}}>
        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', borderBottomColor: '#c4c4c4', borderBottomWidth: 1 }}>
            <View style={{minWidth: 100}}>
                <Text style={styles.inputLabel}>{title}</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
                <TextInput style={styles.inputText} {...props} />
            </View>
        </View>
    </View>

export default ({navigation}) => <SafeAreaView style={{flex: 1}}>
    <View style={{backgroundColor: '#D73776', flexGrow: 0.2, justifyContent: 'center', alignItems: 'center'}}>
        <Image source={require('../../assets/images/logo.png')} />
    </View>
    <View style={{justifyContent: 'center', alignItems: 'center', flexGrow: 0.6}}>
    <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 24, fontFamily: 'Barlow', fontWeight: '400'}}>Welcome to </Text>
        <Text style={{fontSize: 24, fontFamily: 'Barlow', fontWeight: '700'}}>Live Stream</Text>
    </View>
    
    <Text style={{fontSize: 18, fontFamily: 'Barlow'}}>Sign in</Text>
    
    <View style={{paddingHorizontal: 40}}>
        <LInput title="Email" textContentType="emailAddress" autoCapitalize="none" />
    </View>
    <View style={{paddingHorizontal: 40}}>
        <LInput title="Password" secureTextEntry={true} textContentType="password" />
    </View>
    <View style={{paddingVertical: 12}}>
        <View style={{flexDirection: 'row'}}>
        <Text style={{fontFamily: 'Roboto', fontWeight: '400', fontSize: 16}}>I forgot my password, </Text>
        <TouchableOpacity><Text style={{fontFamily: 'Roboto', fontWeight: '700', fontSize: 16, color: '#0084FE'}}>Reset password</Text></TouchableOpacity>
        </View>
    </View>
    </View>
    <View style={{paddingHorizontal: 40, flexGrow: 0.2, justifyContent: 'center'}}>
        <TouchableOpacity style={styles.button} onPress={() => {navigation.push('Home')}}><Text style={styles.buttonText}>Sign In</Text></TouchableOpacity>
    </View>
</SafeAreaView>