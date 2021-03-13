import React, {
    useEffect,
    useState,
    useRef,
    useLayoutEffect,
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
    GET_INGEST_SERVER_DETAILS,
    DELETE_INGEST_SERVER
} from '../api/queries';
import Colors from '../utils/Colors';
import {
    LiveSaleEvent,
    LivSalesResponse,
    LivSalesRequest,
    CreateIngestServerResponse,
    CreateIngestServerRequest,
    IngestServerDetailsResponse,
    IngestServerDetailsRequest,
    DeleteIngestServerRequest,
    DeleteIngestServerResponse
} from '../api/types';
import { RESOLUTIONS } from '../utils/utils';

// const pushserver = 'rtmp://3580eb.entrypoint.cloud.wowza.com/app-T2c38TX8/';
// const stream = 'ea0c69ca';

const formatSeconds = (seconds: any) =>
    moment.utc(moment.duration(seconds, 'seconds').as('milliseconds')).format(seconds >= 3600 ? 'HH:mm:ss' : 'mm:ss');

const NavigationButton = ({ onPress, iconSource, active }: { onPress: any, iconSource: any, active: any }) => (
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

export default function HomeScreen({ navigation }: { navigation: any }) {

    const cameraRef = useRef();
    const [isRecording, setIsRecording] = useState(false);
    const [recordStartTime, setRecordStartTime] = useState(0);
    const [isRightMenuActive, setIsRightMenuActive] = useState(false);
    const [isLeftMenuActive, setIsLeftMenuActive] = useState(false);
    const [isBottomMenuActive, setIsBottomMenuActive] = useState(false);
    const [isStopModalVisible, setIsStopModalVisible] = useState(false);
    const [expandedStreamId, setExpandedStreamId] = useState("");
    const [waitingEventId, setWaitingEventId] = useState<string | null>(null);
    const [readyEventId, setReadyEventId] = useState<string | null>(null);
    const [readyInputUrl, setReadyInputUrl] = useState<string | null>(null);

    const [getShopId, shopIdResponse] = useLazyQuery(GET_SHOP_ID);
    const [getLiveSales, liveSalesResponse] = useLazyQuery<LivSalesResponse, LivSalesRequest>(GET_LIVE_SALES_EVENTS);
    const [createIngestServer, createIngestServerResponse] = useMutation<CreateIngestServerResponse, CreateIngestServerRequest>(CREATE_INGEST_SERVER);
    const [getIngestServerDetails, ingestServerDetailsResponse] = useLazyQuery<IngestServerDetailsResponse, IngestServerDetailsRequest>(GET_INGEST_SERVER_DETAILS, { fetchPolicy: "network-only" });
    const [deleteIngestServer, deleteIngestServerResponse] = useMutation<DeleteIngestServerResponse, DeleteIngestServerRequest>(DELETE_INGEST_SERVER);

    const liveSales = liveSalesResponse.data?.liveSalesEvents?.nodes
    const shopID: string = shopIdResponse.data?.primaryShopId
    const ingestServer = createIngestServerResponse.data?.createIngestServer
    const ingestServerDetails = ingestServerDetailsResponse.data?.getIngestServerDetails

    // const isReady = ingestServerDetails?.inputUrl && ingestServerDetails?.inputUrl !== ''
    // const isWaiting = ingestServer?._id && !isReady
    // if (isReady && !isStreamActive) {
    //     setIsStreamActive(true)
    // }

    const [options, setOptions] = useState({
        sound: true,
        flash: false,
        backCamera: false,
        resolution: RESOLUTIONS[RESOLUTIONS.length - 1],
    });

    const toggleOption = (option: string) => {
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

    const setResolution = (resolution: any) => {
        setOptions({
            ...options,
            resolution,
        });
    };

    const toggleStream = () => {
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
        // setIsStreamActive(false);
        cameraRef.current && cameraRef.current.stop();

        const params: DeleteIngestServerRequest = {
            input: {
                shopId: shopID,
                serverId: ingestServer?._id
            }
        }
        console.log("Delete Ingest Server: ", params)
        deleteIngestServer({ variables: params })
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
        console.log("SHOP ID: ", shopIdResponse.data + '\n\n')
    }, [shopIdResponse])

    
    useEffect(() => {
        if (ingestServer?._id) {
            fetchIngestServerDetails(ingestServer.eventId)
        }
    }, [ingestServer])

    let serverDetailsInterval: any
    useEffect(() => {
        if (ingestServerDetails?.inputUrl && ingestServerDetails?.inputUrl !== '') {
            clearInterval(serverDetailsInterval)
            if (waitingEventId === ingestServerDetails.eventId) {
                setWaitingEventId(null)
            }
            setReadyEventId(ingestServerDetails.eventId)
            setReadyInputUrl(ingestServerDetails.inputUrl)
        } else if (ingestServerDetails) {
            clearInterval(serverDetailsInterval)
            serverDetailsInterval = setInterval(fetchIngestServerDetails, 5000)
            return () => clearInterval(serverDetailsInterval)
        }
    }, [ingestServerDetails])

    const startIngestServer = (item: LiveSaleEvent) => {
        const params: CreateIngestServerRequest = {
            input: {
                shopId: shopID,
                name: item.title.replace(/ /g, '.'),
                eventId: item._id
            }
        }
        console.log("Starting Ingest Server: ", params)
        createIngestServer({ variables: params })
    }

    const fetchIngestServerDetails = (itemId?: string) => {
        console.log('Calling ingest server details: ', itemId)
        // if (ingestServerDetails?.inputUrl && ingestServerDetails?.inputUrl !== '') {
        //     // clearInterval(serverDetailsInterval)
        //     return
        // }
        const params: IngestServerDetailsRequest = {
            shopId: shopID,
            eventId: itemId ? itemId : ingestServerDetails?.eventId
        }
        console.log("Ingest Server Details Request: ", params)
        getIngestServerDetails({ variables: params })
    }

    const renderBottomMenuItem = ({ item }: { item: LiveSaleEvent }) => {
        const onStart = () => {
            setWaitingEventId(item._id)
            if (item.status === 'active') {
                fetchIngestServerDetails(item._id)
            } else {
                startIngestServer(item)
            }
        }

        const onStartStreaming = () => {
            setIsBottomMenuActive(false)
            toggleStream()
        }

        return <StreamListItem
            event={item}
            onPress={() => { expandedStreamId === item._id ? setExpandedStreamId("") : setExpandedStreamId(item._id) }}
            isExpanded={expandedStreamId === item._id}
            isWaiting={waitingEventId === item._id}
            isReady={(readyEventId === item._id)}
            onStart={onStart}
            onStartStreaming={onStartStreaming}
        />
    };

    // useEffect(() => {
    //     console.log("LIVE SALES DATA: ", liveSales + '\n\n')
    //     console.log("LIVE SALES ERROR: ", liveSalesResponse.error + '\n\n')
    // }, [liveSalesResponse])

    // useEffect(() => {
    //     console.log("Create Ingest Server Response: ", createIngestServerResponse.data)
    //     console.log("Create Ingest Server ERROR: ", createIngestServerResponse.error + '\n\n')
    // }, [createIngestServerResponse])

    // useEffect(() => {
    //     console.log("Ingest Server Details Response: ", ingestServerDetails)
    //     console.log("Ingest Server Details ERROR: ", ingestServerDetailsResponse.error + '\n\n')
    // }, [ingestServerDetailsResponse])

    if (shopIdResponse.error) {
        handleLogout()
    }

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
                    outputUrl={readyInputUrl}
                    camera={{ cameraId: 1, cameraFrontMirror: true }}
                    audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                    video={{ preset: options.resolution.preset, bitrate: 400000, profile: 1, fps: 15, videoFrontMirror: false }}
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
                {readyEventId && <View
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
    controllerButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#D73676',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
