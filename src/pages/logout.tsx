import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { logout } from '../services/LoginService';

function Logout() {
  const router = useRouter();
  useEffect(() => {
    const userLogout = async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await logout(refreshToken);
        }
      } catch (error) {
        console.log(error);
      }
    };
    userLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('parentCohortId');
    localStorage.removeItem('learnerId');

    router.replace('/login');
  }, []);

  return '';
}

export default Logout;
