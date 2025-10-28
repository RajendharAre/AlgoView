import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MainApp from '../../../src/components/MainApp'

// Mock the Navbar component
vi.mock('../../../src/components/Layout/Navbar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">Navbar Component</div>
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => <div>{children}</div>
}))

describe('MainApp Component', () => {
  it('renders MainApp with Navbar and main content area', () => {
    render(
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    )

    // Check if Navbar is rendered
    expect(screen.getByTestId('navbar')).toBeInTheDocument()

    // Check if main content area is rendered
    expect(screen.getByText('Algorithm Visualizer')).toBeInTheDocument()
  })

  it('applies correct CSS classes for layout', () => {
    render(
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    )

    // Check if the main app container has the correct classes
    const mainApp = screen.getByText('Algorithm Visualizer').closest('div')
    expect(mainApp).toHaveClass('flex', 'flex-col', 'min-h-screen', 'bg-gray-50')
  })

  it('applies padding to main content area', () => {
    render(
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    )

    // Check if main content has top padding to account for fixed navbar
    const mainContent = screen.getByText('Algorithm Visualizer').closest('main')
    expect(mainContent).toHaveClass('flex-1', 'pt-16')
  })
})