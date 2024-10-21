import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

interface AddStationFormViewProps {
    onClose: () => void;
    onSave: (stationName: string, latitude: string, longitude: string) => void;
}

const AddStationFormView: React.FC<AddStationFormViewProps> = ({ onClose, onSave }) => {
    const [stationName, setStationName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                setLatitude(latitude.toString());
                setLongitude(longitude.toString());
            } else {
                console.log('Location permission not granted');
            }
        } catch (error) {
            console.error('Error fetching location', error);
        }
    };

    // Use effect to fetch location when component mounts
    useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleSave = () => {
        if (stationName && latitude && longitude) {
            onSave(stationName, latitude, longitude); // Pass values back to parent
            onClose(); // Close the modal
        } else {
            alert('Please fill in all fields');
        }
    };


    return (


            <View style={styles.container}>
                <Text style={styles.text}>Add a new station here!</Text>

                <Text style={styles.label}>Station Name</Text>
                <TextInput
                    value={stationName}
                    onChangeText={setStationName}
                    style={styles.input}
                />
                <Text style={styles.label}>Latitude</Text>
                <TextInput
                    value={latitude}
                    onChangeText={setLatitude}
                    style={styles.input}
                    keyboardType="numeric"
                />
                <Text style={styles.label}>Longitude</Text>
                <TextInput
                    value={longitude}
                    onChangeText={setLongitude}
                    style={styles.input}
                    keyboardType="numeric"
                />

                <View style={styles.buttonContainer}>
                    <Button title="Add Station" onPress={handleSave} />
                    <View style={styles.buttonSpacing} />
                    <Button title="Cancel" onPress={onClose} />
                </View>

            </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginVertical: 5,
        marginStart: 20,
        alignSelf: 'flex-start', // Align labels to the start
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        width: '90%', // Set width to 90% of parent container
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '90%', // Set width to 90% of parent container
    },
    buttonSpacing: {
        width: 10, // Space between buttons
    },
});

export default AddStationFormView;
