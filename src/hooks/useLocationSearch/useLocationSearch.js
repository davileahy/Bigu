//hook que engloba a procura as coordenádas dos endereços inseridos a partir  
//da biblioteca "NOMINATIM" que por sua vez também é baseado na OSM

import { useState } from 'react';
import { message } from 'antd';

export const useLocationSearch = () => {
    const [loading, setLoading] = useState(false);

    const searchLocation = async (address) => {
        setLoading(true);

        //faz a ligação com o sistema do NOMINATIM
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
            } 
                
                else {
                message.error('Endereço não encontrado');
                return null;}
            }

        //aviso de erro caso não seja possivel associar o endereço à coordenada
            catch (error) {
            console.error("Erro ao buscar localização:", error);
            message.error('Erro ao buscar localização');
            setLoading(false);
            return null;

}
    };

    return { searchLocation, loading };
};
