import React, {Component} from "react";
import {Text, View,TouchableHighlight, StyleSheet} from 'react-native';
// import { styles } from "react-native-material-ripple/styles";

export default class Toggle extends Component{
  constructor(props){
  super(props);
  }
  state = {
    on: false,
  }

  toggle = () => {
    this.setState({
      on: !this.state.on
    })
  }

  render(){
    return (
      <View>
      
        <TouchableHighlight onPress={this.toggle}>
                <Text style={styles.question}>{this.props.question}</Text>
        </TouchableHighlight>
        {this.state.on && this.props.children}
       
      </View>
    )
  }
}

const styles = StyleSheet.create({
  question: {
    fontWeight: "bold",
  }
  
});