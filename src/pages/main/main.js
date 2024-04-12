import React from 'react';
import LocationForm from '../../components/locationForm/locationForm';
import 'leaflet/dist/leaflet.css';

function Main() {
    return (
        <div className="main">
            <div className='title-text'>
                <h1>Bigu</h1>
            </div>
            <LocationForm />
        </div>
    );
}

export default Main;