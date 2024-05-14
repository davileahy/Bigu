import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import LocationForm from './LocationForm';
import { act } from 'react-dom/test-utils';

describe('LocationForm', () => {
  test('Submits form and displays result', async () => {
    render(<LocationForm />);

    // Simulate user interaction with the input and submit button
    await act(async () => {
      fireEvent.change(screen.getByTestId('input-start'), {
        target: { value: 'Maceio Shopping' }
      });
      fireEvent.click(screen.getByTestId('btn-buscar-partida'));
    });

    // Use waitFor to handle asynchronous operations like fetching data
    await waitFor(() => {
      // Ensure that the expected output text is in the document
      // Update the text to match what your component actually renders
      expect(screen.getByText(/expected output text/i)).toBeInTheDocument();
    });
  });
});
