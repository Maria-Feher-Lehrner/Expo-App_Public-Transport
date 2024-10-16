import { StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { View, Button, Modal, Text } from 'react-native';
import { fetchStations, addStation, Station } from '@/components/download/stationService';
import StationList from '@/components/StationList';
import AddStationModal from '@/components/AddStationModal';

const HomeScreen: React.FC = () => {
    /*const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Added loading state
    const [modalVisible, setModalVisible] = useState<boolean>(false);*/
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false); // Loading state for pagination
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0); // Track pagination
    const limit = 50; // How many items to load per page

    // Function to load stations (initial load or for pagination)
    const loadStations = async (page: number = 0) => {
        setLoadingMore(true); // Show loading indicator for more data
        const data = await fetchStations(page * limit, limit);
        if (data.length > 0) {
            setStations((prevStations) => [...prevStations, ...data]); // Append new stations to the list
            setCurrentPage(page); // Update the current page index
        }
        setLoading(false); // Stop initial loading
        setLoadingMore(false); // Stop loading more indicator
    };

    // Fetch stations on component mount
    useEffect(() => {

        /*const loadStations = async () => {
            try {
                const data = await fetchStations();
                console.log("Stations fetched: ", data.length);
                setStations(data);
            } catch (error) {
                console.error("Error loading stations", error);
            } finally {
                setLoading(false); // Ensure loading is set to false in any case
            }
        };

        /*const loadStations = async () => {
            const data = await fetchStations();
            setStations(data);
            setLoading(false); // Stop loading after data is fetched
        };*/
        loadStations();
    }, []);

    // Function to load more stations when user scrolls to the end
    const loadMoreStations = () => {
        if (!loadingMore) {
            loadStations(currentPage + 1); // Load the next page
        }
    };

    // Function to handle adding a new station
    const handleAddStation = (newStation: Station) => {
        // Update the state directly by appending the new station
        setStations((prevStations) => [...prevStations, newStation]);
        setModalVisible(false);
    };

    // Loading spinner when fetching data
    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Render the HomeScreen content
    return (
        <View style={styles.container}>
            {/* StationList renders the FlashList */}
            <StationList stations={stations} loadMoreStations={loadMoreStations}/>

            {/* Button to trigger modal for adding new station */}
            <Button title="Add Station" onPress={() => setModalVisible(true)} />

            {/* Modal for adding a station */}
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
