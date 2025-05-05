# Shiksha Teachers App Architecture

This document provides an overview of the Shiksha Teachers App architecture, explaining the key components, data flow, and design decisions.

## Application Architecture

Shiksha Teachers App is built using Next.js, a React framework that provides server-side rendering, static site generation, and API routes. The application follows a component-based architecture with state management via Zustand.

### High-Level Architecture

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  UI Components   |<--->|  State/Services  |<--->|   External APIs  |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
```

## Key Technologies

- **Next.js**: React framework for rendering and routing
- **TypeScript**: For type safety across the application
- **Material UI**: Component library for UI elements
- **Zustand**: State management
- **Axios**: HTTP client for API requests
- **React Query**: Data fetching and caching
- **i18next**: Internationalization
- **Jest & React Testing Library**: Testing framework

## Project Structure

### Core Directories

- **/src/components**: Reusable UI components
- **/src/pages**: Next.js pages and routing
- **/src/services**: API service layers
- **/src/utils**: Utility functions, helpers, and interfaces
- **/src/store**: State management
- **/src/hooks**: Custom React hooks
- **/src/styles**: Global styles and themes

### Data Flow

```
+-----------------+     +----------------+     +----------------+
|                 |     |                |     |                |
| User Interaction|---->| Component      |---->| Service Layer  |
|                 |     | (React/State)  |     | (API Calls)    |
+-----------------+     +----------------+     +----------------+
                                                       |
                                                       v
+-----------------+     +----------------+     +----------------+
|                 |     |                |     |                |
| UI Update       |<----| State Update   |<----| External API   |
|                 |     |                |     |                |
+-----------------+     +----------------+     +----------------+
```

## Key Components

### Pages

The `/src/pages` directory contains the main application pages, following Next.js conventions:

- **_app.tsx**: Application entry point with global providers
- **dashboard.tsx**: Main dashboard with analytics
- **attendance-overview.tsx**: Overview of attendance statistics
- **course-planner.tsx**: Curriculum and course planning

### Components

The application uses a component-based architecture with reusable components:

- **Form Components**: Input fields, selectors, and form utilities
- **Common Components**: Headers, loaders, modals
- **Specialized Components**: Attendance tracking, student cards, assessment reports

## Data Management

### State Management

Zustand is used for global state management, with stores for:
- User authentication
- UI state (themes, modals)
- Attendance data
- Course planning

### API Services

The `/src/services` directory contains service modules for API interactions:
- Authentication services
- Attendance tracking
- Course planning
- User management

## Authentication & Authorization

The application uses token-based authentication, storing user tokens in local storage. Routes are protected using Higher Order Components (HOCs) that check for valid authentication before rendering protected pages.

## Core Features Implementation

### Attendance Tracking

Attendance tracking is implemented with the following components:
- **MarkAttendance.tsx**: UI for marking individual attendance
- **MarkBulkAttendance.tsx**: Bulk attendance operations
- **AttendanceDetails.tsx**: Detailed attendance reports
- **AttendanceHistory.tsx**: Historical attendance data

Data flow:
1. Teacher selects class/cohort
2. Attendance UI displays student list
3. Teacher marks attendance
4. Data is sent to API via service layer
5. UI updates to reflect changes

### Course Planning

Course planning features include:
- **CoursePlannerCards.tsx**: Visual display of course plans
- **TopicDetails.tsx**: Details for specific topics
- **CourseAccordion.tsx**: Expandable course content

### User Management

User management includes:
- **AddFacilitator.tsx**: Adding new teachers/facilitators
- **ManageUser.tsx**: User management interface
- **AddLeanerModal.tsx**: Adding new students

## Performance Considerations

- React Query is used for data fetching and caching to reduce API calls
- Component memoization for expensive renders
- Lazy loading for less critical components

## Extensibility

The application is designed to be extended:
- New components can be added to the component directories
- New pages follow Next.js conventions
- Services can be expanded for new API endpoints

## Testing Strategy

- Unit tests for utility functions
- Component tests for UI components
- Integration tests for component interactions
- End-to-end tests for critical flows

## Future Architecture Considerations

Areas for architectural improvement:
- Migration to Next.js App Router
- Enhanced state management with more granular stores
- Improved API error handling and retry mechanisms
- Micro-frontend architecture for larger scale 