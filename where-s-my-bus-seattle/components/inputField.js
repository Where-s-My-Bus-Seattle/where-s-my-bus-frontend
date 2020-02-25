import { render } from "react-dom";
import React from "react";
import {
    Image,
    TextInput,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
} from "react-native";

const { width } = Dimensions.get("screen");


export default function InputField(props) {

    const [busRoute, updateBusRoute] = React.useState("");

    async function submitHandler() {
        let url = `http://138.68.251.254:8000/api/v1/47.6183684/-122.3517913/D`;
        console.log(url);

        const response = await fetch(url);
        const data = await response.json();

        console.log(data)
        props.doneHandler(data);

        // TODO: this goes to APP.JS

        // updateBusRoute("")
        // updateBusData({
        //     closestData: {
        //         closestName: data.closest_stop.closest_name,
        //         closestDirection: data.closest_stop.closest_direction,
        //         closestMinutes: data.closest_stop.closest_minutes,
        //         closestLat: data.closest_stop.closest_lat,
        //         closestLon: data.closest_stop.closest_lon
        //     },

        //     nextClosestData: {
        //         nextClosestName: data.next_closest_stop.next_closest_name,
        //         nextClosestDirection:
        //             data.next_closest_stop.next_closest_direction,
        //         nextClosestMinutes: data.next_closest_stop.next_closest_minutes,
        //         nextClosestLat: data.next_closest_stop.next_closest_lat,
        //         nextClosestLon: data.next_closest_stop.next_closest_lon
        //     },
        //     serverBusRoute: data.route

        // });
    }
    

    function returnHome() {
        setMapDisplay(false);
    }

    return (
        <>
        <TextInput
            style={styles.input}
            onChangeText={text => updateBusRoute(text)}
            value={busRoute}
        />
        <TouchableHighlight onPress={() => submitHandler()}>
            <Image
                // style={styles.submitButton2}
                source={require("./button_search.png")}
            />
        </TouchableHighlight>
        </>
    )
}
const styles = StyleSheet.create({
    input: {
        width: width / 2,
        height: 40,
        borderColor: "#29c7ac",
        borderWidth: 3,
        backgroundColor: "#f7f5f5",
        textAlign: "center" //aj changed this
    },
    submitButton2: {
        alignItems: "center",
        margin: 3,
        width: width / 3,
        height: width / 10
    },
})