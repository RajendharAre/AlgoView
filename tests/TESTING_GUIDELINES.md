# Algorithm Visualizer Testing Guidelines

## Overview

This document provides comprehensive guidelines for testing the Algorithm Visualizer application. The testing strategy includes unit tests, integration tests, and end-to-end tests to ensure the application functions correctly and reliably.

## Testing Framework

The application uses the following testing tools:

- **Vitest**: Fast unit test framework
- **React Testing Library**: For testing React components
- **JSDOM**: For browser-like testing environment
- **@testing-library/jest-dom**: Custom Jest matchers for DOM assertions

## Test Structure

```
tests/
├── unit/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Navbar.test.jsx
│   │   │   └── Sidebar.test.jsx
│   │   ├── MainApp.test.jsx
│   │   └── pages/
│   │       └── DSA.test.jsx
│   ├── store/
│   │   ├── store.test.js
│   │   └── slices/
│   │       ├── userSlice.test.js
│   │       ├── algorithmSlice.test.js
│   │       └── uiSlice.test.js
│   └── utils/
├── integration/
│   └── navigation.test.jsx
└── e2e/
```

## Test Categories

### 1. Unit Tests

Unit tests focus on individual components, functions, and Redux slices.

#### Component Tests
- Test rendering of components with different props
- Test user interactions and event handling
- Test conditional rendering logic
- Mock external dependencies

#### Redux Slice Tests
- Test initial state
- Test synchronous reducers
- Test asynchronous thunks (pending, fulfilled, rejected states)
- Test state transitions

#### Utility Function Tests
- Test pure functions with various inputs
- Test edge cases and error conditions

### 2. Integration Tests

Integration tests verify that multiple units work together correctly.

#### Navigation Tests
- Test page navigation functionality
- Test route protection
- Test navigation reload behavior

#### Authentication Flow Tests
- Test login/logout flows
- Test registration flow
- Test social authentication

#### State Management Tests
- Test Redux store integration
- Test state persistence
- Test state synchronization

### 3. End-to-End Tests

End-to-end tests simulate real user scenarios.

#### User Authentication Tests
- Test complete login flow
- Test registration and email verification
- Test password reset flow

#### Algorithm Visualization Tests
- Test algorithm selection
- Test visualization controls
- Test step navigation

#### Page Navigation Tests
- Test all navigation paths
- Test protected route access
- Test 404 page handling

## Test Execution

### Running Tests

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui
```

### Test Coverage

The goal is to achieve the following coverage:
- Component rendering: 100%
- State management: 100%
- Business logic: 100%
- Navigation: 100%
- Error handling: 100%

## Best Practices

### 1. Test Structure
- Follow the Arrange-Act-Assert pattern
- Use descriptive test names
- Test one behavior per test
- Keep tests independent

### 2. Mocking
- Mock external dependencies (APIs, Firebase, etc.)
- Use factory functions for complex mock data
- Mock only what's necessary
- Clean up mocks between tests

### 3. Assertions
- Use specific assertions
- Test for expected outcomes, not implementation details
- Test both positive and negative cases
- Use custom matchers when appropriate

### 4. Test Data
- Use realistic test data
- Create test data factories
- Test edge cases
- Test error conditions

## Common Testing Patterns

### 1. Component Testing
```javascript
import { render, screen } from '@testing-library/react'

it('renders component with correct text', () => {
  render(<Component />)
  expect(screen.getByText('Expected Text')).toBeInTheDocument()
})
```

### 2. Redux Slice Testing
```javascript
import slice, { action } from './slice'

it('handles action correctly', () => {
  const initialState = { /* ... */ }
  const actionResult = slice(initialState, action(payload))
  expect(actionResult).toEqual(expectedState)
})
```

### 3. Async Thunk Testing
```javascript
import { asyncThunk } from './slice'

it('handles fulfilled state', async () => {
  const dispatch = vi.fn()
  const getState = vi.fn()
  
  await asyncThunk(payload)(dispatch, getState, undefined)
  
  expect(dispatch).toHaveBeenCalledWith(expectedAction)
})
```

## Test Maintenance

### 1. Updating Tests
- Update tests when component APIs change
- Add tests for new features
- Remove obsolete tests
- Refactor tests for better maintainability

### 2. Test Debugging
- Use console.log for debugging (remove before committing)
- Use breakpoints in test files
- Check test coverage reports
- Verify mock implementations

## Continuous Integration

Tests are automatically run in the CI pipeline to ensure:
- All tests pass before merging
- Code coverage meets minimum requirements
- No regressions are introduced
- Performance benchmarks are maintained

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Check file paths
   - Verify file extensions
   - Ensure proper mocking

2. **Async Test Failures**
   - Use `await` for async operations
   - Use `act()` for React state updates
   - Check promise resolutions

3. **Mock Issues**
   - Verify mock implementations
   - Check mock cleanup
   - Ensure proper mock restoration

### Debugging Tips

1. **Run specific tests**
   ```bash
   npm run test -- testNamePattern
   ```

2. **Enable verbose logging**
   ```bash
   npm run test -- --verbose
   ```

3. **Generate coverage reports**
   ```bash
   npm run test -- --coverage
   ```

## Conclusion

Following these guidelines ensures comprehensive test coverage and maintains high-quality code. Regular testing helps catch bugs early and provides confidence in code changes.