import { render, screen } from '@testing-library/react';
import App from './App';

test('renders League of Legends Item Builder', () => {
  render(<App />);
  const headerElement = screen.getByText(/League of Legends - Item Builder/i);
  expect(headerElement).toBeInTheDocument();
});