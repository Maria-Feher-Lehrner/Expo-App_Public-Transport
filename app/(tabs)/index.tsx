import {View, Button, Modal, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useState, useContext} from 'react';
import {Station} from '@/components/download/stationService';
import {StationsContext} from '@/components/download/StationsContext';
import StationListView from '@/components/StationListView';
import AddStationFormView from '@/components/AddStationFormView';


const HomeScreen: React.FC = () => {
    const stationsContext = useContext(StationsContext);
    if (!stationsContext) {
        return <Text>Error: StationsContext is not available</Text>;
    }

    const {stations, loading, error, setStations} = stationsContext;
    const [modalVisible, setModalVisible] = useState<boolean>(false); // For modal visibility


    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }
    if (error) {
        return <Text>Error loading stations: {error}</Text>;
    }

    const handleAddStation = (stationName: string, latitude: string, longitude: string) => {
        const newStation: Station = {
            station_id: Math.random().toString(),  // Generate a random ID for now
            station_name: stationName,
            latitude,
            longitude,
        };
        setStations((prevStations) => [...prevStations, newStation]);
    };

    return (
        <View style={styles.container}>

            <StationListView stations={stations}/>
            <Button title="Add Station" onPress={() => {
                console.log("Opening modal...");
                setModalVisible(true);
            }}/>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setModalVisible(false)}
            >
                <AddStationFormView
                    onSave={handleAddStation}
                    onClose={() => setModalVisible(false)}
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
});

export default HomeScreen;
