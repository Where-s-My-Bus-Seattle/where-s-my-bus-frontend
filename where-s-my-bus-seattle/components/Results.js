import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default class Results extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <View style={styles.resultsContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>
                            Your Route Number is:
                        </Text >
                        <Text style={styles.routeNum}>{this.props.busNumber}</Text>
                    </View>
                    <View>
                        <Text style={styles.data}>
                            To
                            <Text style={{color:'#29c7ac'}}> {this.props.closest.closestDestination} </Text>
                            will come to {this.props.closest.closestName}  in
                            <Text style={{color:'#29c7ac'}}> {this.props.closest.closestMinutes} min</Text>
                        </Text>
                        <Text style={styles.data}>
                            To
                            <Text style={{color:'#29c7ac'}}> {this.props.nextClosest.nextClosestDestination} </Text>
                            will come to {this.props.nextClosest.nextClosestName}  in
                            <Text style={{color:'#29c7ac'}}> {this.props.nextClosest.nextClosestMinutes} min</Text>
                        </Text>
                    </View>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    resultsContainer: {
        height: "30%",
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: "center",
        marginTop: "5%"
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
    data: {
        color: "#f7f5f5",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: 'center'
    }
});
