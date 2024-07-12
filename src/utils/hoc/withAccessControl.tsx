import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useStore from '@/store/store';
import { Role } from '../app.constant';

const withAccessControl =
  (action: string, accessControl: { [key: string]: Role[] }) =>
  (Component: React.ComponentType<any>) => {
    return (props: any) => {
      const store = useStore();
      const userRole = store.userRole;
      const router = useRouter();

      useEffect(() => {
        if (!userRole || !accessControl[action]?.includes(userRole)) {
          router.replace('/unauthorized');
        }
      }, [userRole, action, router]);

      if (!userRole || !accessControl[action]?.includes(userRole)) {
        return null;
      }

      return <Component {...props} />;
    };
  };

export default withAccessControl;
