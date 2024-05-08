import React, { useState } from 'react';

import { I18nextProvider } from 'react-i18next';
// Import necessary modules
import dynamic from 'next/dynamic';
import i18n from '../i18n';

// Define the type for props
interface TemporaryDrawerProps {
  toggleDrawer: (newOpen: boolean) => () => void;
}

// Import dynamic components
const Login = dynamic(() => import('./Login'), { ssr: false });
const TemporaryDrawer = dynamic(() => import('./LeftDrawer'), { ssr: false });

// Define the Home component
const Home: React.FC = () => {
  // State for controlling drawer open/close
  const [open, setOpen] = useState(false);

  // Function to toggle drawer state
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // Log 'hi' to console
  // console.log('hi');

  return (
    <>
      {/* I18nextProvider for internationalization */}
      <I18nextProvider i18n={i18n}>
        {/* Render the TemporaryDrawer and Login components */}
        <TemporaryDrawer toggleDrawer={toggleDrawer} open={open} />
        <Login toggleDrawer={toggleDrawer} open={open} />
      </I18nextProvider>
    </>
  );
};

export default Home;
