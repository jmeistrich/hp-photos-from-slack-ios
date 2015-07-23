/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
// var PhotoView = require('./PhotoView');
var Camera = require('./Camera');
var PhotoFull = require('./PhotoFull');
var data = require('./Data');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight,
  NavigatorIOS,
  PanResponder
} = React;


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
  },
  //   scene: {
  //   padding: 10,
  //   paddingTop: 74,
  //   flex: 1
  // },
  fullsize_img:{
    flex: 1,
    resizeMode: "contain"
  },
  imageContainer: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'black'
  },
  imageContainerLow: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
  },
  imageContainerHigh: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'transparent'
  }
});

// determine whether data loaded or not

var currentFullPhotoIndex = 0;


var FullImg = React.createClass({
  getInitialState: function() {
    return {
      img: this.props.img
    }
  },
  displayPhoto: function(curPhoto){
    return(
      <TouchableHighlight onPress={this.nextPhoto} style={styles.imageContainer}>
        <View style={styles.imageContainer}>
          <View style={styles.imageContainerLow}>
             <Image
              source={{uri: curPhoto.thumb || curPhoto.url}}
              style={styles.fullsize_img}
            />
          </View>
          <View style={styles.imageContainerHigh}>
            <Image
              source={{uri: curPhoto.url}}
              style={styles.fullsize_img}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  },



  nextPhoto(){
    console.log("INSIDE NEXT PHOTO");
    currentFullPhotoIndex += 1;

    if (currentFullPhotoIndex > data.getData().length){
      currentFullPhotoIndex = 0;
    }

    console.log("data[currentFullPhotoIndex]", data.getData()[currentFullPhotoIndex]);
    var nextPhoto = data.getData()[currentFullPhotoIndex];

    // "set state" triggers the render
    this.setState({img: nextPhoto});
  },

// first one
    render() {
      var photo = this.state.img;
      console.log("PHOTO ID " + photo.id);
      // console.log("INDEX " + data.indexOf(photo) );
      currentFullPhotoIndex = data.indexOf(photo); 
        // return (
        return this.displayPhoto(photo);
        // );
    }
});


// constructs NavigationController
var HomeScene = React.createClass({


 getInitialState: function(){

   return{
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => {
        return row1 !== row2;
      },
    }),
    loaded: false,
   };
 },

  onPress(photo) {
  console.log("hello id " + photo.id);
        this.props.navigator.push({
            title: 'Full Sized Image',
            component: FullImg,
            passProps: {img: photo},
        });
    },

 // // send data request
   componentDidMount: function() {
     data.init(this.onDataChanged);
   },
   onDataChanged: function(data) {
    // console.log('changed', data);
    this.setState({
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
   return(
     <TouchableHighlight onPress={() => this.onPress(photo)}>

     <View style={styles.item}>
       <Image
          source={ photo.thumbCached ?
                    {uri: photo.thumbCached, isStatic: true} :
                    {uri: photo.thumb }}
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
