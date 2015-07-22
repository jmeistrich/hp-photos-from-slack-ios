/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var _ = require('lodash');
var DDPClient = require("ddp-client");

var ddpClient = new DDPClient({url: 'ws://hp-photos-from-slack.meteor.com/websocket'});

ddpClient.connect(() => ddpClient.subscribe('photos'));

    var updateRows = function(rows) {
        console.log(rows);
      };

// observe the lists collection
  var observer = ddpClient.observe("photos");
  observer.added = () => updateRows(_.cloneDeep(_.values(ddpClient.collections.photos)));
  observer.changed = () => updateRows(_.cloneDeep(_.values(ddpClient.collections.photos)));
  observer.removed = () => updateRows(_.cloneDeep(_.values(ddpClient.collections.photos)));




var hpPhotosIOS = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get aksdhksadj, edit index.ios.js
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

AppRegistry.registerComponent('hpPhotosIOS', () => hpPhotosIOS);
