import { renderHook } from '@testing-library/react-hooks';
import { useHaversine } from './useHaversine';

describe('useHaversine', () => {
  test('calculates the distance between two points correctly', () => {
    const { result } = renderHook(() => useHaversine());

    // Example coordinates for two points: New York and Los Angeles
    const distance = result.current.calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);

    // Check the calculated distance (the actual distance is about 3940 km)
    expect(distance).toBeCloseTo(3940, -2); // Using a precision of 2 decimal places
  });
});
