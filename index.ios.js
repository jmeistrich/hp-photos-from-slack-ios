/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var PhotoView = require('./PhotoView');
var Camera = require('./Camera');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var onChanged = function(data) {
  console.log(data);
}

var data = require('./Data');
data.init(onChanged);


var hpPhotosIOS = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get z, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


// constructs NavigationController
// routes to HelloWorld component
class SlackPhotoApp extends React.Component{
  render(){
    return (
      <React.NavigatorIOS
        style={styles.container}
        initialRoute = {{
          title: 'PhotoView',
          component: SearchPage
        }}/>
      );
  }
}

AppRegistry.registerComponent('hpPhotosIOS', () => hpPhotosIOS);
