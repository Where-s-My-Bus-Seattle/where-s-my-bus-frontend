import React, {Component} from "react";
import {Modal, Text, TouchableHighlight, View, Alert, Image, StyleSheet} from 'react-native';

export default class ModalFeedback extends Component {
  state = {
    modalVisible: false,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={{marginTop: 20}}>
        <Modal 
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View>
              <Text>Hello World!</Text>

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  faqIcon: {
    width: 30,
    height: 30,
    marginTop: 0,
    paddingTop:0,
    alignSelf: 'flex-end'
  },

  // not working
  modalStyles: {
    height: 200
  }
  
});