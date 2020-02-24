import React, { Component, Fragment } from "react";
import {
    TextInput,
    Text,
    Button,
    ShadowPropTypesIOS,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
    KeyboardAvoidingView,
    TouchableHighlight
} from "react-native";
import BusMap from "./BusMap.js";
import Results from "./Results.js";
import TextCarousel from "react-native-text-carousel";
import Ripple from "react-native-material-ripple";
import * as Speech from 'expo-speech';



const { width } = Dimensions.get("screen");

export default function BusForm(props) {

    const busState = {
        closestData: {
            closestName: null,
            closestDirection: null,
            closestMinutes: null,
            closestLat: null,
            closestLon: null
        },
        nextClosestData: {
            nextClosestName: null,
            nextClosestDirection: null,
            nextClosestMinutes: null,
            nextClosestLat: null,
            nextClosestLon: null
        },
        serverBusRoute: ""
    };

    const [mapDisplay, setMapDisplay] = React.useState(false);
    const [busRoute, updateBusRoute] = React.useState("");
    const [busData, updateBusData] = React.useState(busState);
    const [isFetching, toggleIsFetching] = React.useState(false)

    async function submitHandler() {
        let url = `http://138.68.251.254:8000/api/v1/${props.lat}/${props.long}/${busRoute}`;
        console.log(url);

        const response = await fetch(url);
        const data = await response.json();



        console.log(data)

        // updateBusRoute("")
        updateBusData({
            closestData: {
                closestName: data.closest_stop.closest_name,
                closestDirection: data.closest_stop.closest_direction,
                closestMinutes: data.closest_stop.closest_minutes,
                closestLat: data.closest_stop.closest_lat,
                closestLon: data.closest_stop.closest_lon
            },

            nextClosestData: {
                nextClosestName: data.next_closest_stop.next_closest_name,
                nextClosestDirection:
                    data.next_closest_stop.next_closest_direction,
                nextClosestMinutes: data.next_closest_stop.next_closest_minutes,
                nextClosestLat: data.next_closest_stop.next_closest_lat,
                nextClosestLon: data.next_closest_stop.next_closest_lon
            },
            serverBusRoute: data.route

        });
        setMapDisplay(true);
    }
    // console.log(busData);

    function returnHome() {
        setMapDisplay(false);
    }

    function speak(minutes) {
        var thingToSay = `Bus 8 will be here in ${minutes} minutes.`;
        Speech.speak(thingToSay);
        console.log('speaking...=========')
    }

    async function getTranscription() {
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

    async function newHandlePressOut() {
        console.log('pressed out')
        await props.stopRecording()
        await getTranscription()
    }



    let homeButton;
    let button;
    let busmap;
    let results;

    if (mapDisplay) {
        results = (
            <Results
                busNumber={busData.serverBusRoute}
                closest={busData.closestData}
                nextClosest={busData.nextClosestData}
            />
        );
        busmap = (
            <View style={styles.center2}>
                <BusMap
                    lat={props.lat}
                    long={props.long}
                    closest={busData.closestData}
                    nextClosest={busData.nextClosestData}
                />
            </View>
        );
        {
        }
        button = <></>;
        homeButton = (
            <View style={styles.bottom2}>
                <TouchableOpacity onPress={() => returnHome()}>
                    <Image source={require("./button_another.png")} />
                </TouchableOpacity>
            </View>
        );
    } else {
        busmap = <></>;
        button = (
            <Fragment>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="position">
                    <View style={styles.top}>
                        <View>
                            <Text style={styles.header}>Where's My Bus?</Text>
                        </View>
                    </View>

                    <View style={styles.center}>
                        <TextCarousel>
                            <TextCarousel.Item>
                                <View style={styles.carouselContainer}>
                                    <Text style={styles.opacityText}>
                                        Tap to speak
                                    </Text>
                                </View>
                            </TextCarousel.Item>
                            <TextCarousel.Item>
                                <View style={styles.carouselContainer}>
                                    <Text style={styles.opacityText}>
                                        When does "8" get here?
                                    </Text>
                                </View>
                            </TextCarousel.Item>
                        </TextCarousel>
                        <Ripple
                            rippleColor="rgb(52, 61, 235)"
                            rippleDuration="2400"
                            // rippleContainerBorderRadius="100" //aj commented this out
                            rippleCentered="true"
                            style={styles.submitButton}
                            // onPress={() => submitHandler()}
                            onPressIn={() => props.handleOnPressIn()}
                            onPressOut={() => newHandlePressOut()}
                        >
                            <Image
                                style={styles.submitButton}
                                source={require("./button.png")}
                            />
                        </Ripple>
                    </View>
                    <View style={styles.bottom}>
                        <Text style={styles.opacityText2}>
                            Or type your bus number and tap
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => updateBusRoute(text)}
                            value={busRoute}
                        />
                        <TouchableHighlight onPress={() => submitHandler()}>
                            <Image
                                style={styles.submitButton2}
                                source={require("./button_search.png")}
                            />
                        </TouchableHighlight>
                    </View>
                </KeyboardAvoidingView>
            </Fragment>
        );
    }

    return (
        <View style={styles.container}>
            {button}
            {results}
            {busmap}
            {homeButton}
        </View>
    );
}
const styles = StyleSheet.create({
    opacityText2: {
        opacity: 0.2,
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
        margin: 50,
        marginBottom: 25,
        justifyContent: "space-between", //Centered vertically
        alignItems: "center"
    },
    opacityText: {
        opacity: 0.2,
        color: "white",
        fontWeight: "bold",
        fontSize: 20
    },

    carouselContainer: {
        margin: 0,
        justifyContent: "center", //Centered vertically
        alignItems: "center",
        paddingBottom: 0
    },
    top: {
        height: "25%",
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        color: "#f7f5f5",
        fontWeight: "bold",
        fontSize: 47
    },

    center: {
        height: "35%",
        alignItems: "center",
        justifyContent: "center"
    },
    center2: {
        height: "50%",
        alignItems: "center",
        justifyContent: "center"
    },
    bottom: {
        height: "35%", // aj changed this
        alignItems: "center",
        justifyContent: "center"
    },
    bottom2: {
        height: "25%", // aj changed this
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        backgroundColor: "#54123B",
        ...StyleSheet.absoluteFillObject
    },

    input: {
        width: width / 2,
        height: 40,
        borderColor: "#29c7ac",
        borderWidth: 3,
        backgroundColor: "#f7f5f5",
        textAlign: "center" //aj changed this
    },
    submitButton: {
        alignItems: "center",
        padding: 10,
        width: width / 1.5,
        height: width / 1.5
    },
    submitButton2: {
        alignItems: "center",
        margin: 3,
        width: width / 3,
        height: width / 10
    },
    submitButton3: {
        alignItems: "center",
        margin: 10,
        width: width / 3,
        height: width / 10
    }
});
// when button Submit clicked > call event handler, that will make an API call to back end
// if call was successsful render Details component
// else render error message on the page

// export default BusForm;
