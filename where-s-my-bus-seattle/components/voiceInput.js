import React, { Component, Fragment } from "react";
import { View, StyleSheet, Dimensions, Image, FileSystem } from "react-native";
import * as Speech from 'expo-speech';
import * as Permissions from "expo-permissions";
import { Audio } from 'expo-av';
import Ripple from "react-native-material-ripple";

const { width } = Dimensions.get("screen");

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

export default class VoiceInput extends React.Component {
    constructor(props) {
        super(props);
        this.lat = props.lat
        this.long = props.long
        this.doneHandler = props.doneHandler
    }

    state = {
        isRecording: false,
        isFetching: false,
        _recording: null,
    };

    getTranscription = async () => {
        this.setState({ isFetching: true })
        // toggleIsFetching(true)
        try {
            const uri = this.state._recording.getURI();
            let wav = new FormData();
            wav.append('file', {
                uri: uri,
                name: `test.wav`,
                type: `audio/wav`,
              });
            console.log('=WAV being sent=');
            console.log(wav._parts[0][1]);
            console.log('lat/lon: ', this.lat, this.long)
            const response = await fetch(`http://138.68.251.254:8000/api/v1/${this.lat}/${this.long}`, {
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
            this.doneHandler(busData)

            this.speak(busData.closest_stop.closest_minutes)
        } catch (error) {
            console.log('There was an error', error);
            this.stopRecording();
            this.resetRecording();
        }
        // toggleIsFetching(false)
        this.setState({ isFetching: false })
    }

    handleOnPressIn = async () => {
        console.log('=pressed in=')
        await this.startRecording();
    }

    handleOnPressOut = async () => {
        console.log('=pressed out=')
        await this.stopRecording();
        await this.getTranscription();
    }

    startRecording = async () => {
        console.log('=starting recording=')
        const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        if (status !== 'granted') return;
        this.setState({ isRecording: true, _recording: new Audio.Recording() })

        // some of these are not applicable, but are required
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: true,

        });

        try {
            await this.state._recording.prepareToRecordAsync(recordingOptions);
            await this.state._recording.startAsync();
        } catch (error) {
            console.log(error);
            this.stopRecording();
        }
        console.log('should be a recording uri: ', this.state._recording._uri)
    }

    stopRecording = async () => {
        console.log('=stopping recording=')
        this.setState({ isRecording: false })
        await this.state._recording.stopAndUnloadAsync();

    }

    deleteRecordingFile = async () => {
        console.log("Deleting file");
        try {
            const info = await FileSystem.getInfoAsync(this.state._recording.getURI());
            await FileSystem.deleteAsync(info.uri)
        } catch (error) {
            console.log("There was an error deleting recording file", error);
        }
    }

    resetRecording = async () => {
        await this.deleteRecordingFile();
        this.state._recording = null;
    }

    speak(minutes) {
        var thingToSay = `Bus 8 will be here in ${minutes} minutes.`;
        Speech.speak(thingToSay);
        console.log('speaking...=========')
    }

    render() {
        return ( 
            <Ripple
                rippleColor="rgb(52, 61, 235)"
                rippleDuration="2400"
                rippleCentered="true"
                onPressIn={() => this.handleOnPressIn()}
                onPressOut={() => this.handleOnPressOut()}
            >
                <Image
                    style={styles.voiceSubmitButton}
                    source={require("./button.png")}
                />
            </Ripple>
        )
    }
}
const styles = StyleSheet.create({
    voiceSubmitButton: {
        width: width / 1.5,
        height: width / 1.5,
        alignSelf: "center",
        margin: "8%"
    },
})
