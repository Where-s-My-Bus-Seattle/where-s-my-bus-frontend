import React, {Component} from "react";
import {Modal, Text, TouchableHighlight, View, Alert, Image, StyleSheet} from 'react-native';
import Constants from "expo-constants";

import Toggle from "./toggle"
import { Colors } from "react-native/Libraries/NewAppScreen";


export default class ModalFeedback extends Component {
  state = {
    modalVisible: false,
    question1Visible: false,
    question2Visible: false,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setQuestionVisible(question){
    if (question == 1){this.setState({question1Visible: !this.state.question1Visible});}
    if (question == 2){this.setState({question2Visible: !this.state.question2Visible});}

     
  }

  render() {
    let answer1 = (<></>);
    let answer2 = (<></>);
    if(this.state.question1Visible){answer1 = (<Text style={styles.answer}>Yes, our app is free</Text>)}
    if(this.state.question2Visible){answer2 = (<><Text style={styles.answer}>Currently our app covers the Greater Puget Sound area.</Text><Text style={styles.answer}>Serving: King County Metro, Community Transit, Pierce Transit, Everett Transit, Intercity Transit, Washington State Ferries, Sounder Train service</Text></>)};

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
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <Text style={styles.hideButton}>Hide</Text>
            </TouchableHighlight>
          </View>


        </Modal>
        <TouchableHighlight
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
    top: -40,
    right: 0,
    position: "absolute",
  },
  question: {
    borderWidth: 3,
    padding: 10,
    margin: 10,
    fontSize: 30,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    backgroundColor: "#29c7ac",
  },
  answer: {
    marginLeft: 10,
    fontSize: 25,
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