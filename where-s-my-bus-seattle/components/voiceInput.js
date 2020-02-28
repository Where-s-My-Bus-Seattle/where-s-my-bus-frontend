import React, { Component, Fragment } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import * as Permissions from "expo-permissions";
import { Audio } from 'expo-av';
import Ripple from "react-native-material-ripple";


export default function VoiceInput(props){
    let lat = props.lat
    let long = props.long
    let doneHandler = props.doneHandler
    let hideButtonHandler = props.hideHandler
    let displayButton = props.displayButton

    let _recording = null
    let localUri = null
    let audioItem = {}
    let durationMillis = 0
    let isRecording = false

    let [isFetching, toggleIsFetching] = React.useState(false);

    let recordingOptions = require('./recordingOptions').recordingOptions

//////////////////////////////////////////////////////////////////////////////////////
// Fetch Route Data //////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function getTranscriptionFromServer(){
        toggleIsFetching(true)

        try {
            let wav = new FormData();
            wav.append('file', {
                // uri: audioItem,
                uri: localUri,
                name: `test.wav`,
                type: `audio/wav`,
              });
            console.log('=WAV being sent=');
            // console.log(wav._parts[0][1]);
            console.log('lat/lon: ', lat, long)

            const response = await fetch(`http://138.68.251.254:8000/api/v1/${lat}/${long}`, {
                method: 'POST',
                body: wav,
            })

            const json = await response.json();
            console.log('=response from the server:');
            console.log(json);

            hideButtonHandler();
            doneHandler(json)
            speak(json.closest_stop.closest_minutes)


        } catch (error) {
                console.log('There was an error', error);
        }
        toggleIsFetching(false)
        resetRecording();
    }

//////////////////////////////////////////////////////////////////////////////////////
// Press In / Out ////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function handleOnPressIn() {
        console.log('=pressed in=')
        await startRecording();
    }

    async function handleOnPressOut(){
        console.log('=pressed out=')
        await stopRecording();
        await loadAndPlayRecording();
        await getTranscriptionFromServer();
    }

//////////////////////////////////////////////////////////////////////////////////////
// Start Recording ///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function startRecording(){
        console.log('=starting recording=')
        const permission = Audio.getPermissionsAsync();

        if (permission) {
            isRecording = true
            _recording = new Audio.Recording();

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                playThroughEarpieceAndroid: true,
            });

        } else {
            Audio.requestPermissionsAsync();
        }

        try {
            await _recording.prepareToRecordAsync(recordingOptions);
            await _recording.startAsync();
        } catch (error) {
            console.log('Error starting recording: ', error);
            stopRecording();
        }
        console.log('should be a recording uri: ', _recording._uri)
    }

//////////////////////////////////////////////////////////////////////////////////////
// Stop Recording ////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function stopRecording(){
        console.log('=stopping recording=')
        isRecording = false
        try {
            await _recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: false })
        } catch (error) {
            console.log(error);
        }

        if (_recording) {
            localUri = _recording.getURI();
            durationMillis = _recording.durationMillis
            _recording.setOnRecordingStatusUpdate(null);
        }
    }

//////////////////////////////////////////////////////////////////////////////////////
// Speak / Play Recording ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function loadAndPlayRecording(){
        audioItem = await _recording.createNewLoadedSoundAsync()
        await audioItem.sound.playAsync()
    }

    function speak(minutes) {
        var thingToSay = `Bus 8 will be here in ${minutes} minutes.`;
        Speech.speak(thingToSay);
        console.log('speaking...=========')
    }

//////////////////////////////////////////////////////////////////////////////////////
// Delete Recording //////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    async function resetRecording(){
        await deleteRecordingFile();
        _recording = null;
    }
    
    async function deleteRecordingFile(){
        console.log("=Deleting file=");
        try {
            const info = await FileSystem.getInfoAsync(_recording.getURI());
            console.log('=Find Local File= ', info)
            await FileSystem.deleteAsync(info.uri)
            const temp = await FileSystem.getInfoAsync(_recording.getURI());
            console.log('=File is now deleted= ', temp)
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
})

