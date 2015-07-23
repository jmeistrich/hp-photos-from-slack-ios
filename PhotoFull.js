'use strict';
 
var React = require('react-native');
var {
  StyleSheet,
  Image, 
  View,
  Text,
  Component
} = React;

var styles = StyleSheet.create({
  container: {
    marginTop: 65
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  image: {
    width: 400,
    height: 300
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 5,
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    margin: 5,
    color: '#656565'
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  }
});


class PhotoFull extends Component {
 
  render() {

    var thePhoto = this.props.myPhoto;

    return (
      <View style={styles.container}>
        <Image style={styles.image} 
            source={{uri: thePhoto.url}} />
      </View>
    );
  }
}

module.exports = PhotoFull;