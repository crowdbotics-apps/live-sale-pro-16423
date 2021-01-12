import React, { useEffect, useRef, useState } from 'react'
import {NodeCameraView} from 'react-native-nodemediaclient'
import { Button, PermissionsAndroid, Platform, SafeAreaView, Text } from 'react-native'

const requestCameraPermission = async () => {
  if (Platform.OS === 'ios') return true
    // @ts-nocheck
  try {
    const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA,PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
  {
        title: "Cool Photo App Camera And Microphone Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return true
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
      return true
    } else {
      console.log("Camera permission denied");
      return false
    }
  } catch (err) {
    console.warn(err);
    return true
  }
  // @ts-check
};

export default () => {
    const nodeRef = useRef()
    const [permitted, setPermission] = useState(false)
    const [canLaunch, setCanLaunch] = useState(false)

    useEffect(() => {
        const bootstrap = async () => {
            const p = await requestCameraPermission()
            setPermission(p)
            setCanLaunch(true)
        }

        bootstrap()
    }, [])

    const start = async () => {

    }

    return <SafeAreaView style={{flex: 1}}>
    {canLaunch && <NodeCameraView 
    ref={nodeRef}
    style={{flexGrow: 1}}
    camera={{cameraId: 1, cameraFrontMirror: true}} 
    audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
    video={{ preset: 12, bitrate: 400000, profile: 1, fps: 15, videoFrontMirror: false }}
    autopreview={true} />}
    <Button title="Start" onPress={start} />
</SafeAreaView>}