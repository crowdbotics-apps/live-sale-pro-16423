import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import Colors from '../utils/Colors';

const StreamListItem = ({ 
    onPress = {}, 
    date = '', 
    time = '', 
    disabled = false, 
    separator = false, 
    isExpanded = false,
    onStart }) => {
    return (
        <TouchableOpacity
            onPress={disabled ? () => { } : onPress}
            style={[styles.menuRow, separator && styles.menuRowSeparator, isExpanded && styles.expandedMenuRow]}>
            <View style={styles.dateContainer}>
                <Text style={[styles.dateText, disabled ? { opacity: 0.6 } : null]}>
                    {date}
                </Text>
                <Text style={[styles.dateText, disabled ? { opacity: 0.6 } : null]}>
                    {time}
                </Text>
            </View>
            {isExpanded && (
                <View style={styles.expandedContainer}>
                    <Text style={[styles.messageText, disabled ? { opacity: 0.6 } : null]}>
                        {'Start your broadcast using this stream. Setup will require a few minutes to start.'}
                    </Text>
                    <Text style={[styles.boldedMessageText, disabled ? { opacity: 0.6 } : null]}>
                        {'Thank you for your patience.'}
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={() => { onStart() }}><Text style={styles.buttonText}>Select</Text></TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default StreamListItem

const styles = StyleSheet.create({
    menuRow: {
        width: '100%',
        flexDirection: 'column',
        borderBottomColor: '#CB396B',
        borderBottomWidth: 1,
    },
    expandedMenuRow: {
        backgroundColor: Colors.DarkPink
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    dateText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 40,
        color: 'white',
        padding: 20
    },
    messageText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 28,
        color: 'white',
        textAlign: 'center'
    },
    boldedMessageText: {
        fontFamily: 'Roboto',
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28,
        color: 'white',
        textAlign: 'center'
    },
    menuRowSeparator: {
        backgroundColor: '#464646',
        paddingLeft: 24,
    },
    menuImgWrapper: {
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandedContainer: {
        padding: 45,
        paddingTop: 0,
        alignContent:'center'
    },
    button: {
        backgroundColor: Colors.White,
        borderRadius: 20,
        height: 40,
        paddingVertical: 10,
        marginTop: 30
    },
    buttonText: {
        color: Colors.Text,
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold'
    },
})