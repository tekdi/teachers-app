# Contributing to Shiksha Teachers App

Thank you for considering contributing to the Shiksha Teachers App! This document outlines the process for contributing to the project and provides guidelines to make the contribution process smooth and effective.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Project Setup](#project-setup)
  - [Development Environment](#development-environment)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Commit Guidelines](#commit-guidelines)
  - [Code Style](#code-style)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please treat all community members with respect and create a positive environment for everyone.

## Getting Started

### Project Setup

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone https://github.com/YOUR_USERNAME/shiksha-frontend.git
   cd shiksha-frontend
   git checkout shiksha-2.0
   ```
3. Add the original repository as an upstream remote
   ```bash
   git remote add upstream https://github.com/tekdi/shiksha-frontend.git
   ```
4. Install dependencies
   ```bash
   npm install
   ```
5. Set up environment variables following the instructions in the README

### Development Environment

Make sure your development environment meets the prerequisites listed in the README:
- Node.js ≥ 18.19.0
- npm ≥ 10.2.3

## How to Contribute

### Reporting Bugs

Before reporting a bug, please check if it has already been reported by searching the existing issues.

When reporting a bug, include:
1. A clear and descriptive title
2. Steps to reproduce the bug
3. Expected behavior
4. Actual behavior
5. Screenshots if applicable
6. Environment details (browser, OS, device)

### Suggesting Enhancements

We welcome suggestions for enhancements. When suggesting a feature:
1. Provide a clear description of the feature
2. Explain why this feature would be useful to most users
3. Provide examples of how this feature would work in practice

### Pull Requests

1. Create a new branch from the `shiksha-2.0` branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Run the tests to ensure your changes don't break existing functionality
   ```bash
   npm test
   ```
4. Run linting checks
   ```bash
   npm run lint
   ```
5. Commit your changes following the [commit guidelines](#commit-guidelines)
6. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a pull request against the `shiksha-2.0` branch of the original repository

## Development Workflow

### Branching Strategy

- `shiksha-2.0`: The main development branch
- `feature/*`: For new features
- `bugfix/*`: For bug fixes
- `docs/*`: For documentation changes
- `refactor/*`: For code refactoring with no feature changes

### Commit Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests in the commit message where appropriate
- Consider using a conventional commit format:
  ```
  <type>(<scope>): <description>
  
  [optional body]
  
  [optional footer]
  ```
  Types include: feat, fix, docs, style, refactor, test, chore

### Code Style

- Follow the existing code style in the project
- Use 2 spaces for indentation
- Use consistent naming conventions
  - React components should use PascalCase (e.g., `StudentCard.tsx`)
  - Utility functions should use camelCase (e.g., `formatDate.ts`)
- Add JSDoc comments to functions, especially those that are exported
- Follow TypeScript best practices, including:
  - Use proper type annotations
  - Avoid using `any` when possible
  - Use interfaces for complex objects

## Testing Guidelines

- Write tests for all new features
- Maintain or improve code coverage with each PR
- Types of tests to include:
  - Unit tests for utility functions and isolated components
  - Integration tests for component interactions
  - End-to-end tests for critical user flows

### Writing Good Tests

1. Test the behavior, not the implementation
2. Keep tests simple and focused
3. Use descriptive test names that explain the expected behavior
4. Set up test data in a way that makes tests easy to understand

## Documentation Guidelines

- Update documentation for any changes to APIs, components, or user flows
- Document complex functions with JSDoc comments
- Include examples for non-trivial components or functions
- Keep README and other documentation up to date

### JSDoc Format

Use the following format for JSDoc comments:

```typescript
/**
 * Brief description of what the function does
 *
 * @param {Type} paramName - Description of parameter
 * @returns {ReturnType} Description of return value
 * @example
 * // Example usage
 * const result = myFunction('example');
 */
```

## Areas for Contribution

Here are some specific areas where contributions are currently needed:

1. **UI/UX Improvements**: Enhance the user interface and experience
2. **Performance Optimization**: Identify and fix performance bottlenecks
3. **Accessibility**: Improve the accessibility of the application
4. **Test Coverage**: Increase test coverage
5. **Documentation**: Improve and expand documentation
6. **Internationalization**: Add or improve translations

## Thank You!

Your contributions help make this project better for everyone. Thank you for your time and effort! 