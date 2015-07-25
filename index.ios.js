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
var Dimensions = require('Dimensions');
// var Dimensions = require('./Dimensions');
// var Device = require('react-native-device');
// var pannable = require('./pannable');
// var Pannable = require('./pannable');
// import { pannable } from './pannable';

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
    justifyContent: 'flex-start',
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
  rightPhoto: {
    position: 'absolute',
    bottom: 0, right: 0,
    backgroundColor: 'red',
    width: 200,
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
  },
  rightPhoto:{
    borderWidth: 1,
    width: 100,
    backgroundColor: "red"
  }
});

// determine whether data loaded or not

var currentFullPhotoIndex = 0;

class FullImg extends React.Component{

  constructor(props){
    super(props);
    console.log("window width" + Dimensions.get('window').width);
    this.state = {
      img: this.props.img,
    }
  }

  // PanResponder stuffs
  componentWillMount() {
    var _this = this;
    this.panResponder = PanResponder.create({

      onStartShouldSetPanResponder: ({ nativeEvent: { touches } }, { x0, y0, moveX }) => {
        console.log("onStartShouldSetPanResponder");
        
        const shouldSet = touches.length === 1;
        if (shouldSet) {
          const { onPanBegin } = this.props;
          // console.log("x0", x0);
          // console.log("y0", y0);
          onPanBegin && onPanBegin({ 
            originX: x0,
            originY: y0
          });
        }

        return shouldSet;
      },

      onPanResponderGrant: ({ nativeEvent: { touches } }, { x0, y0, moveX }) =>{

        // if on right side of screen
        if (x0 > (Dimensions.get('window').width / 2)){
          _this.nextPhoto();
        } else{
        // on right side of screen
          _this.prevPhoto();
        }

      },

      // onMoveShouldSetPanResponder: ({ nativeEvent: { touches } }) => {
      //   console.log("onMoveShouldSetPanResponder");
      //   return touches.length === 1;
      // },

      onPanResponderTerminationRequest: () => true,
      onPanResponderTerminate: this.handlePanResponderRelease,
      onPanResponderRelease: this.handlePanResponderRelease
    });
  }

  displayPhoto(curPhoto){
    return(
        <View style={styles.imageContainerLow} {...this.panResponder.panHandlers}>
         <Image 
          source={{uri: curPhoto.thumb || curPhoto.url}}
          style={styles.fullsize_img}
        />
      </View>

      // <View {...this.panResponder.panHandlers}>
      //   <View style={styles.imageContainerLow}>
      //      <Image
      //       source={{uri: curPhoto.thumb || curPhoto.url}}
      //       style={styles.fullsize_img}
      //     />
      //   </View>

      //   <View style={styles.imageContainerHigh}>
      //     <Image
      //       source={{uri: curPhoto.url}}
      //       style={styles.fullsize_img}
      //     />
      //   </View>
      // </View>
    );
  }

  // TO-DO LATER: REFACTOR PREV/NEXT INTO ONE FUNCTION
  prevPhoto(){
    console.log("INSIDE prev PHOTO");
    currentFullPhotoIndex -= 1;

    if (currentFullPhotoIndex <= 0){
      currentFullPhotoIndex = data.getData().length-1;
    }

    // console.log("data[currentFullPhotoIndex]", data.getData()[currentFullPhotoIndex]);
    var prevPhoto = data.getData()[currentFullPhotoIndex];

    // "set state" triggers the render
    this.setState({img: prevPhoto});
  }

  nextPhoto(){
    console.log("INSIDE NEXT PHOTO");
    currentFullPhotoIndex += 1;

    if (currentFullPhotoIndex >= data.getData().length){
      currentFullPhotoIndex = 0;
    }

    console.log("data[currentFullPhotoIndex]", data.getData()[currentFullPhotoIndex]);
    var nextPhoto = data.getData()[currentFullPhotoIndex];

    // "set state" triggers the render
    this.setState({img: nextPhoto});
  }

  render() {
    var photo = this.state.img;
    console.log("PHOTO ID " + photo.id);
    // console.log("INDEX " + data.indexOf(photo) );
    currentFullPhotoIndex = data.indexOf(photo);
      // return (
      return this.displayPhoto(photo);
      // );
  }

}


// var FullImg = React.createClass({
//   getInitialState: function() {
//     console.log("window width" + Dimensions.get('window').width);
//     return {
//       img: this.props.img,
//       maxSize: 0
//     }
//   },

//   // measureView: function(){
//   //   this.refs
//   // }

//   displayPhoto: function(curPhoto){
//     // console.log("self.frame.size.width" + Device.width);

//     return(
    
//         // <View style={styles.imageContainer}>
//         //   <TouchableHighlight onPress={this.nextPhoto} style={styles.rightPhoto}>
//         //     <View style={styles.imageContainerLow} />
//         //   </TouchableHighlight>
//         // </View>

//           <View style={styles.imageContainerLow} {...this._panResponder.pandHandlers}>
//              <Image
//               source={{uri: curPhoto.thumb || curPhoto.url}}
//               style={styles.fullsize_img}
//             />
//           </View>

//           // <View style={styles.imageContainerHigh}>
//           //   <Image
//           //     source={{uri: curPhoto.url}}
//           //     style={styles.fullsize_img}
//           //   />
//           // </View>

        
      
//     );
//   },
  
//   nextPhoto(){
//     console.log("INSIDE NEXT PHOTO");
//     currentFullPhotoIndex += 1;

//     if (currentFullPhotoIndex >= data.getData().length){
//       currentFullPhotoIndex = 0;
//     }

//     console.log("data[currentFullPhotoIndex]", data.getData()[currentFullPhotoIndex]);
//     var nextPhoto = data.getData()[currentFullPhotoIndex];

//     // "set state" triggers the render
//     this.setState({img: nextPhoto});
//   },

// // first one
//     render() {
//       var photo = this.state.img;
//       console.log("PHOTO ID " + photo.id);
//       // console.log("INDEX " + data.indexOf(photo) );
//       currentFullPhotoIndex = data.indexOf(photo);
//         // return (
//         return this.displayPhoto(photo);
//         // );
//     }
// });


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
