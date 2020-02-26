import React from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";

export default function BusMap(props) {
    return (
        <View style={styles.container}>
            <View>
                <MapView
                    style={styles.mapStyle}
                    customMapStyle={customizedMap}
                    initialRegion={{
                        // latitude: props.lat,
                        // longitude: props.long,
                        latitude: props.closest.closestLat,
                        longitude: props.closest.closestLon,
                        latitudeDelta: 0.022,
                        longitudeDelta: 0.00421
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: props.closest.closestLat,
                            longitude: props.closest.closestLon
                        }}
                        title={props.closest.closestName}
                        description={`Direction: ${props.closest.closestDirection}`}
                    />
                    <Marker
                        coordinate={{
                            latitude: props.nextClosest.nextClosestLat,
                            longitude: props.nextClosest.nextClosestLon
                        }}
                        title={props.nextClosest.nextClosestName}
                        description={`Direction: ${props.nextClosest.nextClosestDirection}`}
                    />
                </MapView>
            </View>

            {/* <Callout>
                <View style={styles.calloutView} >
                    <TextInput style={styles.calloutSearch}
                        placeholder={"Search"}
                    />
                </View>
            </Callout> */}
            {/* aj: this allows us to add components to the map, leaving here for reference */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "center"
    },
    mapStyle: {
        width: Dimensions.get("window").width * 0.9,
        height: Dimensions.get("window").height * 0.6,
        borderRadius: 90
    },
});

const customizedMap = [
    {
        elementType: "geometry",
        stylers: [
            {
                color: "#1d2c4d"
            }
        ]
    },
    {
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#8ec3b9"
            }
        ]
    },
    {
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#1a3646"
            }
        ]
    },
    {
        featureType: "administrative.country",
        elementType: "geometry.stroke",
        stylers: [
            {
                color: "#4b6878"
            }
        ]
    },
    {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#64779e"
            }
        ]
    },
    {
        featureType: "administrative.province",
        elementType: "geometry.stroke",
        stylers: [
            {
                color: "#4b6878"
            }
        ]
    },
    {
        featureType: "landscape.man_made",
        elementType: "geometry.stroke",
        stylers: [
            {
                color: "#334e87"
            }
        ]
    },
    {
        featureType: "landscape.natural",
        elementType: "geometry",
        stylers: [
            {
                color: "#023e58"
            }
        ]
    },
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
            {
                color: "#283d6a"
            }
        ]
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#6f9ba5"
            }
        ]
    },
    {
        featureType: "poi",
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#1d2c4d"
            }
        ]
    },
    {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#023e58"
            }
        ]
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#3C7680"
            }
        ]
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [
            {
                color: "#304a7d"
            }
        ]
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#98a5be"
            }
        ]
    },
    {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#1d2c4d"
            }
        ]
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
            {
                color: "#2c6675"
            }
        ]
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
            {
                color: "#255763"
            }
        ]
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#b0d5ce"
            }
        ]
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#023e58"
            }
        ]
    },
    {
        featureType: "transit",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#98a5be"
            }
        ]
    },
    {
        featureType: "transit",
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#1d2c4d"
            }
        ]
    },
    {
        featureType: "transit.line",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#283d6a"
            }
        ]
    },
    {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [
            {
                color: "#3a4762"
            }
        ]
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            {
                color: "#0e1626"
            }
        ]
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#4e6d70"
            }
        ]
    }
];
