'use strict';

var React = require('react-native');
var SearchResults = require('./SearchResults');

// allows us to refer to StyleSheet instead of React.StyleSheet
var {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicatorIOS,
    Image,
    Component
} = React;

var styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: "#656565"
    },
    container: {
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
    },
    flowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch'
    },
    buttonText: {
      fontSize: 18,
      color: 'white',
      alignSelf: 'center'
    },
    button: {
      height: 36,
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#48BBEC',
      borderColor: '#48BBEC',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 10,
      alignSelf: 'stretch',
      justifyContent: 'center'
    },
    searchInput: {
      height: 36,
      padding: 4,
      marginRight: 5,
      flex: 4,
      fontSize: 18,
      borderWidth: 1,
      borderColor: '#48BBEC',
      borderRadius: 8,
      color: '#48BBEC'
    },
    image: {
        width: 217,
        height: 138
    }
});

// utility function
// creates query string based on parameters
// transforms data into required string format
function urlForQueryAndPage(key, value, pageNumber){
    var data = {
        country: 'uk',
        pretty: '1',
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: pageNumber
    };
    data[key] = value;

    var queryString = Object.keys(data)
        .map(key => key + '=' + encodeURIComponent(data[key]))
        .join('&');

    return 'http://api.nestoria.co.uk/api?' + queryString;
};

class PhotoView extends Component{

     // isLoading : this property keeps track of whether query is in progress
    constructor(props){
        super(props);
        this.state = {
            searchString: 'london',
            isLoading: false,
            message: ''
        };
    }

    // takes value from event's 'text' property and uses it to update component state
    // invoke everytime user updates text
    onSearchTextChanged(event){
        console.log('onSearchTextChanged');
        this.setState({ searchString: event.nativeEvent.text });
        console.log(this.state.searchString);
    }

    // run search query
    // * underscore indicates should be considered private
    _executeQuery(query) {
        console.log(query);
        this.setState({ isLoading: true });
        fetch(query)
          .then(response => response.json())
          .then(json => this._handleResponse(json.response))
          .catch(error => 
             this.setState({
              isLoading: false,
              message: 'Something bad happened ' + error
           }));
    }

    onSearchPressed() {
        console.log('onSearchPressed');
        var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
        this._executeQuery(query);
    }

    _handleResponse(response) {
      this.setState({ isLoading: false , message: '' });
      if (response.application_response_code.substr(0, 1) === '1') {
        // console.log('Properties found: ' + response.listings.length);

        // navigates to newly added search results and passes listings from API request
        this.props.navigator.push({
          title: 'Results',
          component: SearchResults,
          passProps: {listings: response.listings}
        });
      } else {
        this.setState({ message: 'Location not recognized; please try again.'});
      }
    }

    render(){

        // if the state is loading? add an activity indicator : add an empty view
        var spinner = this.state.isLoading ?
        ( <ActivityIndicatorIOS
            hidden='true'
            size='large'/> ) :
        ( <View/>);

        console.log('SearchPage.render');
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Search for houses to buy!
                </Text>
                <Text style={styles.description}>
                    Search by placename, zipcode near your location.
                </Text>
                <View style={styles.flowRight}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Search via name or postcode'
                        value={this.state.searchString}
                        onChange={this.onSearchTextChanged.bind(this)}/>
                    <TouchableHighlight style={styles.button}
                        underlayColor="#99d9f4"
                        onPress={this.onSearchPressed.bind(this)}>
                    <Text style={styles.buttonText}>Go</Text>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight style={styles.button}
                    underlayColor="#99d9f4">
                    <Text style={styles.buttonText}>Location</Text>
                </TouchableHighlight>
                <Image source={require('image!house')} style={styles.image}/>
                {spinner}
                <Text style={styles.description}>{this.state.message}</Text>
            </View>
        );
    }
}

// exports SearchPage class for use in other files
module.exports = PhotoView;