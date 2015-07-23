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
  Image,
  ListView
} = React;

var LocalImages = require('NativeModules').LocalImages;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    // flexDirection: 'row'
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
    width: 100,
    height: 100,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: "#f5fcff",
    // flexWrap: 'wrap',
    // flexDirection: 'row'

  }
});

var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: "http://i.imgur.com/UePbdph.jpg"}},
];

var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';

// determine whether data oaded or not



// constructs NavigationController
var photoView = React.createClass({


 getInitialState: function(){
   return{
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    loaded: false,
   };
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
     // console.log(data);
     // var image = data[0];
     // LocalImages.saveImage(image.thumb, image.id, function () {
     //   console.log('saved');
     //   LocalImages.getImage(image.id, function(error, data) {
     //     console.log(error, data);
     //   })
     // });
   },

  render: function(){
    if(!this.state.loaded){
     // if (!mockedPhotosData){
      return this.renderLoadingView();
    }

    return (
       <ListView
         dataSource={this.state.dataSource}
         renderRow={this.renderPhoto}
         style={styles.listView}
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

     <View style={styles.container}>
       <Image
          // source={{uri: movie.thumb_80}}
          source={{uri: (photo.thumb || photo.url)}}
          style={styles.thumbnail}
        />
     </View>
     );
 },



});

// class HelloWorld extends React.Component{
//   render() {
//     var movie = MOCKED_MOVIES_DATA[0];
//     return
//       <View style={styles.container}>
//         <Text>{movie.title}</Text>
//         <Text>{movie.year}</Text>
//         <Image source={{uri: movie.posters.thumbnail}} />
//       </View>

//   }

//   render(){
//     return React.createElement(React.Text, {style: styles.text}, "Hello World!");
//     // return <React.Text style={styles.text}>Hello World</React.Text>;
//   }
// }



// constructs NavigationController
// routes to HelloWorld component
// class SlackPhotoApp extends React.Component{
//   render(){
//     return (
//       <React.NavigatorIOS
//         style={styles.container}
//         initialRoute = {{
//           title: 'PhotoView',
//           component: PhotoView
//         }}/>
//       );
//   }
// }


AppRegistry.registerComponent('hpPhotosIOS', () => photoView);

// AppRegistry.registerComponent('hpPhotosIOS', function() {return SlackPhotoApp});

