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
                <View style={styles.center2}>
                    <BusMap
                        lat={this.state.lat}
                        long={this.state.long}
                        closest={this.state.closestData}
                        nextClosest={this.state.nextClosestData}
                    />
                </View>
            );
            textInput = (<></>)
            homeButton = (
                <View style={styles.bottom2}>
                    <TouchableOpacity onPress={() => this.setState({displayMap: false})}>
                        <Image source={require("./components/button_another.png")} />
                    </TouchableOpacity>
                </View>
            );
            results = (
                <Results
                    busNumber={this.state.serverBusRoute}
                    closest={this.state.closestData}
                    nextClosest={this.state.nextClosestData}
                />
            );
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
            );
            heading = (
                <View style={styles.top}>
                    <View>
                        <Text style={styles.header}>Where's My Bus?</Text>
                    </View>
                </View>
            )
            button = (
                <VoiceInput doneHandler={this.handleInputField}/>
            );
            bottomString = (
                <Text style={styles.opacityText2}>
                    Or type your bus number and tap
                </Text>
            )
                        
    
            //             <View style={styles.bottom}>
            //                 
            //                 <TextInput
            //                     style={styles.input}
            //                     onChangeText={text => updateBusRoute(text)}
            //                     value={busRoute}
            //                 />
            //                 <TouchableHighlight onPress={() => submitHandler()}>
            //                     <Image
            //                         style={styles.submitButton2}
            //                         source={require("./button_search.png")}
            //                     />
            //                 </TouchableHighlight>
            //             </View>
            //         </KeyboardAvoidingView>
            //     </Fragment>
            // );
        }

        //             results = (
        //                 <Results
        //                     busNumber={busData.serverBusRoute}
        //                     closest={busData.closestData}
        //                     nextClosest={busData.nextClosestData}
        //                 />
        //             );
                    // busmap = (
                    //     <View style={styles.center2}>
                    //         <BusMap
                    //             lat={props.lat}
                    //             long={props.long}
                    //             closest={busData.closestData}
                    //             nextClosest={busData.nextClosestData}
                    //         />
                    //     </View>
                    // );
        //         }
        //             {
        //             }
        //             button = <></>;
        //             homeButton = (
        //                 <View style={styles.bottom2}>
        //                     <TouchableOpacity onPress={() => returnHome()}>
        //                         <Image source={require("./button_another.png")} />
        //                     </TouchableOpacity>
        //                 </View>
        //             );
        //         } else {
        //             busmap = <></>;
        //             button = 
        //         }

        // return (
        //     <View style={styles.container}>
        //         {button}
        //         {results}
        //         {busmap}
        //         {homeButton}
        //     </View>
        // );
        return (
            <Fragment>
                    <KeyboardAvoidingView style={styles.container} behavior="position">
                        <View>
                            {heading}
                            {textCarousel}
                            {button}
                            {bottomString}
                            {textInput}
                            {results}
                            {busmap}
                            {homeButton}
                        </View>
                    </KeyboardAvoidingView>
            </Fragment>
            
        );
    }
}
const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#54123B"
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: "center"
    },
    center2: {
        height: "50%",
        alignItems: "center",
        justifyContent: "center"
    },
    bottom2: {
        height: "25%",
        alignItems: "center",
        justifyContent: "center"
    },
    opacityText: {
        opacity: 0.2,
        color: "white",
        fontWeight: "bold",
        fontSize: 20
    },
    carouselContainer: {
        margin: 0,
        justifyContent: "center",
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
    submitButton: {
        alignItems: "center",
        padding: 10,
        width: width / 1.5,
        height: width / 1.5
    },
});

console.disableYellowBox = true;


