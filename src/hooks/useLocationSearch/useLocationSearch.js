import { useState } from 'react';
import { message } from 'antd';

export const useLocationSearch = () => {
    const [loading, setLoading] = useState(false);

    const searchLocation = async (address) => {
        setLoading(true);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setLoading(false);
            if (data.length > 0 && data[0].lat && data[0].lon) {
                message.success('Endereço encontrado');
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                };
            } else {
                message.error('Endereço não encontrado');
                return null;
            }
        } catch (error) {
            console.error("Erro ao buscar localização:", error);
            message.error('Erro ao buscar localização');
            setLoading(false);
            return null;
        }
    };

    return { searchLocation, loading };
};
