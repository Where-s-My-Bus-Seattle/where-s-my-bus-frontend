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
        
    };

    const [mapDisplay, setMapDisplay] = React.useState(false);
    
    const [busData, updateBusData] = React.useState(busState);
    const [isFetching, toggleIsFetching] = React.useState(false)



    







    let homeButton;
    let button;
    let busmap;
    let results;




}
