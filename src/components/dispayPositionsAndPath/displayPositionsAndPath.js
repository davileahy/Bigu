import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

const DisplayPositionsAndPath = ({ personOne, personTwo }) => {
  const centerLat = (personOne.latitude + personTwo.latitude) / 2;
  const centerLon = (personOne.longitude + personTwo.longitude) / 2;
  const centerPosition = [centerLat, centerLon];

  const polylinePositions = [
    [personOne.latitude, personOne.longitude],
    [personTwo.latitude, personTwo.longitude]
  ];

  return (
    <div>
      <MapContainer center={centerPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[personOne.latitude, personOne.longitude]}>
          <Popup>
            Pessoa 1 está aqui! <br /> Latitude: {personOne.latitude} Longitude: {personOne.longitude}
          </Popup>
        </Marker>
        <Marker position={[personTwo.latitude, personTwo.longitude]}>
          <Popup>
            Pessoa 2 está aqui! <br /> Latitude: {personTwo.latitude} Longitude: {personTwo.longitude}
          </Popup>
        </Marker>
        <Polyline positions={polylinePositions} color="green" />
      </MapContainer>
    </div>
  );
};

export default DisplayPositionsAndPath;
