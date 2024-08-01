import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useStore from '@/store/store';
import { Role } from '../app.constant';

const withAccessControl =
  (action: string, accessControl: { [key: string]: Role[] }) =>
  (Component: React.ComponentType<any>) => {
    const WrappedComponent = (props: any) => {
      const store = useStore();
      const userRole = store.userRole;
      const router = useRouter();

      useEffect(() => {
        console.log('userRole', userRole);
        if (userRole === '') {
          router.replace('/logout');
          return;
        }
        if (!userRole || !accessControl[action]?.includes(userRole)) {
          router.replace('/unauthorized');
        }
      }, [userRole, action, router]);

      if (!userRole || !accessControl[action]?.includes(userRole)) {
        return null;
      }

      return <Component {...props} />;
    };

    // Setting the display name for better debugging and developer tools
    WrappedComponent.displayName = `withAccessControl(${Component.displayName ?? Component.name ?? 'Component'})`;

    return WrappedComponent;
  };

export default withAccessControl;