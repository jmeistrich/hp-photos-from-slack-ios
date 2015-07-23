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

var _ = require('lodash');
var DDPClient = require("ddp-client");

var ddpClient = new DDPClient({url: 'ws://hp-photos-from-slack.meteor.com/websocket'});

ddpClient.connect(() => ddpClient.subscribe('photos'));

var timeout = undefined;

var arr = [];

var printEverything = function()
{
  var num = 0;
  var rows = ddpClient.collections.photos;
  for (var key in rows)
  {
    if (rows.hasOwnProperty(key))
    {
      var obj = rows[key];
      if (obj.slack && obj.slack.filetype)
      {
        switch(obj.slack.filetype)
        {
          case 'jpg':
          case 'jpeg':
          case 'png':
            arr.push(obj.slack.title);
            num ++;
            break;
        }
      }
    }
  }
  // console.log(arr);
  // console.log('num', num);
}

    var updateRows = function(rows) {
        var num = 0;
        for (var key in rows)
        {
          if (rows.hasOwnProperty(key))
          {
            var obj = rows[key];
            if (obj.slack && obj.slack.filetype)
            {
              switch(obj.slack.filetype)
              {
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                  num ++;
                  break;
              }
            }
          }
        }
        if (timeout)
        {
          clearTimeout(timeout);
        }
        timeout = setTimeout(printEverything, 5000);
        // console.log('num photos', num);
      };

// observe the lists collection
  var observer = ddpClient.observe("photos");
  observer.added = () => updateRows(ddpClient.collections.photos);
  // observer.changed = () => updateRows(ddpClient.collections.photos);
  // observer.removed = () => updateRows(ddpClient.collections.photos);
  // observer.added = () => updateRows(_.cloneDeep(_.values(ddpClient.collections.photos)));
  // observer.changed = () => updateRows(_.cloneDeep(_.values(ddpClient.collections.photos)));
  // observer.removed = () => updateRows(_.cloneDeep(_.values(ddpClient.collections.photos)));




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
