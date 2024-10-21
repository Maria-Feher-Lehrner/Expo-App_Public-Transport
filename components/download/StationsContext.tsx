import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Station, fetchStations } from '@/components/download/stationService';

interface StationsContextType {
    stations: Station[];
    loading: boolean;
    error: string | null;
    setStations: React.Dispatch<React.SetStateAction<Station[]>>;
}

const StationsContext = createContext<StationsContextType | undefined>(undefined);

const StationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStations = async () => {
            try {
                const data = await fetchStations();
                setStations(data);
            } catch (err) {
                setError('Failed to fetch stations');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadStations();
    }, []);

    return (
        <StationsContext.Provider value={{ stations, loading, error, setStations }}>
            {children}
        </StationsContext.Provider>
    );
};

export { StationsProvider, StationsContext };
