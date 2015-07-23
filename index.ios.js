/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
// var PhotoView = require('./PhotoView');
var Camera = require('./Camera');
var Accordion = require('react-native-accordion');
var PhotoFull = require('./PhotoFull');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight,
  NavigatorIOS
} = React;

var LocalImages = require('NativeModules').LocalImages;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    // // flexDirection: 'row'
    // flexWrap: 'wrap',
  },
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
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
  thumbnail: {
    width: 123,
    height: 123,
  },
  // listView: {
  //   paddingTop: 20,
  //   backgroundColor: "#f5fcff",
  //   // flex-grow: 1,
  //   // flexWrap: 'wrap',
  //   // flexDirection: 'row'

  // },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  item: {
    marginHorizontal: 1,
    marginVertical: 1,
  }
});

var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: "http://i.imgur.com/UePbdph.jpg"}},
];

var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';

// determine whether data oaded or not


var PhotoFull2 = React.createClass({

  render(){
    console.log("inside photo full2");
    return(

      <Image
         source={{uri: (photo.url ) }}
         style={styles.thumbnail}
       />

      );
  }

});

// constructs NavigationController
var HomeScene = React.createClass({


 getInitialState: function(){

   return{
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    loaded: false,
   };
 },

 photoPressed: function(myPhoto){
  console.log("photo ID " + myPhoto.id);
  this.props.navigator.push({
    title: "Full size",
    component: PhotoFull2
  });
 },

 // // send data request
 componentDidMount: function() {
     var data = require('./Data');
     data.init(this.onDataChanged);
   },
   onDataChanged: function(data) {
    this.setState({
      // movies: responseData.movies,
      dataSource: this.state.dataSource.cloneWithRows(data),
      loaded: true
    });
   },

  render: function(){
    if(!this.state.loaded){
      return (
        this.renderLoadingView()
        );
    }

    return (

       <ListView
        contentContainerStyle={styles.list}
         dataSource={this.state.dataSource}
         // renderRow={(rowData) => <Text style={styles.item}>{rowData}</Text>}
         renderRow={this.renderPhoto}

         // renderRow={this._renderRow}
         // style={styles.listView}
       />
     );
  },

   renderLoadingView: function(){
     return(
       <View style={styles.container}>
         <Text>
           Loading photos..
         </Text>
       </View>
       );
   },

 renderPhoto: function(photo){
  console.log(photo.thumb, photo.url);
   return(
    <TouchableHighlight onPress={() => this.photoPressed(photo)}>

     <View style={styles.item}>
       <Image
          source={{uri: (photo.thumb || photo.url ) }}
          style={styles.thumbnail}
        />
     </View>
   </TouchableHighlight>

     );
 },
});




var navDemo = React.createClass({
  // onRightButtonPress: function() {
  //         this.refs.nav.push({
  //             title: 'From Right',
  //             component: PhotoFull
  //         })
  //     },

  render(){
    return(
      <NavigatorIOS ref="nav" style={styles.container} initialRoute={{
              component: HomeScene,
              title: 'Hacker Paradise Photos',
              // rightButtonTitle: 'MORE!',
              // onRightButtonPress: this.onRightButtonPress
          }} />

      );
  }
});



AppRegistry.registerComponent('hpPhotosIOS', () => navDemo);
