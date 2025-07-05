import { render, screen } from '@testing-library/react';
import ErrorDisplay from '../../components/ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders with error message', () => {
    render(<ErrorDisplay error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders with another error message', () => {
    render(<ErrorDisplay error="Custom error!" />);
    expect(screen.getByText('Custom error!')).toBeInTheDocument();
  });
}); 