import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import DSA from '../../../src/pages/DSA'

// 🧩 Mock Sidebar
vi.mock('../../../src/components/Layout/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar Component</div>
}))

// 🧩 Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => <div>{children}</div>
}))

// 🧩 Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Cpu: () => <div data-testid="cpu-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
  Shuffle: () => <div data-testid="shuffle-icon" />,
  Search: () => <div data-testid="search-icon" />,
  GitBranch: () => <div data-testid="git-branch-icon" />,
  Binary: () => <div data-testid="binary-icon" />,
  BarChart: () => <div data-testid="bar-chart-icon" />,
  Database: () => <div data-testid="database-icon" />,
  Lock: () => <div data-testid="lock-icon" />
}))

// 🧩 Mock react-router-dom once (and control useLocation dynamically)
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: vi.fn()
  }
})

const mockUseLocation = vi.mocked(useLocation)

// 🧩 Mock Redux store
const createMockStore = () =>
  configureStore({
    reducer: {
      user: (state = { currentUser: null, loading: false, error: null }) => state
    }
  })

describe('DSA Page', () => {
  let store

  beforeEach(() => {
    store = createMockStore()
    vi.clearAllMocks()
  })

  it('renders DSA page with welcome message when no algorithm is selected', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dsa' })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DSA />
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByText('Data Structures & Algorithms')).toBeInTheDocument()
  })

  it('renders sidebar component', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dsa' })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DSA />
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })

  it('shows collapsed sidebar icons when on visualization page', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/dsa/visualization/sorting/bubble'
    })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DSA />
        </BrowserRouter>
      </Provider>
    )

    const menuIcons = screen.getAllByTestId('menu-icon')
    expect(menuIcons.length).toBeGreaterThan(0)
  })
})
