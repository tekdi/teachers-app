// __tests__/Loader.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../src/components/Loader'; // Adjust the path as necessary

describe('Loader', () => {
//   test('renders the spinner and text when showBackdrop is true', () => {
//     render(<Loader showBackdrop={true} loadingText="Loading" />);
    
//     // Check if the Backdrop is rendered and open
//     const backdrop = screen.getByTestId('backdrop');
//     expect(backdrop).toBeInTheDocument();
//     expect(backdrop).toHaveStyle({ display: 'flex' });

//     // Check if the loading text is displayed
//     expect(screen.getByText('Loading...')).toBeInTheDocument();
//   });

//   test('renders only the spinner and text when showBackdrop is false', () => {
//     render(<Loader showBackdrop={false} loadingText="Loading" />);

//     // Check if the Backdrop is not rendered
//     const backdrop = screen.queryByTestId('backdrop');
//     expect(backdrop).not.toBeInTheDocument();

//     // Check if the loading text is displayed
//     expect(screen.getByText('Loading...')).toBeInTheDocument();
//   });

  test('renders default loadingText if not provided', () => {
    render(<Loader showBackdrop={true} />);

    // Check if the default loading text is displayed
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
