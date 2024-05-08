import { useEffect } from 'react';
import { useRouter } from 'next/router';

function Logout() {
  const router = useRouter();
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('parentCohortId');

    router.push('/');
  }, []);

  return '';
}

export default Logout;
