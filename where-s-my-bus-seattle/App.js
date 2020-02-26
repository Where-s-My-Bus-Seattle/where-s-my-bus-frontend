import React, { Component, Fragment } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text, KeyboardAvoidingView, Dimensions, } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
// import BusForm from "./components/BusForm";
import InputField from "./components/inputField";
import BusMap from "./components/BusMap";
import Results from "./components/Results";
import VoiceInput from "./components/voiceInput";
import TextCarousel from "react-native-text-carousel";
// import { Audio } from 'expo-av';

// https://fostermade.co/blog/making-speech-to-text-work-with-react-native-and-expo
// Guide used to help with recording

// const [mapDisplay, setMapDisplay] = React.useState(false);

let homeButton;
let button;
let busmap;
let results;
let textInput;
let heading;
let bottomString;

export default class App extends React.Component {
    // APP is concerned with
    // 1. State
    // 2. User Location
    // 3. Renders

    constructor(props) {
        super(props);
        this.state = {
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
            serverBusRoute: "",
            location: null,
            lat: 47.6062,
            long: -122.3321,
            errorMessage: null,
            busCoords: [],
    
            query: null,
            test: 4,
            displayMap: false,
        };
        this.handleInputField = this.handleInputField.bind(this)

        
    }

    

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
    
    handleInputField(data){
        console.log('inside app.js; the data: ', data)
        this.setState({
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
            serverBusRoute: data.route,
            displayMap: true,
        })
        console.log('state: ', this.state)
    }

    

    render() {
        if (this.state.errorMessage) {
            location = this.state.errorMessage;
        } else if (this.state.location) {
            location = JSON.stringify(this.state.location);
        }

        if (this.state.displayMap) {
            busmap = (
                <BusMap
                    lat={this.state.lat}
                    long={this.state.long}
                    closest={this.state.closestData}
                    nextClosest={this.state.nextClosestData}
                />
            );
            homeButton = (
                <TouchableOpacity style={styles.homeButton} onPress={() => this.setState({displayMap: false})}>
                    <Image source={require("./components/button_another.png")} />
                </TouchableOpacity>
            );
            results = (
                <Results
                busNumber={this.state.serverBusRoute}
                closest={this.state.closestData}
                nextClosest={this.state.nextClosestData}
                />
            );
            textInput = (<></>)
            button = (<></>)
            bottomString = (<></>)
            textCarousel = (<></>)
            heading = (<></>)
        } else {
            textInput = (
                <InputField doneHandler={this.handleInputField}/>
            );
            homeButton = (<></>)
            busmap = (<></>)
            results = (<></>)
            textCarousel = (
                <View style={styles.textCarousel}>
                    <TextCarousel>
                        <TextCarousel.Item>
                            <Text style={styles.opacityText}>
                                Tap to speak
                            </Text>
                        </TextCarousel.Item>
                        <TextCarousel.Item>
                            <Text style={styles.opacityText}>
                                When does "8" get here?
                            </Text>
                        </TextCarousel.Item>
                    </TextCarousel>
                </View>
            );
            heading = (
                <Text style={styles.appTitleHeader}>Where's My Bus?</Text>
            )
            button = (
                <VoiceInput doneHandler={this.handleInputField}/>
            );
            bottomString = (
                <Text style={styles.opacityText}>
                    Or type your bus number and tap
                </Text>
            )
        }

        return (
            <KeyboardAvoidingView style={styles.mainViewContainer} behavior="position">
                {heading}
                {textCarousel}
                {button}
                {bottomString}
                {textInput}
                {results}
                {busmap}
                {homeButton}
            </KeyboardAvoidingView>  
        );
    }
}

const styles = StyleSheet.create({
    mainViewContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#54123B",
    },
    textCarousel: {
        height:8,
        marginTop: "10%",
    },
    opacityText: {
        opacity: 0.2,
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
        alignSelf: "center"
    },
    homeButton: {
        height: "25%",
        alignItems: "center",
        justifyContent: "center",
    },
    appTitleHeader: {
        color: "#f7f5f5",
        fontWeight: "bold",
        fontSize: 47,
        alignSelf: "center",
        marginTop: "5%"
    },
});

console.disableYellowBox = true;


