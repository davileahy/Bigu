import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ShowPositionOnMap = ({ latitude, longitude }) => {
  if (latitude == null || longitude == null) {
      return <div>Localização não disponível.</div>;
  }

  const position = [latitude, longitude];

  return (
      <div>
          <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                  <Popup>
                      Você está aqui! <br /> Latitude: {latitude} Longitude: {longitude}
                  </Popup>
              </Marker>
          </MapContainer>
      </div>
  );
};

export default ShowPositionOnMap;
