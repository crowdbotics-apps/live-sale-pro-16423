import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Colors from '../utils/Colors';
import moment from 'moment';
import { LiveSaleEvent } from '../pages/Home'
import Images from '../utils/Images';

type StreamListProps = {
    event: LiveSaleEvent
    onPress: Function,
    disabled: boolean,
    separator: boolean,
    isExpanded : boolean,
    isWaiting: boolean,
    isReady: boolean,
    isFinished: boolean,
    onStart: Function,
    onStartStreaming: Function
}

const StreamListItem = ({
    event,
    onPress = () => { },
    disabled = false,
    separator = false,
    isExpanded = false,
    isWaiting = false,
    isReady = false,
    isFinished = false,
    onStart = () => { },
    onStartStreaming = () => { } }: StreamListProps) => {

    const message = isWaiting ? 'Live Sale Pro is activating the live stream. This may take a few minutes.' :
        isReady ? 'Stream is active' :
            'Start your broadcast using this stream. Setup will require a few minutes to start.'
    const date = moment(event?.startDate).format('MMM DD yyyy')
    const time = moment(event?.startDate).format('hh:mm a')
    const Wrapper = separator || disabled ? View : TouchableOpacity
    return (
        <Wrapper
            onPress={disabled || isFinished ? () => { } : onPress}
            style={[styles.menuRow, separator && styles.menuRowSeparator, isExpanded && styles.expandedMenuRow]}>
            <View style={styles.dateContainer}>
                <Text style={[styles.dateText, disabled ? { opacity: 0.6 } : null]}>{date}</Text>
                <Text style={[styles.dateText, disabled ? { opacity: 0.6 } : null]}>{time}</Text>
                {isWaiting ? <ActivityIndicator style={styles.activityIndicator} color={'white'} /> : <View />}
                {isFinished && <Image source={Images.CHECKMARK_ICON} style={styles.checkIcon} />}
            </View>
            {isExpanded && (
                <View style={styles.expandedContainer}>
                    <Text style={[styles.messageText, disabled ? { opacity: 0.6 } : null]}>{message}</Text>
                    { isWaiting || isReady &&
                        <Text style={[styles.boldedMessageText, disabled ? { opacity: 0.6 } : null]}>
                            {'Thank you for your patience.'}
                        </Text>
                    }
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: isReady ? Colors.Green : Colors.White }]}
                        onPress={() => isReady ? onStartStreaming() : onStart()}>
                        <Text style={styles.buttonText}>{isReady ? 'Start Stream' : 'Select'}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Wrapper>
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
        justifyContent: 'space-between',
        marginHorizontal: 30
    },
    dateText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 40,
        color: 'white',
        paddingVertical: 20
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
        alignContent: 'center'
    },
    button: {
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
    activityIndicator: {
        justifyContent: 'center',
        alignSelf: 'center'
    },
    checkIcon: {
        width: 20,
        height: 20,
        tintColor: '#fff',
        opacity: 0.6,
        alignSelf: 'center'
    }
})