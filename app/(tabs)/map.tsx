import Ionicons from '@expo/vector-icons/Ionicons';
import {StyleSheet, View, Text} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import {Station, getStations} from '@/components/download/stationService';
import {StationsContext} from "@/components/download/StationsContext";

interface LocationCoordinates {
    latitude: number;
    longitude: number;
}

const MapScreen: React.FC = () => {
    const stationsContext = useContext(StationsContext);

    // Handle the case where the context might be undefined
    if (!stationsContext) {
        return <Text>Error: StationsContext is not available</Text>;
    }


    const {stations, loading, error} = stationsContext;
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

    useEffect(() => {

        const getLocation = async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission denied');
                return;
            }

            const locationResult = await Location.getCurrentPositionAsync({});
            setLocation(locationResult.coords);
        };

        getLocation();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error loading stations: {error}</Text>;
    }

    return (
        <View style={{flex: 1}}>
            {location ? (
                <MapView
                    style={{width: '100%', height: '100%'}}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {/* Current Location Marker */}
                    <Marker
                        coordinate={location}
                        title="Your Location"
                        description="This is where you are"
                    >
                        <Ionicons name="man-outline" size={50} color="blue"/>
                    </Marker>

                    {/* Stations Markers */}
                    {stations.map((station) => {
                        const latitude = parseFloat(station.latitude);
                        const longitude = parseFloat(station.longitude);

                        // Ensure both latitude and longitude are valid numbers before rendering the marker
                        if (isNaN(latitude) || isNaN(longitude)) {
                            console.warn(`Invalid coordinates for station: ${station.station_name}`);
                            return null; // Skip rendering this marker if coordinates are invalid
                        }

                        return (
                            <Marker
                                key={station.station_id}
                                coordinate={{
                                    latitude: latitude,
                                    longitude: longitude,
                                }}
                                title={station.station_name}
                            >
                                <Ionicons name="pin-sharp" size={30} color="red" />
                            </Marker>
                        );
                    })}
                </MapView>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    // Add any additional styles you want here
});

export default MapScreen;
