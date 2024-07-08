import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useStore from '@/store/store';
import { Role } from '../app.constant';

const withAccessControl = (requiredRole: Role, accessControl: any) => (Component: React.ComponentType<any>) => {
  return (props: any) => {
    debugger;
    const store = useStore();
    const userRole = store.userRole;  
    const router = useRouter();
    
    useEffect(() => {
      if (!userRole || !accessControl[requiredRole]?.includes(userRole)) {
        router.replace('/unauthorized'); // Redirect to an unauthorized page
      }
    }, [userRole, requiredRole, router]);

    if (!userRole || !accessControl[requiredRole]?.includes(userRole)) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
};

export default withAccessControl;
