//este componente serve para exibir as rotas entre as coordenadas apresentadas

//imports
import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

//função da rota recebendo as entradas de começo(start), fim(end) e ...(pointB)
const ShowRoute = ({ start, end, pointB }) => {
    const Routing = () => {
        const map = useMap();

        React.useEffect(() => {
            if (!map) return;

            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(start.latitude, start.longitude),
                    L.latLng(pointB.latitude, pointB.longitude),
                    L.latLng(end.latitude, end.longitude)
                ],
                routeWhileDragging: true,
                show: false,
                addWaypoints: false,
                fitSelectedRoutes: true,
                showAlternatives: false
            }).addTo(map);

            return () => {
              if (routingControl && routingControl.remove) {
                routingControl.remove();
              }
            };
            // eslint-disable-next-line
        }, [map, start, end, pointB]);

        return null;
    };

    //exibição do mapa na tela
    return (
        <MapContainer center={[start.latitude, start.longitude]} zoom={13} style={{ height: 400, width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[start.latitude, start.longitude]} />
            <Marker position={[end.latitude, end.longitude]} />
            <Marker position={[pointB.latitude, pointB.longitude]} />
            <Routing />
        </MapContainer>
    );
};

export default ShowRoute;
