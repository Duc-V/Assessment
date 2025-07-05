import { render, screen } from '@testing-library/react'
import LoadingScreen from '../../components/LoadingScreen'

describe('LoadingScreen', () => {
  it('renders with default props', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    render(<LoadingScreen message="Please wait..." />)
    expect(screen.getByText('Please wait...')).toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingScreen size="sm" />)
    let loader = screen.getByTestId('loader')
    expect(loader).toHaveClass('w-4', 'h-4')

    rerender(<LoadingScreen size="md" />)
    loader = screen.getByTestId('loader')
    expect(loader).toHaveClass('w-6', 'h-6')

    rerender(<LoadingScreen size="lg" />)
    loader = screen.getByTestId('loader')
    expect(loader).toHaveClass('w-8', 'h-8')
  })
}) 