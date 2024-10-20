import Papa from 'papaparse';

// Define the interface for the station data structure
export interface Station {
    station_id: string;
    station_name: string;
    latitude: string;
    longitude: string;
}

const CSV_URL = 'https://data.wien.gv.at/csv/wienerlinien-ogd-haltestellen.csv';

//Store station data in this array (in memory)
let stationData: Station[] = [];

/**
 * Fetch stations from the CSV file, parse it, and store it in memory.
 * @returns Promise that resolves to the parsed station data array
 */
export const fetchStations = async (): Promise<Station[]> => {
    try {
        // Fetch the CSV file
        const startTime = Date.now(); // Start timer
        console.log("Fetching stations...");

        const response = await fetch(CSV_URL);
        const csvString = await response.text();

        const endTime = Date.now(); // End timer
        console.log(`Fetch Stations completed in ${endTime - startTime} ms`);

        // Parse the CSV data using PapaParse
        const results = Papa.parse(csvString, {
            header: true, // Treat the first row as headers
            delimiter: ';',
        });

        // Map the parsed data to Station objects and store them
        stationData = results.data.map((row: any) => ({
            station_id: row['HALTESTELLEN_ID'],
            station_name: row['NAME'],
            latitude: row['WGS84_LAT'],
            longitude: row['WGS84_LON'],
        }));
        return stationData;

    } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
        return [];
    }
};

/**
 * Get the station data stored in memory.
 * @returns Array of Station objects
 */
export const getStations = (): Station[] => stationData;

/**
 * Add a new station to the list (in memory).
 * @param station Station object to add
 */
export const addStation = (station: Station): void => {
    stationData.push(station);
};
