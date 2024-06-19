'use client';
import React from 'react';
import SideMenu from '@/components/side-menu';
import withAuth from '@/lib/private-routes';

type Props = {};

const page = (props: Props) => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <SideMenu />
        </main>
    );
};

export default withAuth(page, { allowedRoles: ['owner, admin, moderator'] });
