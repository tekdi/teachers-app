import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { logout } from '../services/LoginService';
import { telemetryFactory } from '@/utils/telemetry';
import ReactGA from 'react-ga4';

function Logout() {
  const router = useRouter();
  useEffect(() => {
    const userLogout = async () => {
      const telemetryInteract = {
        context: {
          env: 'sign-out',
          cdata: [],
        },
        edata: {
          id: 'logout-success',
          type: 'CLICK',
          subtype: '',
          pageid: 'sign-out',
          uid: 'id',

          studentid: localStorage.getItem('userId'),

          userName: 'userName',

          grade: 'grade',

          medium: 'medium',

          board: 'board',
        },
      };
      telemetryFactory.interact(telemetryInteract);

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('userId')
        if (refreshToken) {
          await logout(refreshToken);
          ReactGA.event('logout-success', {
            userId: userId
          });
        }
      } catch (error) {
        console.log(error);
        ReactGA.event('logout-fail', {
          error: error
        });
      }
    };
    userLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('parentCohortId');
    localStorage.removeItem('learnerId');
    localStorage.removeItem('classId');

    router.replace('/login');
  }, []);

  return '';
}

export default Logout;
