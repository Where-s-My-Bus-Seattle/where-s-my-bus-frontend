import React, { Component, Fragment } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import * as Speech from 'expo-speech';
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
    }

    state = {
        isRecording: false,
        isFetching: false,
        _recording: null,
    };

    getTranscription = async () => {
        // this.setState({ isFetching: true })
        toggleIsFetching(true)
        try {
            const uri = props.recording.getURI();
            console.log('here is the uri: ', uri);
            let wav = new FormData();
            wav.append('file', {
                uri: uri,
                name: `test.wav`,
                type: `audio/wav`,
              });
            console.log('WAV', wav);
            const response = await fetch(`http://138.68.251.254:8000/api/v1/${props.lat}/${props.long}`, {
                method: 'POST',
                body: wav,

            })
            const json = await response.json();
            updateBusData({
                closestData: {
                    closestName: json.closest_stop.closest_name,
                    closestDirection: json.closest_stop.closest_direction,
                    closestMinutes: json.closest_stop.closest_minutes,
                    closestLat: json.closest_stop.closest_lat,
                    closestLon: json.closest_stop.closest_lon
                },
                nextClosestData: {
                    nextClosestName: json.next_closest_stop.next_closest_name,
                    nextClosestDirection:json.next_closest_stop.next_closest_direction,
                    nextClosestMinutes: json.next_closest_stop.next_closest_minutes,
                    nextClosestLat: json.next_closest_stop.next_closest_lat,
                    nextClosestLon: json.next_closest_stop.next_closest_lon
                },
                serverBusRoute: json.route

            });

            setMapDisplay(true);
            console.log('closest data: ', busData.closestData)
            console.log('nextClosest data: ', busData.nextClosestData)
            console.log('bus data number', busData.closestData.closestMinutes)
            speak(busData.closestData.closestMinutes)
        } catch (error) {
            console.log('There was an error', error);
            props.stopRecording();
            props.resetRecording();
        }
        toggleIsFetching(false)
        // this.setState({ isFetching: false })
    }

    // handleOnPressIn = async () => {
    // //     console.log('pressed in')
    // //     await this.startRecording();
    // // }

    // // handleOnPressOut = async () => {
    // //     console.log('pressed out')
    // //     await this.stopRecording();
    // //     await this.getTranscription();
    // // }

    startRecording = async () => {
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
        console.log('should be an object: ', this.state._recording)
    }

    stopRecording = async () => {
        console.log('in the func')
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

    resetRecording() {
        this.deleteRecordingFile();
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
                onPress={() => this.props.doneHandler(
                    {
                        closest_stop: {
                            closest_name: "47",
                            closest_direction: "47",
                            closest_minutes: "47",
                            closest_lat: 47.6,
                            closest_lon: -122.2,
                        },        
                        next_closest_stop: {
                            next_closest_name: "47",
                            next_closest_direction:
                                "47",
                            next_closest_minutes: "47",
                            next_closest_lat: 47.61,
                            next_closest_lon: -122.21,
                        },
                        route: "47",
                    }
                )}
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
        width: width / 1.3,
        height: width / 1.3,
        alignSelf: "center",
        margin: "10%"
    },
})