# AlgoView Testing Guidelines

## Overview

This document provides comprehensive guidelines for testing the AlgoView application. The testing strategy includes unit tests, integration tests, and end-to-end tests to ensure the application functions correctly and reliably.

## Testing Framework

The application uses the following testing tools:

- **Vitest**: Fast unit test framework
- **React Testing Library**: For testing React components
- **JSDOM**: For browser-like testing environment
- **@testing-library/jest-dom**: Custom Jest matchers for DOM assertions

## Test Structure

```
This file was removed during repository cleanup. Keep only the root README.md as documentation.
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