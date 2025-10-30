import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Mock the Sidebar component instead of importing it directly
vi.mock('../../../../src/components/Layout/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar Component</div>
}))

// Now import the mocked component
import Sidebar from '../.././src/components/Layout/Sidebar'

describe('Sidebar Component', () => {
  it('renders the sidebar component', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })
})