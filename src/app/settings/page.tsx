'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { logout, updateUser, setError } from '../../redux/slices/userSlice';
import withAuth from '@/lib/private-routes';

const UserComponent: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const error = useSelector((state: RootState) => state.user.error);
    const dispatch = useDispatch<AppDispatch>();
    console.log(isAuthenticated);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleUpdateUser = () => {
        const updatedUser = { name: 'Jane Doe' };
        dispatch(updateUser(updatedUser));
    };

    const handleError = () => {
        dispatch(setError('An error occurred'));
    };

    return (
        <div>
            <h1>User Management</h1>
            <div>
                <p>Name: {user?.name}</p>
                <p>Email: {user?.email}</p>
                {user?.admin && <p>Role: Admin</p>}
                <button onClick={handleUpdateUser}>Update User</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default withAuth(UserComponent, { allowedRoles: ['owner, admin, moderator'] });
