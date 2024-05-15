import React, { useEffect } from 'react';
// Import necessary modules
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// const Login = dynamic(() => import('./Login'), { ssr: false });
// const Dashboard = dynamic(() => import('./Dashboard'), { ssr: false });

const Home: React.FC = () => {
  const { locale, locales, push } = useRouter();

  useEffect(() => {
    push('/login', undefined, { locale: 'en' });
  });

  return (
    <>
      {/* <h1>Hello</h1> */}
      {/* <Login /> */}
    </>
  );
};

export default Home;
