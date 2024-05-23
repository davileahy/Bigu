import { act, renderHook } from 'react';
import { useLocationSearch } from './useLocationSearch';

// Mock global fetch API
global.fetch = jest.fn();

describe('useLocationSearch', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('returns coordinates for a valid address', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ lat: '40.7128', lon: '-74.0060' }])
    });

    const { result, waitForNextUpdate } = renderHook(() => useLocationSearch());

    act(() => {
      result.current.searchLocation("1600 Pennsylvania Avenue NW, Washington, DC");
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result.current.searchLocation).toBeDefined();
    expect(result.current.searchLocation()).resolves.toEqual({
      latitude: 40.7128,
      longitude: -74.0060
    });
  });

  test('handles errors and returns null on failure', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const { result, waitForNextUpdate } = renderHook(() => useLocationSearch());

    act(() => {
      result.current.searchLocation("Nonexistent Place");
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result.current.searchLocation).toBeDefined();
    expect(result.current.searchLocation()).resolves.toBeNull();
  });
});
