import React from "react";

import { ScrollView, Dimensions, Text, View, StyleSheet } from "react-native";
import HTML from "react-native-render-html";
import { AuthSession } from "expo";

// export default class Results extends React.Component {
//     render() {
//         return (
//             <ScrollView style={{ flex: 1 }}>
//                 <HTML html={htmlContent} imagesMaxWidth={Dimensions.get('window').width} />
//             </ScrollView>
//         );
//     }
// }
export default class Results extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // const htmlContent = `
        // <h2>Route Number: ${this.props.busNumber}</h2>
        // <h3>Bus will come to the ${this.props.closest.closestName} [${this.props.closest.closestDirection} direction] bus stop in ${this.props.closest.closestMinutes} minutes</h3>
        // <h3>Bus will come to the ${this.props.nextClosest.nextClosestName} [${this.props.nextClosest.nextClosestDirection} direction] bus stop in ${this.props.nextClosest.nextClosestMinutes} minutes</h3>
        // `;

        return (
            <>
                <View style={styles.top}>

                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>
                            Your Route Number is:
                        </Text >
                        <Text style={styles.routeNum}>{this.props.busNumber}</Text>
                    </View>
                    <View style={styles.dataContainer}>
                        <Text style={styles.data}>
                            Bus ({this.props.closest.closestDirection} direction) will come to the {this.props.closest.closestName}  in
                            <Text style={{color:'#29c7ac'}}> {this.props.closest.closestMinutes} min</Text>
                    </Text>
                        <Text style={styles.data}>
                            Bus ({this.props.nextClosest.nextClosestDirection} direction) will come to the {this.props.nextClosest.nextClosestName} in
                            <Text style={{color:'#29c7ac'}}> {this.props.nextClosest.nextClosestMinutes} min</Text>
                            </Text>
                    </View>

                    {/* <BusMap lat={props.lat} long={props.long} closest={this.props.closest} nextClosest={this.props.nextClosest}/> */}
                </View>
            </>
        );
    }
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
        height: "30%",
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 20
    },

    header: {
        color: "#f7f5f5",
        fontWeight: "bold",
        fontSize: 20,
        paddingBottom: 10
    },
    routeNum: {
        color: "#29c7ac",
        fontWeight: "bold",
        fontSize: 24,
        paddingLeft: 10,
        paddingBottom: 10
    },
    headerContainer: {
        flexDirection: "row",
        paddingTop:20
    },

    dataContainer:{
        alignItems:"center",
        paddingBottom: 20
    },

    data: {
        color: "#f7f5f5",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: 'center'
    },

    center: {
        height: "35%",
        alignItems: "center",
        justifyContent: "center"
    },

    bottom: {
        height: "25%",
        alignItems: "center",
        justifyContent: "center"
    },

    container: {
        flex: 1,

        backgroundColor: "#54123B",
        ...StyleSheet.absoluteFillObject
    }
});
