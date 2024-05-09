import React from 'react';
// Import necessary modules
import dynamic from 'next/dynamic';

// Define the type for props

// Import dynamic components
const Login = dynamic(() => import('./Login'), { ssr: false });
const Dashboard = dynamic(() => import('./Dashboard'), { ssr: false });

// Define the Home component
const Home: React.FC = () => {
  // State for controlling drawer open/close

  // Function to toggle drawer state

  // Log 'hi' to console
  // console.log('hi');

  return (
    <>
      <Login />
    </>
  );
};

export default Home;
