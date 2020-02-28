import React, { Component, Fragment } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text, KeyboardAvoidingView, Dimensions, } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import InputField from "./components/inputField";
import BusMap from "./components/BusMap";
import Results from "./components/Results";
import VoiceInput from "./components/voiceInput";
import TextCarousel from "react-native-text-carousel";


// https://fostermade.co/blog/making-speech-to-text-work-with-react-native-and-expo
// Guide used to help with recording

console.disableYellowBox = true;

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
            lat: null,
            long: null,
            errorMessage: null,
            displayMap: false,
            displayButton: true,
        };
        this.handleInputField = this.handleInputField.bind(this)
        this.hideButtonDisplay = this.hideButtonDisplay.bind(this)
    }

//////////////////////////////////////////////////////////////////////////////////////
// Get User's Location ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
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
        console.log('============GOT LOCATION=================')
    };

//////////////////////////////////////////////////////////////////////////////////////
// "Done" Handler ( Input / Voice ) ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    hideButtonDisplay(){
        this.setState({ displayButton: false })
    }

    handleInputField(data){
        if (data.status === 'bad'){
            this.setState({errorMessage: data.error, displayButton: true})
            return
        }

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
            errorMessage: null,
            displayMap: true,
        })
    }

//////////////////////////////////////////////////////////////////////////////////////
// Rendering /////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    render() {
        // if there is an error message, show it.
        if (this.state.errorMessage){
            bottomString = (
                <Text style={styles.errorText}>
                    {this.state.errorMessage}
                </Text>
            )
        } else {
            bottomString = (
                <Text style={styles.opacityText}>
                    Or type your bus number and tap
                </Text>
            ) 
        }

        // When we have user's location, show the button
        if (this.state.lat && this.state.long){
            button = (
                <VoiceInput doneHandler={this.handleInputField} hideHandler={this.hideButtonDisplay} displayButton={this.state.displayButton} lat={this.state.lat} long={this.state.long}/>
            );
            console.log('this.state.displayButton: ', this.state.displayButton)
        } else {
            button = (<></>);
        }

        // define components to render based on if we are showing a map or not
        if (this.state.displayMap) {
            busmap = (
                <BusMap
                    closest={this.state.closestData}
                    nextClosest={this.state.nextClosestData}
                />
            );
            homeButton = (
                <TouchableOpacity style={styles.homeButton} onPress={() => this.setState({displayMap: false, displayButton: true})}>
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
            bottomString = (<></>)
            textCarousel = (<></>)
            heading = (<></>)

        } else {
            textInput = (
                <InputField doneHandler={this.handleInputField} hideHandler={this.hideButtonDisplay} lat={this.state.lat} long={this.state.long}/>
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
        }

        // Return the view
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

//////////////////////////////////////////////////////////////////////////////////////
// Styling ///////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
let homeButton;
let button;
let busmap;
let results;
let textInput;
let heading;
let bottomString;

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
    errorText: {
        color: "red",
        fontSize: 30,
        fontWeight: "bold",
        alignSelf: "center"
    },
});



