import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { TENANT_DATA } from '../../app.config';

const withRole =
  (allowedRole: string) => (WrappedComponent: React.ComponentType) => {
    return (props: any) => {
      const router = useRouter();

      useEffect(() => {
        const role = localStorage.getItem(TENANT_DATA.TENANT_NAME);

        if (role !== allowedRole) {
          router.push('/');
        }
      }, []);

      return <WrappedComponent {...props} />;
    };
  };

export default withRole;
