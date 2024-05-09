import { I18nextProvider } from 'react-i18next';
import React from 'react';
// Import necessary modules
import dynamic from 'next/dynamic';
import i18n from '../i18n';

// Define the type for props
interface TemporaryDrawerProps {
  toggleDrawer: (newOpen: boolean) => () => void;
}

// Import dynamic components
const Login = dynamic(() => import('./Login'), { ssr: false });
// const Dashboard = dynamic(() => import('./Dashboard'), { ssr: false });

// Define the Home component
const Home: React.FC = () => {
  // State for controlling drawer open/close

  // Function to toggle drawer state

  // Log 'hi' to console
  // console.log('hi');

  return (
    <>
      {/* I18nextProvider for internationalization */}
      <I18nextProvider i18n={i18n}>
        {/* Render the TemporaryDrawer and Login components */}

        <Login />
        {/* <Dashboard /> */}
      </I18nextProvider>
    </>
  );
};

export default Home;
