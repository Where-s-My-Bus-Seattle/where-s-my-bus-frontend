import React, {Component} from "react";
import {Modal, Text, TouchableHighlight, View, Alert, Image, StyleSheet} from 'react-native';
import Toggle from "./toggle"


export default class ModalFeedback extends Component {
  state = {
    modalVisible: false,
    question1Visible: false,
    question2Visible: false,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <>
        <View >
          <Modal 
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            // onRequestClose={() => {
            //   Alert.alert('Modal has been closed.');
            // }}
          >
            <View style={styles.mainView}>
              <TouchableHighlight 
                onPress ={() => {}}
              >
              
              </TouchableHighlight>  
                <Toggle question = "Is this app free?" style={styles.question}>
                  <Text style={styles.question}>Yes, our app is free</Text>
                </Toggle> 

                <Toggle question = "Where can I use this app?">
                  <Text >Currently our app covers the Greater Puget Sound area. Community Transit, Everett Transit, King County Metro, Pierce Transit, Intercity Transit are currently covered. Additional support for Sounder Train services and Washington State Ferry services.</Text>
                </Toggle> 

                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text>Hide</Text>
                </TouchableHighlight>
            </View>
          </Modal>
        </View>
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
    marginTop: 50,
    fontSize: 30,
    
  },
  faqIcon: {
    width: 40,
    height: 40,
    top: -40,
    right: 0,
    position: "absolute",
  },
  question: {
    padding: 10,
    fontSize: 30,
  },
  // not working
  modalStyles: {
    height: 200
  }
  
});