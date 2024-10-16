import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Station } from '@/components/download/stationService';

interface StationListProps {
    stations: Station[]; // Explicitly declare that stations is an array of Station
    loadMoreStations: () => void; // Function to load more stations
}

const StationList: React.FC<StationListProps> = ({ stations, loadMoreStations }) => {
    return (
        <View style={styles.container}>
            <FlashList
                data={stations}
                keyExtractor={(item) => item.station_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.station_name}</Text>
                    </View>
                )}
                estimatedItemSize={100} // Improve FlashList performance
                onEndReached={loadMoreStations} // Load more when reaching the end
                onEndReachedThreshold={0.5} // Trigger when 50% of the way through the last item
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        marginTop: 32,
        marginBottom: 24,
        marginHorizontal: 16,
        backgroundColor: '#f9f9f9', // Light background color
    },
    item: {
        paddingTop: 2,
        paddingRight: 2,
        paddingBottom: 2,
        paddingLeft: 16,
        marginVertical: 2,
        marginHorizontal: 0,
        backgroundColor: '#fff', // White background for each item
        borderRadius: 4, // Rounded corners
        elevation: 2, // Shadow effect (Android)
        shadowColor: '#000', // Shadow color (iOS)
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    itemText: {
        fontSize: 16,
    },
});

export default StationList;