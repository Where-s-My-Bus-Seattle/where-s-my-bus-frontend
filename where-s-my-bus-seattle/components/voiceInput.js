import React from "react";
import { StyleSheet, Dimensions, Image } from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import Ripple from "react-native-material-ripple";


export default function VoiceInput(props){
    let lat = props.lat;
    let long = props.long;
    let doneHandler = props.doneHandler;
    let hideButtonHandler = props.hideHandler;
    let displayButton = props.displayButton;
    let longRecordingHandler = props.longRecordingHandler;

    let _recording = null;
    let localUri = null;
    let audioItem = {};
    let durationMillis = 0;
    let isRecording = false;
    let notLongRecording;

    let [isFetching, toggleIsFetching] = React.useState(false);

    // const recordingOptions = require('./recordingOptions').recordingOptions;
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

//////////////////////////////////////////////////////////////////////////////////////
// Fetch Route Data //////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function getTranscriptionFromServer(){
        toggleIsFetching(true);

        // reading in the audio file as a base64 encoded string
        const options = { encoding: 'base64' };
        const base64EncodedAudio = await FileSystem.readAsStringAsync(localUri, options);

        try {
            let url = `http://138.68.251.254:8000/api/v1/${lat}/${long}`

            console.log('\n');
            console.log('=Audio Request to Server=');
            console.log(url);

            const response = await fetch(url, {
                method: 'POST',
                body: base64EncodedAudio,
            });

            const json = await response.json();
            console.log('\n');
            console.log('=response from the server:');
            console.log(json);

            hideButtonHandler();
            doneHandler(json);
            speak(json);


        } catch (error) {
                console.log('There was an error', error);
        }
        toggleIsFetching(false);
        resetRecording();
    }

//////////////////////////////////////////////////////////////////////////////////////
// Press In / Out ////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function handleOnPressIn() {
        console.log('\n');
        console.log('=pressed in=');
        notLongRecording = true;
        await startRecording();
    }

    async function handleOnPressOut(){
        console.log('\n');
        console.log('=pressed out=');
        await stopRecording();

        const info = await FileSystem.getInfoAsync(_recording.getURI());
        
        let bigEnough = info.size > 60000;
        console.log("notLongRecording: ", notLongRecording)
        console.log("big enough: ", bigEnough)
        
        if(notLongRecording === true && bigEnough){
            await getTranscriptionFromServer();
        }
    }

    async function handleTooLongRecording(){
        console.log('recording too long')
        notLongRecording = false;
        longRecordingHandler();
        await stopRecording();
    }

//////////////////////////////////////////////////////////////////////////////////////
// Start Recording ///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function startRecording(){
        console.log('\n');
        console.log('=starting recording=');
        let permission = await Audio.getPermissionsAsync();
        if (permission.status === 'granted') {
            isRecording = true;
            _recording = new Audio.Recording();

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                playThroughEarpieceAndroid: false,
            });

            try {
                await _recording.prepareToRecordAsync(recordingOptions);
                await _recording.startAsync();
                setTimeout(() => {
                    if (isRecording){
                        handleTooLongRecording();
                    }
                }, 6000);
            } catch (error) {
                console.log('Error starting recording: ', error);
                stopRecording();
            }
            console.log('should be a recording uri: ', _recording._uri);

        } else {
            await Audio.requestPermissionsAsync();
        }

    }

//////////////////////////////////////////////////////////////////////////////////////
// Stop Recording ////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function stopRecording(){
        if (isRecording === false){return};
        console.log('\n');
        console.log('=stopping recording=');
        isRecording = false;
        try {
            await _recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        } catch (error) {
            console.log(error);
        }

        if (_recording) {
            localUri = _recording.getURI();
            durationMillis = _recording.durationMillis;
            _recording.setOnRecordingStatusUpdate(null);
        }
    }

//////////////////////////////////////////////////////////////////////////////////////
// Speak / Play Recording ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function loadAndPlayRecording(){
        audioItem = await _recording.createNewLoadedSoundAsync();
        await audioItem.sound.playAsync();
    }

    function speak(json) {
        var thingToSay = `Route ${json.route} to ${json.closest_stop.closest_destination} will come to ${json.closest_stop.closest_name} in ${json.closest_stop.closest_minutes} minutes. To ${json.next_closest_stop.next_closest_destination} will come to ${json.next_closest_stop.next_closest_name} in ${json.next_closest_stop.next_closest_minutes} minutes`
        Speech.speak(thingToSay);
        console.log('speaking...=========');
    }

//////////////////////////////////////////////////////////////////////////////////////
// Delete Recording //////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function resetRecording(){
        await deleteRecordingFile();
        _recording = null;
    }
    
    async function deleteRecordingFile(){
        console.log('\n');
        console.log("=Deleting file=");
        try {
            const info = await FileSystem.getInfoAsync(_recording.getURI());
            console.log('=Finding Local File= ');
            console.log(info);
            await FileSystem.deleteAsync(info.uri);
            const temp = await FileSystem.getInfoAsync(_recording.getURI());
            console.log('=File is now deleted= ');
            console.log(temp);
        } catch (error) {
            console.log("There was an error deleting recording file", error);
        }
    }

//////////////////////////////////////////////////////////////////////////////////////
// Render Voice-Button ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    if (displayButton){
        image = (
            <Image
            style={styles.showButton}
            source={require("./button.png")}
            />
        );
    } else {
        image = (
            <Image
            style={styles.hideButton}
            source={require("./button.png")}
            />
        );
    }

    return (
        <Ripple
            rippleColor="rgb(52, 61, 235)"
            rippleDuration={num}
            rippleCentered={bool}
            onPressIn={() => handleOnPressIn()}
            onPressOut={() => setTimeout(() => { handleOnPressOut()}, 500)}
        >  
            {image}
        </Ripple>
    );
}

//////////////////////////////////////////////////////////////////////////////////////
// Button Styling ////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
const { width } = Dimensions.get("screen");
const num = 2400;
const bool = true;
let image;

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
});
