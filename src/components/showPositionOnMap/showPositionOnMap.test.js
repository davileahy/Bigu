import React from 'react';
import { render } from '@testing-library/react';
import ShowPositionOnMap from './showPositionOnMap';

// Mocking react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: () => <div>MapContainer Mock</div>,
  TileLayer: () => <div>TileLayer Mock</div>,
  Marker: () => <div>Marker Mock</div>,
  Popup: () => <div>Popup Mock</div>
}));

describe('ShowPositionOnMap Component', () => {
    it('renders the map when coordinates are provided', () => {
        const { getByText } = render(<ShowPositionOnMap latitude={40.712776} longitude={-74.005974} />);
        expect(getByText('MapContainer Mock')).toBeInTheDocument();
    });

    it('renders unavailable location message when coordinates are null', () => {
        const { getByText } = render(<ShowPositionOnMap latitude={null} longitude={null} />);
        expect(getByText('Localização indisponível.')).toBeInTheDocument();
    });
});
