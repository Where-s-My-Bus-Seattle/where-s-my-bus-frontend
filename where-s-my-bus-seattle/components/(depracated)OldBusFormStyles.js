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
    submitButton: {
        alignItems: "center",
        padding: 10,
        width: width / 1.5,
        height: width / 1.5
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


    submitButton: {
        alignItems: "center",
        padding: 10,
        width: width / 1.5,
        height: width / 1.5
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
