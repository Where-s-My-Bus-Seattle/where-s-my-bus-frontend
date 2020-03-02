import React from "react";
import {
    View,
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
        let url = `http://138.68.251.254:8000/api/v1/${props.lat}/${props.long}/${busRoute}`;
        console.log('\n');
        console.log('=Form Request to Server=');
        console.log(url);

        const response = await fetch(url);
        const data = await response.json();

        console.log('\n')
        console.log('=response from the server=');
        console.log(data);

        props.doneHandler(data);
        props.hideHandler();
    }

    return (
        <>
            <View style={styles.inputFieldContainer}>
                <TextInput
                    style={styles.inputField}
                    onChangeText={text => updateBusRoute(text)}
                    value={busRoute}
                />
                <TouchableHighlight onPress={() => submitHandler()}>
                    <Image
                        source={require("./button_search.png")}
                    />
                </TouchableHighlight>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    inputFieldContainer: {
        alignItems: "center",
        marginTop: "8%"
    },
    inputField: {
        width: width / 2,
        height: 40,
        borderColor: "#29c7ac",
        borderWidth: 3,
        backgroundColor: "#f7f5f5",
        textAlign: "center",
        marginBottom: "4%"      
    },
})