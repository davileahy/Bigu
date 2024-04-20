import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Spin } from 'antd';

function ShowRoute({ pointA, pointB, personClosest }) {
  const [routes, setRoutes] = useState([]);

  const API_KEY = process.env.ORS_API_KEY; // Substitua pela sua chave de API

  useEffect(() => {
    if (!pointA || !pointB || !personClosest) {
      console.log('Dados de rota incompletos.');
      return;
    }

    const fetchRoutes = async () => {
      const urls = [
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${pointA.longitude},${pointA.latitude}&end=${personClosest.longitude},${personClosest.latitude}`,
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${personClosest.longitude},${personClosest.latitude}&end=${pointB.longitude},${pointB.latitude}`
      ];

      try {
        const routesData = await Promise.all(urls.map(url => fetch(url).then(res => res.json())));
        const coordinates = routesData.map(data => data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
        setRoutes(coordinates.flat());
      } catch (error) {
        console.error("Failed to fetch routes", error);
      }
    };

    fetchRoutes();
  }, [pointA, pointB, personClosest, API_KEY]);

  if (!pointA || !pointB || !personClosest) {
    return <div>Loading map data... <Spin /></div>;
  }

  return (
    <MapContainer center={pointA} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={pointA}>
        <Popup>Ponto de Partida</Popup>
      </Marker>
      <Marker position={personClosest}>
        <Popup>Pessoa Mais Próxima</Popup>
      </Marker>
      <Marker position={pointB}>
        <Popup>Ponto de Chegada</Popup>
      </Marker>
      {routes.length > 0 && <Polyline positions={routes} color="red" />}
    </MapContainer>
  );
}

export default ShowRoute;
