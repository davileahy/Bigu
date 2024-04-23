//Hook que engloba o algorítimo que está sendo utilizado para o cáulculo da distância entre dois pontos.
export const useHaversine = () => {

    // função que utiliza o raio de comprimento da terra para calcular a distancia entre dois pontos
    const calculateDistance = (lat1, lon1, lat2, lon2) => {

        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;

    };

    return { calculateDistance };
};
