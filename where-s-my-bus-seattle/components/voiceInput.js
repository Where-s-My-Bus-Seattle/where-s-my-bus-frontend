import React, { Component, Fragment } from "react";
import { View, StyleSheet, Dimensions, Image, FileSystem } from "react-native";
import * as Speech from 'expo-speech';
import * as Permissions from "expo-permissions";
import { Audio } from 'expo-av';
import Ripple from "react-native-material-ripple";

const { width } = Dimensions.get("screen");
let image;

const recordingOptions = {
    android: {
        extension: '.wav',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
    },
    ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
};

export default function VoiceInput(props){
    let lat = props.lat
    let long = props.long
    let doneHandler = props.doneHandler
    let hideHandler = props.hideHandler
    let _recording = null
    let localUri = null
    let audioItem = {}
    let durationMillis = 0
    let isRecording = false
    let displayButton = props.displayButton

    let [isFetching, toggleIsFetching] = React.useState(false);

    async function getTranscription(){
        toggleIsFetching(true)
        try {
            // const uri = _recording.getURI();
            let wav = new FormData();
            wav.append('file', {
                uri: localUri,
                name: `test.wav`,
                type: `audio/wav`,
              });
            console.log('=WAV being sent=');
            console.log(wav._parts[0][1]);
            console.log('lat/lon: ', lat, long)

            const response = await fetch(`http://138.68.251.254:8000/api/v1/${lat}/${long}`, {
                method: 'POST',
                body: wav,
            })

            const json = await response.json();
            console.log('=response from the server:');
            console.log(json);

            const busData = {
                closest_stop: {
                    closest_name: json.closest_stop.closest_name,
                    closest_direction: json.closest_stop.closest_direction,
                    closest_minutes: json.closest_stop.closest_minutes,
                    closest_lat: json.closest_stop.closest_lat,
                    closest_lon: json.closest_stop.closest_lon
                },
                next_closest_stop: {
                    next_closest_name: json.next_closest_stop.next_closest_name,
                    next_closest_direction:json.next_closest_stop.next_closest_direction,
                    next_closest_minutes: json.next_closest_stop.next_closest_minutes,
                    next_closest_lat: json.next_closest_stop.next_closest_lat,
                    next_closest_lon: json.next_closest_stop.next_closest_lon
                },
                route: json.route
            }

            doneHandler(busData)
            // playRecording(uri);
            // speak(busData.closest_stop.closest_minutes)

        } catch (error) {
                console.log('There was an error', error);
                stopRecording();
                resetRecording();
        }
        toggleIsFetching(false)
        resetRecording();
    }

    async function handleOnPressIn() {
        console.log('=pressed in=')
        await startRecording();
    }

    async function handleOnPressOut(){
        console.log('=pressed out=')
        await stopRecording();
        await createAndLoadNewSoundObject();
        await getTranscription();
        hideHandler();
    }

    async function startRecording(){
        console.log('=starting recording=')
        const permission = Audio.getPermissionsAsync();
        if (permission){
            // const status = Audio.requestPermissionsAsync();
            // const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
            // if (status !== 'granted'){return;}
            // await Audio.setAudioModeAsync({ allowsRecordingIOS: true })
            isRecording = true
            _recording = new Audio.Recording();

            // some of these are not applicable, but are required
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                playThroughEarpieceAndroid: true,
            });
        } else{Audio.requestPermissionsAsync();}
        try {
            await _recording.prepareToRecordAsync(recordingOptions);
            await _recording.startAsync();
        } catch (error) {
            console.log(error);
            stopRecording();
        }
        console.log('should be a recording uri: ', _recording._uri)
    }

    // onEndRecording: props => async () => {
    //     try {
    //       await props.recording.stopAndUnloadAsync();
    //       await props.setAudioMode({ allowsRecordingIOS: false });
    //     } catch (error) {
    //       console.log(error); // eslint-disable-line
    //     }
  
    //     if (props.recording) {
    //       const fileUrl = props.recording.getURI();
    //       props.recording.setOnRecordingStatusUpdate(null);
    //       props.setState({ recording: null, fileUrl });
    //     }
    // },
    async function stopRecording(){
        console.log('=stopping recording=')
        isRecording = false
        try {
            await _recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: false })
        } catch (error) {
            console.log(error); // eslint-disable-line
        }
        if (_recording) {
            localUri = _recording.getURI();
            console.log('localUri: ', localUri);
            durationMillis = _recording.durationMillis
            _recording.setOnRecordingStatusUpdate(null);
            // _recording = null
        }
    }
    function makeAudioObject(){
        audioItem = {
            id: uuid(),
            audioUrl: localUri,
            duration: durationMillis,
        };
    }
    async function createAndLoadNewSoundObject(){
        let newSoundObject = await _recording.createNewLoadedSoundAsync()
        // const soundObject = new Audio.Sound();

        // await soundObject.loadAsync(newSoundObject);
        // await soundObject.playAsync();
        console.log('new sound obj: ', newSoundObject)
        await newSoundObject.sound.playAsync()
        // playRecording(newSoundObject.sound);
    }
    // async function playRecording(uri) {
    //     uri = {"uri": uri}
    //     console.log('the "uri" that we are "playing": ', uri)
    //     await Audio.setIsEnabledAsync(true);
    //     let newSoundObject = await _recording.createNewLoadedSoundAsync()
    //     // const sound = Audio.Sound.create(uri, }, onPlaybackStatusUpdate = null, downloadFirst = true)
    //     // const sound = new Audio.Sound();
    //     // await sound.loadAsync(uri);
    //     console.log('here??')
    //     await newSoundObject.playAsync();
    //     console.log('ere????xxx')
    // }
    async function playRecording(uri){
        onPlaybackStatusUpdate = ({
            durationMillis,
            positionMillis,
            isPlaying,
            isLooping,
            didJustFinish,
        })

        sound = await Audio.Sound.createAsync({ uri: localUri }, { shouldPlay: true }, onPlaybackStatusUpdate)

    }


    async function deleteRecordingFile(){
        console.log("=Deleting file=");
        console.log('recording ', audioItem)
        try {
            const info = await FileSystem.getInfoAsync(_recording.getURI());
            await FileSystem.deleteAsync(info.uri)
        } catch (error) {
            console.log("There was an error deleting recording file", error);
        }
    }

    async function resetRecording(){
        await deleteRecordingFile();
        _recording = null;
    }

    speak = (minutes) => {
        var thingToSay = `Bus 8 will be here in ${minutes} minutes.`;
        Speech.speak(thingToSay);
        console.log('speaking...=========')
    }

    const num = 2400
    const bool = true

    if (displayButton){
        image = (
            <Image
            style={styles.showButton}
            source={require("./button.png")}
            />
        )
    } else {
        image = (
            <Image
            style={styles.hideButton}
            source={require("./button.png")}
            />
        )
    }

    return (
        <Ripple
            rippleColor="rgb(52, 61, 235)"
            rippleDuration={num}
            rippleCentered={bool}
            onPressIn={() => handleOnPressIn()}
            onPressOut={() => handleOnPressOut()}
        >
            {image}
        </Ripple>
    )
}

let styles = StyleSheet.create({
    showButton: {
        width: width / 1.5,
        height: width / 1.5,
        alignSelf: "center",
        margin: "8%"
    },
    hideButton: {
        width: 0,
        height: 0,
        alignSelf: "center",
    }
})
