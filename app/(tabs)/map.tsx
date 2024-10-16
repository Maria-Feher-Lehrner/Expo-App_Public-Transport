import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Station, getStations } from '@/components/download/stationService';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

const MapScreen: React.FC = () => {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const loadStations = async () => {
      const fetchedStations = await getStations();
      setStations(fetchedStations);
    };

    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      });
    };

    loadStations();
    getLocation();
  }, []);

  return (
      <View style={{ flex: 1 }}>
        {location ? (
            <MapView
                style={{ width: '100%', height: '100%' }}
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
                <Ionicons name="man-outline" size={30} color="blue" />
              </Marker>

              {/* Stations Markers */}
              {stations.map((station) => (
                  <Marker
                      key={station.station_id}
                      coordinate={{
                        latitude: parseFloat(station.latitude),
                        longitude: parseFloat(station.longitude),
                      }}
                      title={station.station_name}
                  >
                    <Ionicons name="pin-sharp" size={30} color="red" />
                  </Marker>
              ))}
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
