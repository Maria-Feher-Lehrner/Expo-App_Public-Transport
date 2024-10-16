import React, { useEffect, useState } from 'react';
import { Modal, View, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';
import { Station } from '@/components/download/stationService';

interface AddStationModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (newStation: Station) => void; // Add onSave prop
}

const AddStationModal: React.FC<AddStationModalProps> = ({ visible, onClose, onSave }) => {
    const [stationName, setStationName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    // Function to generate a random station_id outside the existing range
    const generateStationId = (): string => {
        const minId = 1;
        const maxId = 1355434120;
        const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
        return randomId.toString();
    };

    // Function to get the current location
    const getCurrentLocation = async () => {
        try {
            // Request permission to access location
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                // Get the current location
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;

                // Set the latitude and longitude state with the current location
                setLatitude(latitude.toString());
                setLongitude(longitude.toString());
            } else {
                console.log('Location permission not granted');
            }
        } catch (error) {
            console.error('Error fetching location', error);
        }
    };

    // Use effect to fetch location when modal opens
    useEffect(() => {
        if (visible) {
            getCurrentLocation();
        }
    }, [visible]);

    const handleAddStation = () => {
        const newStation: Station = {
            station_id: generateStationId(),
            station_name: stationName,
            latitude,
            longitude,
        };

        // Pass the new station to the parent via the onSave prop
        onSave(newStation);
        onClose(); // Close the modal after adding the station

        // Reset input fields
        setStationName('');
        setLatitude('');
        setLongitude('');
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View style={{ padding: 20 }}>
                <TextInput
                    placeholder="Station Name"
                    value={stationName}
                    onChangeText={setStationName}
                    style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
                />
                <TextInput
                    placeholder="Latitude"
                    value={latitude}
                    onChangeText={setLatitude}
                    style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
                    keyboardType="numeric" // Ensures that the user can enter numeric values only
                />
                <TextInput
                    placeholder="Longitude"
                    value={longitude}
                    onChangeText={setLongitude}
                    style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
                    keyboardType="numeric" // Ensures that the user can enter numeric values only
                />
                <Button title="Add Station" onPress={handleAddStation} />
                <Button title="Cancel" onPress={onClose} />
            </View>
        </Modal>
    );
};

export default AddStationModal;
