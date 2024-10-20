import { StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { View, Button, Modal, Text } from 'react-native';
import { Station } from '@/components/download/stationService';
import { StationsContext } from '@/components/download/StationsContext';
import StationListView from '@/components/StationListView';
import AddStationModal from '@/components/AddStationModal';

const HomeScreen: React.FC = () => {
    const stationsContext = useContext(StationsContext);
    if (!stationsContext) {
        return <Text>Error: StationsContext is not available</Text>;
    }

    const { stations, loading, error, setStations } = stationsContext;
    const [modalVisible, setModalVisible] = useState<boolean>(false); // For modal visibility

    // Function to handle adding a new station
    const handleAddStation = (newStation: Station) => {
        // Update the stations by appending the new station
        setStations((prevStations: Station[]) => [...prevStations, newStation]);
        setModalVisible(false); // Close modal after adding
    };


    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return <Text>Error loading stations: {error}</Text>;
    }

    // Render the HomeScreen content
    return (
        <View style={styles.container}>
            <StationListView stations={stations} />
            <Button title="Add Station" onPress={() => setModalVisible(true)} />

            <Modal
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <AddStationModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSave={handleAddStation}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
