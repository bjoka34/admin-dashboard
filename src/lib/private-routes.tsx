import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useRouter } from 'next/navigation';

interface WithAuthOptions {
    allowedRoles: string[];
}

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>, options: WithAuthOptions) => {
    const AuthComponent: React.FC<P> = (props) => {
        const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
        const userRole = useSelector((state: RootState) => state.user.user?.admin);
        const router = useRouter();
        console.log(userRole);

        if (!isAuthenticated) {
            router.push("/");
            return null;
        } else if (userRole && !options.allowedRoles[0].includes(userRole)) {
            router.push("/");
            return null;
        }
        console.log(userRole && options.allowedRoles[0].includes(userRole));



        // Check if redirection happened
        if (!isAuthenticated || (userRole && !options.allowedRoles[0].includes(userRole))) {
            return null; // Or return a loading spinner, or a "not authorized" message
        }

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
