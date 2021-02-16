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
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useLazyQuery, useMutation } from '@apollo/client'
import {
    GET_SHOP_ID,
    GET_LIVE_SALES_EVENTS,
    CREATE_INGEST_SERVER,
    GET_INGEST_SERVER_DETAILS
} from '../api/queries';
import Colors from '../utils/Colors';

// const pushserver = 'rtmp://3580eb.entrypoint.cloud.wowza.com/app-T2c38TX8/';
// const stream = 'ea0c69ca';

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

const RecordingTime = ({ recordStartTime }: { recordStartTime: any }) => {
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

export type LiveSaleEvent = {
    _id: number,
    title: string
    streamTarget: string,
    startDate: string,
    claimWord: string,
    includedUrl: string
}

export default function HomeScreen({ navigation }) {

    type LivSalesRequest = { shopId: string }

    type LivSalesResponse = { liveSalesEvents: { nodes: Array<LiveSaleEvent> } }

    type CreateIngestServerRequest = {
        input: {
            shopId: string,
            name: string
        }
    }
    type CreateIngestServerResponse = {
        createIngestServer: {
            name: string,
            status: string,
            _id: string
        }
    }

    type IngestServer = {
        name: string,
        shopId: string,
        status: string,
        dns: string,
        ip: string,
        inputUrl: string,
        outputUrl: string
    }
    type IngestServerDetailsRequest = { shopId: string, serverId: string }
    type IngestServerDetailsResponse = { getIngestServerDetails: IngestServer }

    const cameraRef = useRef();
    const [isRecording, setIsRecording] = useState(false);
    const [recordStartTime, setRecordStartTime] = useState(0);
    const [isRightMenuActive, setIsRightMenuActive] = useState(false);
    const [isLeftMenuActive, setIsLeftMenuActive] = useState(false);
    const [isBottomMenuActive, setIsBottomMenuActive] = useState(false);
    const [isStopModalVisible, setIsStopModalVisible] = useState(false);
    const [expandedStreamId, setExpandedStreamId] = useState(0);
    const [activeStreamId, setActiveStreamId] = useState(0);
    const [isStreamActive, setIsStreamActive] = useState(false);

    const [getShopId, shopIdResponse] = useLazyQuery(GET_SHOP_ID);
    const [getLiveSales, liveSalesResponse] = useLazyQuery<LivSalesResponse, LivSalesRequest>(GET_LIVE_SALES_EVENTS);
    const [createIngestServer, createIngestServerResponse] = useMutation<CreateIngestServerResponse, CreateIngestServerRequest>(CREATE_INGEST_SERVER);
    const [getIngestServerDetails, ingestServerDetailsResponse] = useLazyQuery<IngestServerDetailsResponse, IngestServerDetailsRequest>(GET_INGEST_SERVER_DETAILS);

    const liveSales = liveSalesResponse.data?.liveSalesEvents?.nodes
    const shopID = shopIdResponse.data?.primaryShopId
    const ingestServer = createIngestServerResponse.data?.createIngestServer
    const ingestServerDetails = ingestServerDetailsResponse.data?.getIngestServerDetails

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
        LayoutAnimation.easeInEaseOut();
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
    }, [])

    useEffect(() => {
        if (shopID) {
            getLiveSales({ variables: { shopId: shopID } })
        }
    }, [shopIdResponse])

    useEffect(() => {
        const interval = setInterval(fetchIngestServerDetails, 5000)
        return () => clearInterval(interval)
    }, [ingestServer])

    const fetchIngestServerDetails = () => {
        if (ingestServer?._id) {
            const inputUrl = ingestServerDetails?.inputUrl
            if (inputUrl && inputUrl !== '') { return }
            const params: IngestServerDetailsRequest = {
                shopId: shopID,
                serverId: ingestServer?._id
            }
            console.log("IngestServerDetailsRequest: ", params)
            getIngestServerDetails({ variables: params })
        }
    }

    const inputUrl = ingestServerDetails?.inputUrl
    const serverId = ingestServer?._id
    const isReady = inputUrl !== null && inputUrl !== undefined && inputUrl !== ''
    if (isReady && !isStreamActive) { 
        setIsStreamActive(true)
    }

    const renderBottomMenuItem = ({ item }: { item: LiveSaleEvent }) => {
        const onStart = () => {
            const params: CreateIngestServerRequest = {
                input: {
                    shopId: shopID,
                    name: item.title.replace(/ /g, '.')
                }
            }
            console.log("Starting Ingest Server: ", params)
            createIngestServer({ variables: params })
        }

        const onStartStreaming = () => {
            setIsBottomMenuActive(false)
            toggleStream()
        }

        return <StreamListItem
            event={item}
            onPress={() => { expandedStreamId === item._id ? setExpandedStreamId(0) : setExpandedStreamId(item._id) }}
            isExpanded={expandedStreamId == item._id}
            isWaiting={serverId !== null && serverId !== undefined && (!inputUrl || inputUrl === '')}
            isReady={isReady}
            onStart={onStart}
            onStartStreaming={onStartStreaming}
        />
    };

    console.log("SHOP ID: ", shopIdResponse.data)
    // console.log("LIVE SALES DATA: ", liveSales)
    // console.log("LIVE SALES ERROR: ", liveSalesResponse.error)
    console.log("Create Ingest Server Response: ", createIngestServerResponse.data)
    console.log("Create Ingest Server Response ERROR: " + createIngestServerResponse.error)
    console.log("Ingest Server Details Response: ", ingestServerDetails)

    if (shopIdResponse.loading) {
        return <ActivityIndicator size="large" color={Colors.Pink} />
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
                    outputUrl={ingestServerDetails?.inputUrl}
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
                            disabled={!liveSales}
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
                    <ScrollView style={[styles.menu]}>
                        <View>
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
                                iconSource={options.backCamera ? Images.CHECKBOX_ICON : Images.CHECKBOX_OFF_ICON}
                                label="Back Camera"
                            />
                            <MenuItem
                                onPress={() => {
                                    if (options.backCamera) {
                                        toggleOption('backCamera');
                                        cameraRef.current && cameraRef.current.switchCamera();
                                    }
                                }}
                                iconSource={options.backCamera ? Images.CHECKBOX_OFF_ICON : Images.CHECKBOX_ICON}
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
                    </ScrollView>
                )}
                {isStreamActive && <View
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
                </View>}
                <View style={[styles.bottomMenu]}>
                    {isBottomMenuActive && liveSales && (
                        <FlatList
                            data={liveSales}
                            renderItem={renderBottomMenuItem}
                            keyExtractor={(item) => JSON.stringify(item)}
                        />
                    )}
                </View>
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
