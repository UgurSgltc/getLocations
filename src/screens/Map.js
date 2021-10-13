/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import Geolocation from '@react-native-community/geolocation';
import { getPathLength } from 'geolib';
import React from 'react';
import {
    PermissionsAndroid, Platform, Pressable, StyleSheet,
    Text, View
} from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { formatDistance } from '../helperFunctions';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            position: {},
            isTracking: false,
            currentTrack: [],
            travelDistance: 0
        }
    }

    componentDidMount = async () => {
        Geolocation.setRNConfiguration({
            authorizationLevel: 'whenInUse',
            skipPermissionRequests: false
        })

        if (Platform.OS === 'android') {
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
                .then(granted => {
                    if (granted) {
                        return Promise.resolve()
                    }
                    return PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    )
                })
                .then(() => {
                    this.requestPosition()
                    this.watchLivePosition()
                })
                .catch(err => console.log("req err", err))
        } else {
            this.requestPosition()
            this.watchLivePosition()
        }
    }

    componentWillUnmount() {
        Geolocation.clearWatch(this.WatcheId);
    }

    watchLivePosition = () => {
        console.log("watchin position")
        this.watchId = Geolocation.watchPosition(
            this.handleNewPosition,
            error => {
                console.log("watch error", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 10000
            }
        )
    }

    requestPosition = err => {
        if (!err) {
            Geolocation.getCurrentPosition(
                this.handleNewPosition,
                this.requestPosition
            )
        } else {
            Geolocation.getCurrentPosition(
                this.handleNewPosition,
                err => console.log("err", err),
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 10000
                }
            )
        }
    }

    handleNewPosition = (position = {}) => {
        const { isTracking, currentTrack } = this.state
        const { coords } = position;
        console.log("handle", isTracking)
        if (isTracking) {
            const newTrack = currentTrack.concat(coords)
            const travelDistance = getPathLength(newTrack)
            this.setState({ position: coords, currentTrack: newTrack, travelDistance });
        } else {
            this.setState({ position: coords });
        }
    }

    toggleTracking = () => {
        const { position, isTracking, travelDistance } = this.state
        if (isTracking) {
            this.setState({ isTracking: false, travelDistance: 0, currentTrack: [] })
            // diğer sayfa
            this.props.navigation.navigate("Payment", { travelDistance })
        } else {
            const currentTrack = [position]
            this.setState({ isTracking: true, currentTrack })
        }
    }

    trackPosition = () => {
        this.setState
    }

    render() {
        const { position, isTracking, currentTrack, travelDistance } = this.state;
        console.log(currentTrack)
        return (
            <View style={styles.container}>

                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={{
                        ...position,
                        latitudeDelta: 0.055,
                        longitudeDelta: 0.0521,
                    }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                >
                    <Polyline
                        coordinates={currentTrack}
                        strokeColor="#000"
                        strokeWidth={6}
                    />
                </MapView>

                <Pressable onPress={this.toggleTracking}>

                    {/* <View style={{flexDirection:'row', bottom: 50, width: 200, height: 50, backgroundColor: 'red',alignItems:'center' }}> */}
                    <View style={{ bottom: 50, backgroundColor: 'red' }}>
                        <Text style={{ width: 200, backgroundColor: isTracking ? "green" : 'red', paddingVertical:10, color: 'white', textAlign: 'center' }} >
                            {isTracking ? "Stop Tracking" : "Start Tracking"}
                        </Text>
                        {/* <Text style={{backgroundColor:'aqua'}}>{formatDistance(travelDistance)}</Text>  */}
                    </View>
                </Pressable>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});