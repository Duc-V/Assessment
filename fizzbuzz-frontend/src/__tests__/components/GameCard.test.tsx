import { render, screen } from '@testing-library/react';
import GameCard from '../../components/GameCard';

describe('GameCard', () => {
  const game = {
    id: 1,
    name: 'FizzBuzz',
    author: 'John Doe',
    minNumber: 1,
    maxNumber: 100,
    rules: [
      { word: 'Fizz', divisor: 3 },
      { word: 'Buzz', divisor: 5 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('renders game name, author, and range', () => {
    render(<GameCard game={game} />);
    expect(screen.getByText('FizzBuzz')).toBeInTheDocument();
    expect(screen.getByText(/by John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Range: 1 - 100/)).toBeInTheDocument();
  });

  it('renders rules', () => {
    render(<GameCard game={game} />);
    expect(screen.getByText('Fizz (÷3)')).toBeInTheDocument();
    expect(screen.getByText('Buzz (÷5)')).toBeInTheDocument();
  });

  it('renders details and play links', () => {
    render(<GameCard game={game} />);
    expect(screen.getByRole('link', { name: /details/i })).toHaveAttribute('href', '/game/1');
    expect(screen.getByRole('link', { name: /play/i })).toHaveAttribute('href', '/play?gameId=1');
  });
}); 