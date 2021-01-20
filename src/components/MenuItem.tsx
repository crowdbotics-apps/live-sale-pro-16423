import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text} from 'react-native';

const MenuItem = ({ onPress = {}, iconSource = null, label = '', disabled = false, separator = false }) => {
    const Wrapper = separator || disabled ? View : TouchableOpacity
    return (
        <Wrapper
            onPress={disabled ? () => { } : onPress}
            style={[styles.menuRow, separator && styles.menuRowSeparator]}>
            {iconSource && (
                <View style={[styles.menuImgWrapper, disabled ? { opacity: 0.6 } : null]}>
                    <Image source={iconSource} style={styles.menuImg} />
                </View>
            )}

            <Text style={[styles.menuText, disabled ? { opacity: 0.6 } : null]}>
                {label}
            </Text>
        </Wrapper>
    );
};

export default MenuItem

const styles = StyleSheet.create({
    menuRow: {
        height: 80,
        width: '100%',
        flexDirection: 'row',
        borderBottomColor: '#CB396B',
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    menuText: {
        // fontFamily: 'Robot, sans-serif',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 40,
        color: 'white',
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
})