import React from 'react';
import { render } from '@testing-library/react';
import ShowRoute from './showRoute';

// Mocking react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: () => <div>MapContainer Mock</div>,
  TileLayer: () => <div>TileLayer Mock</div>,
  Marker: () => <div>Marker Mock</div>,
  useMap: () => ({})
}));

// Mocking leaflet library and leaflet-routing-machine
jest.mock('leaflet', () => ({
  latLng: jest.fn(),
  Routing: {
    control: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      addTo: jest.fn(),
      remove: jest.fn()
    }))
  }
}));

jest.mock('leaflet-routing-machine', () => ({
  control: jest.fn().mockImplementation(() => ({
    waypoints: jest.fn(),
    addTo: jest.tcp,
    on: jest.fn(),
    remove: jest.fn()
  }))
}));

describe('ShowRoute Component', () => {
  it('renders correctly with start, pointB, and end waypoints', () => {
    const start = { latitude: 40.712776, longitude: -74.005974 };
    const end = { latitude: 42.360082, longitude: -71.058880 };
    const pointB = { latitude: 41.878113, longitude: -87.629799 };

    const { getByText } = render(<ShowRoute start={start} end={end} pointB={pointB} />);
    expect(getByText('MapContainer Mock')).toBeInTheDocument();
  });
});
