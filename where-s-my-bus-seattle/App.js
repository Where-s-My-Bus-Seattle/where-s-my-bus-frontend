import React from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import BusForm from "./components/BusForm";
import { Audio } from 'expo-av';

// https://fostermade.co/blog/making-speech-to-text-work-with-react-native-and-expo
// Guide used to help with recording

const recordingOptions = {
    // android not currently in use, but parameters are required
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

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        location: null,
        lat: 47.6062,
        long: -122.3321,
        errorMessage: null,
        busCoords: [],
        isRecording: false,
        isFetching: false,
        _recording: null,
        query: null,
        test: 4
    };

    componentDidMount() {
        this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
            this.setState({
                errorMessage: "Permission to access location was denied"
            });
        }

        let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
        

        this.setState({ location });
        this.setState({ lat: location.coords.latitude });
        this.setState({ long: location.coords.longitude });
    };
    handleOnPressIn = async () => {
        console.log('pressed in')
        await this.startRecording();
    }

    handleOnPressOut = async () => {
        console.log('pressed out')
        // await this.stopRecording();
        // await this.getTranscription();
    }

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



    returnHome() {
        this.setState({
            mapDisplay: false,
        })
    }

    render() {
        let location = "Waiting..";
        if (this.state.errorMessage) {
            location = this.state.errorMessage;
        } else if (this.state.location) {
            location = JSON.stringify(this.state.location);
        }

        return (
            <View style={styles.container}>
                <BusForm
                    lat={this.state.lat}
                    long={this.state.long}
                    busCoords={this.state.busCoords}
                    handleOnPressIn={this.handleOnPressIn}
                    handleOnPressOut={this.handleOnPressOut}
                    stopRecording={this.stopRecording}
                    resetRecording={this.resetRecording}
                    recording={this.state._recording}

                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#ecf0f1"
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: "center"
    }
});

console.disableYellowBox = true;


