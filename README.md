[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=tekdi_teachers-app&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=tekdi_teachers-app)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=tekdi_teachers-app&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=tekdi_teachers-app)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=tekdi_teachers-app&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=tekdi_teachers-app)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=tekdi_teachers-app&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=tekdi_teachers-app)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=tekdi_teachers-app&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=tekdi_teachers-app)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=tekdi_teachers-app&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=tekdi_teachers-app)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=tekdi_teachers-app&metric=bugs)](https://sonarcloud.io/summary/new_code?id=tekdi_teachers-app)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=tekdi_teachers-app&metric=coverage)](https://sonarcloud.io/summary/new_code?id=tekdi_teachers-app)

# Shiksha: Teachers Application

## What is Shiksha?

Shiksha is a next-generation scalable open-source learning solution for teachers. It provides a comprehensive platform for teachers to manage classes, track attendance, assess student performance, and plan courses effectively.

## Overview

This application is built with Next.js and provides a robust suite of tools for educational management, including:

- Dashboard for metrics and analytics
- Attendance tracking and reporting
- Course planning and curriculum management
- Student assessment and performance tracking
- User management for teachers, facilitators, and learners
- Center/school management

## Tech Stack

- **Frontend Framework**: Next.js (React)
- **State Management**: Zustand
- **UI Components**: Material UI
- **Form Handling**: React JSON Schema Form (RJSF)
- **Data Fetching**: Axios, React Query
- **Analytics**: Google Analytics, Telemetry SDK
- **Internationalization**: i18next
- **Testing**: Jest, Cypress

## Project Structure

```
shiksha-teachers-app/
├── src/                      # Source code
│   ├── @types/               # TypeScript type definitions
│   ├── assets/               # Static assets (images, fonts)
│   ├── components/           # Reusable React components
│   │   ├── blocks/           # Composable block components
│   │   ├── center/           # Center/school related components
│   │   ├── common/           # Common utility components
│   │   └── form/             # Form-related components
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Next.js pages
│   │   ├── api/              # API routes
│   │   ├── assessments/      # Assessment-related pages
│   │   ├── centers/          # Center management pages
│   │   └── learner/          # Learner profile pages
│   ├── services/             # API service layers
│   ├── store/                # State management
│   ├── styles/               # Global styles and themes
│   └── utils/                # Utility functions and constants
│       └── hoc/              # Higher-order components
├── public/                   # Public assets
├── types/                    # Global TypeScript types
├── __tests__/                # Test files
├── cypress/                  # End-to-end tests
├── jest.config.ts            # Jest configuration
└── next.config.mjs           # Next.js configuration
```

## Prerequisites

### System Requirements

<table>
  <tr>
    <td colspan="2"><b>System Requirements</b></td>
  </tr>
  <tr>
    <td><b>Operating System</b></td>
    <td>Windows 7 and above/4.2 Mac OS X 10.0 and above/Linux</td>
  </tr>
  <tr>
    <td><b>RAM</b></td>
    <td>≥ 8 GB</td>
  </tr>
  <tr>
    <td><b>CPU</b></td>
    <td>2 cores, > 2 GHz</td>
  </tr>
</table>

### Software Dependencies

| Software                                                                              | Version                                                 |
| :------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| **[Node.js](https://nodejs.org/en/download/)**                                        | ≥ 18.19.0 (or latest LTS version)                       |
| **[npm](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager)** | ≥ 10.2.3                                    |

## Getting Started

### Project Setup

1. Clone the repository
   ```bash
   git clone https://github.com/tekdi/shiksha-frontend.git
   cd shiksha-frontend
   git checkout shiksha-2.0
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Create a `.env.local` file in the root directory
   - Use the `.env-sample` file as a reference
   - Required environment variables:
     ```
     NEXT_PUBLIC_BASE_URL=<API_BASE_URL>
     NEXT_PUBLIC_TELEMETRY_URL=<TELEMETRY_SERVICE_URL>
     NEXT_PUBLIC_MEASUREMENT_ID=<GOOGLE_ANALYTICS_ID>
     ```

### Running the Application

#### Development Mode
```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000)

#### Production Build
```bash
npm run build
npm start
```

### Testing

#### Unit Tests
```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate test coverage report
```

#### End-to-End Tests
```bash
npm run cypress:open    # Open Cypress test runner
```

### Code Quality Tools

```bash
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run prettier       # Format code with Prettier
npm run lint:css       # Run stylelint for CSS/SCSS
npm run lint:css:fix   # Fix stylelint issues
```

## Key Features

### Dashboard
The dashboard provides an overview of key metrics including attendance statistics, course progress, and student performance.

### Attendance Management
- Mark attendance for individual or multiple students
- View attendance history
- Generate attendance reports
- Track attendance patterns and identify low attendance students

### Course Planning
- Create and manage course plans
- Track curriculum progress
- Organize topics and sessions

### Assessment
- Create and manage assessments
- Track student performance
- Generate assessment reports

### User Management
- Manage teachers, facilitators, and learners
- User authentication and authorization
- Role-based access control

## Contributing

We welcome contributions to improve Shiksha! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Conventions

- Follow the existing code style and structure
- Write tests for new features
- Update documentation for any changes
- Use meaningful commit messages

### Development Workflow

1. Pick an issue from the issue tracker or create a new one
2. Discuss the approach in the issue
3. Implement the changes
4. Add tests and documentation
5. Submit a pull request

## License

This project is licensed under the [LICENSE_NAME] - see the LICENSE file for details.

## Acknowledgments

- The Sunbird ecosystem for providing foundation components
- All contributors who have helped make this project better
