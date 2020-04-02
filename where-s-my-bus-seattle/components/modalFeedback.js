import React, {Component} from "react";
import {Modal, Text, TouchableHighlight, View, Alert, Image, StyleSheet, Dimensions} from 'react-native';
import Constants from "expo-constants";

import Toggle from "./toggle"
import { Colors } from "react-native/Libraries/NewAppScreen";


export default class ModalFeedback extends Component {
  state = {
    modalVisible: false,
    question1Visible: false,
    question2Visible: false,
    question3Visible: false,
    question4Visible: false,
    question5Visible: false,
    question6Visible: false,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setQuestionVisible(question){
    if (question == 1){this.setState({question1Visible: !this.state.question1Visible});}
    if (question == 2){this.setState({question2Visible: !this.state.question2Visible});}
    if (question == 3){this.setState({question3Visible: !this.state.question3Visible});}
    if (question == 4){this.setState({question4Visible: !this.state.question4Visible});}
    if (question == 5){this.setState({question5Visible: !this.state.question5Visible});}
    if (question == 6){this.setState({question6Visible: !this.state.question6Visible});}     
  }

  render() {
    let answer1 = (<></>);
    let answer2 = (<></>);
    let answer3 = (<></>);
    let answer4 = (<></>);
    let answer5 = (<></>);
    let answer6 = (<></>);

    if(this.state.question1Visible){answer1 = (<Text style={styles.answer}>Yes - "Where's My Bus?" is free.</Text>)}
    if(this.state.question2Visible){answer2 = (<><Text style={styles.answer}>Currently our app covers the Greater Puget Sound area.</Text><Text style={styles.answer}>Serving: King County Metro, Community Transit, Pierce Transit, Everett Transit, Intercity Transit, Washington State Ferries, Sounder Train service</Text></>)};
    if(this.state.question3Visible){answer3 = (<Text style={styles.answer}>No - "Where's My Bus?" is currently designed for commuters who know the bus they need, they only want to know when it gets 'here' without having to enter directions or navigate a map.</Text>)}
    if(this.state.question4Visible){answer4 = (<Text style={styles.answer}>The closest stop to you! Given your current location, we search through the available stops for the route that you request. Then we display the two closest stops to you going opposite directions. For example: If you request Route 101, you will be shown Route 101's North-Bound Stop closest to you and Route 101's South-Bound Stop closest to you.</Text>)}
    if(this.state.question5Visible){answer5 = (<Text style={styles.answer}>Make sure that you have allowed access to your microphone. For speech to work, you must hold down the button while you are speaking. Tapping the button will not make a complete recording.</Text>)}
    if(this.state.question6Visible){answer6 = (<><Text style={styles.answer}>If you see "Not Clean Data", there was an error with your request. Please check that the route that you entered is valid.</Text><Text style={styles.answer}>Otherwise, there has likely been an error with the route listing. Not all busses are running at all times. Certain segements of the day are guarenteed to not have any arrival times for the majority of routes. (1am to 4am for example)</Text></>)}

    return (
      <>
        <Modal 
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          // onRequestClose={() => {
          //   Alert.alert('Modal has been closed.');
          // }}
        >
          <View style={styles.mainView}>
            <Text style={styles.title}>FAQ</Text>
            <TouchableHighlight
              onPress={() => {
                this.setQuestionVisible(1);
              }}>
              <Text style={styles.question}>Is this app free?</Text>
            </TouchableHighlight>

            {answer1}

            <TouchableHighlight
              onPress={() => {
                this.setQuestionVisible(2);
              }}>
              <Text style={styles.question}>Where can I use this app?</Text>
            </TouchableHighlight>

            {answer2}

            <TouchableHighlight
              onPress={() => {
                this.setQuestionVisible(3);
              }}>
              <Text style={styles.question}>Can I get directions?</Text>
            </TouchableHighlight>

            {answer3}

            <TouchableHighlight
              onPress={() => {
                this.setQuestionVisible(4);
              }}>
              <Text style={styles.question}>Which stop will I be sent to?</Text>
            </TouchableHighlight>
            
            {answer4}

            <TouchableHighlight
              onPress={() => {
                this.setQuestionVisible(5);
              }}>
              <Text style={styles.question}>Press to speak is not working.</Text>
            </TouchableHighlight>
            
            {answer5}

            <TouchableHighlight
              onPress={() => {
                this.setQuestionVisible(6);
              }}>
              <Text style={styles.question}>What is this error message?</Text>
            </TouchableHighlight> 

            {answer6}              

            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <Text style={styles.hideButton}>Hide</Text>
            </TouchableHighlight>
          </View>


        </Modal>
        <TouchableHighlight
          style={styles.faqHighlight}
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Image 
          style={styles.faqIcon}
          source={require("./faq_logo.png")} />
        </TouchableHighlight>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainView:{
    flex: 1,
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#54123B",
  },
  title:{
    shadowOffset:{  width: 1,  height: 10,  },
    shadowColor: 'black',
    shadowOpacity: 1.0,
    margin: 20,
    fontSize: 50,
    fontWeight: "bold",
    color: "white",

  },
  faqIcon: {
    width: 40,
    height: 40,
  },
  faqHighlight: {
    top: Dimensions.get("window").height * 0.45,
    right: 0,
    position: "absolute",   
  },
  question: {
    borderWidth: 3,
    padding: 10,
    margin: 10,
    fontSize: 25,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    backgroundColor: "#29c7ac",
  },
  answer: {
    marginLeft: 10,
    fontSize: 20,
    textAlign: "center",
    color: "white",
    opacity: 0.5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  hideButton: {
    borderWidth: 3,
    padding: 10,
    margin: 10,
    backgroundColor: "#29c7ac",
    fontSize: 30,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  
});