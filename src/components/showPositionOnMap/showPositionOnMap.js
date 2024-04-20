//este componente é o core do mapa, nele vai ser determinado as coordenadas e puxar as funções dele da biblioteca "open street map"

//imports básicos
import React from 'react';

//import da biblioteca "leaflet"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ShowPositionOnMap = ({ latitude, longitude }) => {

    //caso não ache o endereço será exibido o aviso "localização indisponivel" 
  if (latitude == null || longitude == null) {
      return <div>Localização indisponível.</div>;
  }

  const position = [latitude, longitude];

  //começo do vizual da página
  return (

    //determina as caracteristicas do mapa à ser puxado
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
