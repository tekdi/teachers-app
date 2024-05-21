import React, { useEffect } from 'react';
// Import necessary modules
import { useRouter } from 'next/router';

// const Login = dynamic(() => import('./Login'), { ssr: false });
// const Dashboard = dynamic(() => import('./Dashboard'), { ssr: false });

const Home: React.FC = () => {
  const {  push } = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        push('/dashboard');
      } else {
        push('/login', undefined, { locale: 'en' });
      }
    }
  }, []);

  return (
    <>
      <h1>Hello</h1>
      {/* <Login /> */}
    </>
  );
};

export default Home;
