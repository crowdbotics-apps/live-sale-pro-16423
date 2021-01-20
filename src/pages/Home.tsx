import React, {
    useEffect,
    useMemo,
    useState,
    useRef,
    useLayoutEffect,
    useCallback,
} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    LayoutAnimation,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import moment from 'moment';
import StopConfirmationModal from '../components/StopConfirmationModal';
import routes from '../navigation/routes';
import { logout } from '../api/auth';
import Images from '../utils/Images';
import MenuItem from '../components/MenuItem';
import StreamListItem from '../components/StreamListItem';
import { ScrollView } from 'react-native-gesture-handler';
import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_SHOP_ID, GET_LIVE_SALES_EVENTS } from '../api/queries';
import Colors from '../utils/Colors';

const pushserver = 'rtmp://3580eb.entrypoint.cloud.wowza.com/app-T2c38TX8/';
const stream = 'ea0c69ca';

/*
   public static final int VIDEO_PPRESET_16X9_540 = 3;
    public static final int VIDEO_PPRESET_16X9_720 = 4;
    public static final int VIDEO_PPRESET_16X9_1080 = 5;
*/
const RESOLUTIONS = [
    {
        label: '540',
        preset: 3,
    },
    {
        label: '720',
        preset: 4,
    },
    {
        label: '1080',
        preset: 5,
    },
];

const formatSeconds = (seconds) =>
    moment.utc(moment.duration(seconds, 'seconds').as('milliseconds'))
        .format(seconds >= 3600 ? 'HH:mm:ss' : 'mm:ss');

const NavigationButton = ({ onPress, iconSource, active }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.navButton, active ? styles.navButtonActive : undefined]}>
        <Image source={iconSource} style={styles.navButtonImg} />
    </TouchableOpacity>
);

const RecordingTime = ({ recordStartTime }) => {
    const [recordingTime, setRecordingTime] = useState();

    useEffect(() => {
        if (!recordStartTime) {
            return;
        }
        const updateDuration = () => {
            const seconds = (Date.now() - recordStartTime) / 1000;
            setRecordingTime(formatSeconds(seconds || 0));
        };
        updateDuration();
        const i = setInterval(updateDuration, 1000);
        return function cleanup() {
            if (i) {
                clearInterval(i);
            }
        };
    }, [recordStartTime]);
    return recordStartTime ? (
        <Text style={styles.recordingTime}>{recordingTime}</Text>
    ) : null;
};

export default function HomeScreen({ navigation }) {
    
    const cameraRef = useRef();
    const [isRecording, setIsRecording] = useState(false);
    const [recordStartTime, setRecordStartTime] = useState(0);
    const [isRightMenuActive, setIsRightMenuActive] = useState(false);
    const [isLeftMenuActive, setIsLeftMenuActive] = useState(false);
    const [isBottomMenuActive, setIsBottomMenuActive] = useState(false);
    const [isStopModalVisible, setIsStopModalVisible] = useState(false);
    const [expandedStreamId, setExpandedStreamId] = useState(0);
    const [getShopId, shopIdResponse] = useLazyQuery(GET_SHOP_ID);
    const [getLiveSales, liveSalesResponse] = useLazyQuery(GET_LIVE_SALES_EVENTS);

    const [options, setOptions] = useState({
        sound: true,
        flash: false,
        backCamera: false,
        resolution: RESOLUTIONS[RESOLUTIONS.length - 1],
    });

    const toggleOption = (option: any) => {
        console.log('toggleOption');
        if (option === 'backCamera' && options.backCamera) {
            // switch off flash state when switching to front camera
            setOptions({
                ...options,
                flash: false,
                [option]: !options[option],
            });
        } else {
            setOptions({
                ...options,
                [option]: !options[option],
            });
        }
    };

    const setResolution = (resolution) => {
        setOptions({
            ...options,
            resolution,
        });
    };

    const toggleStream = () => {
        console.log('toggleStream', isRecording);
        setIsLeftMenuActive(false);
        setIsRightMenuActive(false);
        setIsBottomMenuActive(false);
        LayoutAnimation.easeInEaseOut();
        if (isRecording) {
            setIsStopModalVisible(true);
        } else {
            setIsRecording(true);
            setRecordStartTime(Date.now());
            cameraRef.current && cameraRef.current.start();
        }
    };

    const stopStream = () => {
        setIsRecording(false);
        setRecordStartTime(0);
        setIsStopModalVisible(false);
        cameraRef.current && cameraRef.current.stop();
    };

    const handleLogout = () => {
        const completion = () => {
            navigation.replace(routes.LOGIN)
        }

        logout()
        .then(completion)
        .catch(completion)
    }

    const showMyStreams = () => {
        setIsRightMenuActive(false)
        setIsLeftMenuActive(false)
        setIsBottomMenuActive(!isBottomMenuActive)
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <NavigationButton
                    onPress={() => {
                        setIsLeftMenuActive(!isLeftMenuActive);
                        setIsRightMenuActive(false);
                        setIsBottomMenuActive(false);
                    }}
                    iconSource={Images.MENU_ICON}
                    active={isLeftMenuActive}
                />
            ),
            headerRight: () => (
                <NavigationButton
                    onPress={() => {
                        setIsRightMenuActive(!isRightMenuActive);
                        setIsLeftMenuActive(false);
                        setIsBottomMenuActive(false);
                    }}
                    iconSource={Images.SETTINGS_ICON}
                    active={isRightMenuActive}
                />
            ),
        });
    }, [navigation, isLeftMenuActive, isRightMenuActive]);

    useEffect(() => {
        getShopId()
        if (shopIdResponse.data && shopIdResponse.data.primaryShopId) {
            getLiveSales({ variables: { shopId: shopIdResponse.data.primaryShopId } })
        }
    }, [])
    
    if (shopIdResponse.loading) {
        return <ActivityIndicator size="large" color={Colors.Pink} />
    } else if (shopIdResponse.data && shopIdResponse.data.primaryShopId) {
        console.log("SHOP ID: ", shopIdResponse.data)
        console.log("LIVE SALES: ", liveSalesResponse.data)
        console.log("LIVE SALES ERROR: ", liveSalesResponse.error)
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                setIsLeftMenuActive(false);
                setIsRightMenuActive(false);
                setIsBottomMenuActive(false);
            }}>
            <View style={styles.container}>
                <NodeCameraView
                    style={{ flex: 1 }}
                    ref={cameraRef}
                    outputUrl={pushserver + stream}
                    /*
          
                              camera={{ cameraId: 1, cameraFrontMirror: true }}
                    audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                    video={{ preset: 1, bitrate: 500000, profile: 1, fps: 15, videoFrontMirror: false }}
                    smoothSkinLevel={3}
          
                    */
                    camera={{ cameraId: 1, cameraFrontMirror: true }}
                    audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                    video={{
                        preset: options.resolution.preset,
                        fps: 30,
                        bitrate: 500000,
                        profile: 1,
                        videoFrontMirror: false,
                    }}
                    smoothSkinLevel={3}
                    autopreview={true}
                    onStatus={(code: any, msg: string) => {
                        if (code === 2002) {
                            stopStream();
                            Alert.alert(
                                'Error connecting to stream',
                                'Please make sure you have a stream set up',
                            );
                        }

                        console.log('onStatus=' + code + ' msg=' + msg);
                    }}
                />
                {isLeftMenuActive && (
                    <View style={[styles.menu]}>
                        <MenuItem
                            onPress={() => { showMyStreams() }}
                            iconSource={Images.FLASH_ICON}
                            label={'My Streams'}
                        />
                        <MenuItem
                            onPress={() => { handleLogout() }}
                            iconSource={Images.LOGOUT_ICON}
                            label={'Log out'}
                        />
                    </View>
                )}
                {isRightMenuActive && (
                    <View style={[styles.menu]}>
                        <MenuItem
                            onPress={() => {
                                toggleOption('sound');
                                // cameraRef.current && cameraRef.current.switchCamera();
                            }}
                            iconSource={options.sound ? Images.MICROPHONE_ICON : Images.MICROPHONE_OFF_ICON}
                            label={options.sound ? 'Sound ON' : 'Sound OFF'}
                        />
                        <MenuItem
                            onPress={() => {
                                toggleOption('flash');
                                console.log(
                                    'toggleFlash',
                                    !options.flash,
                                    cameraRef.current?.flashEnable,
                                );
                                cameraRef.current &&
                                    cameraRef.current.flashEnable(!options.flash);
                            }}
                            disabled={!options.backCamera}
                            iconSource={options.flash ? Images.FLASH_ICON : Images.FLASH_OFF_ICON}
                            label={options.flash ? 'Flash ON' : 'Flash OFF'}
                        />
                        <MenuItem
                            onPress={() => {
                                if (!options.backCamera) {
                                    toggleOption('backCamera');
                                    cameraRef.current && cameraRef.current.switchCamera();
                                }
                            }}
                            iconSource={
                                options.backCamera ? Images.CHECKBOX_ICON : Images.CHECKBOX_OFF_ICON
                            }
                            label="Back Camera"
                        />
                        <MenuItem
                            onPress={() => {
                                if (options.backCamera) {
                                    toggleOption('backCamera');
                                    cameraRef.current && cameraRef.current.switchCamera();
                                }
                            }}
                            iconSource={
                                options.backCamera ? Images.CHECKBOX_OFF_ICON : Images.CHECKBOX_ICON
                            }
                            label="Front Camera"
                        />
                        {!isRecording && (
                            <>
                                <MenuItem 
                                    separator={true} 
                                    label="Resolution" />
                                {RESOLUTIONS.map((resolution) => (
                                    <MenuItem
                                        key={'r-' + resolution.preset}
                                        onPress={() => {
                                            setResolution(resolution);
                                        }}
                                        iconSource={
                                            options.resolution.preset === resolution.preset
                                                ? Images.CHECKBOX_ICON
                                                : Images.CHECKBOX_OFF_ICON
                                        }
                                        label={resolution.label}
                                    />
                                ))}
                            </>
                        )}
                    </View>
                )}
                <View
                    style={[
                        styles.controller,
                        isRecording ? styles.controllerRecording : null,
                    ]}>
                    <RecordingTime recordStartTime={recordStartTime} />
                    <TouchableOpacity style={styles.controllerButton} onPress={toggleStream}>
                        <Text style={styles.controllerButtonText}>
                            {isRecording ? 'STOP' : 'START'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {isBottomMenuActive && (
                    <ScrollView style={[styles.bottomMenu]}>
                        <StreamListItem
                            onPress={() => { 
                                expandedStreamId === 1 ? setExpandedStreamId(0) : setExpandedStreamId(1)
                            }}
                            date={'January 18, 2020'}
                            time={'11:30 am'}
                            isExpanded={expandedStreamId == 1}
                        />
                        <StreamListItem
                            onPress={() => { 
                                expandedStreamId === 2 ? setExpandedStreamId(0) : setExpandedStreamId(2)
                            }}
                            date={'January 18, 2020'}
                            time={'11:30 am'}
                            isExpanded={expandedStreamId == 2}
                        />
                        <StreamListItem
                            onPress={() => { 
                                expandedStreamId === 3 ? setExpandedStreamId(0) : setExpandedStreamId(3)
                            }}
                            date={'January 18, 2020'}
                            time={'11:30 am'}
                            isExpanded={expandedStreamId == 3}
                        />
                    </ScrollView>
                )}
                <StopConfirmationModal
                    onStopStream={stopStream}
                    onStopStreamFacebook={stopStream}
                    onClose={() => setIsStopModalVisible(false)}
                    visible={isStopModalVisible}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
    },
    controller: {
        position: 'absolute',
        bottom: 22,
        right: 22,
    },
    controllerRecording: {
        height: 60,
        width: 180,
        borderRadius: 30,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    recordingTime: {
        color: '#464646',
        fontSize: 24,
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    controllerButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#D73676',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controllerButtonText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 13,
        textAlign: 'center',
    },
    navButton: {
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonActive: {
        backgroundColor: '#BA1F5C',
    },
    menu: {
        width: '100%',
        backgroundColor: '#BA1F5C',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    bottomMenu: {
        width: '100%',
        backgroundColor: '#BA1F5C',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
});
