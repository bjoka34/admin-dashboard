'use client';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getUsers } from '@/api/repositories/usersRepository';
import withAuth from '@/lib/private-routes';

type Props = {};

const page = (props: Props) => {
    const router = useRouter();
    const { data: users, isLoading: isBlogsLoading, error } = useQuery({
        queryKey: [],
        queryFn: () => getUsers()
    });

    console.log(users);


    const IsLoading = () => {
        if (isBlogsLoading) {
            return (
                <p>Loading...</p>
            );
        }
    };

    return (
        <div>
            <IsLoading />
            {
                users && users.data.length > 0 &&
                users?.data.map((user: any, index: number) => {
                    return (
                        <div onClick={() => router.push(`/user/${user.id}`)} key={index}>{user.username}</div>
                    );
                })
            }
        </div>
    );
};

export default withAuth(page, { allowedRoles: ['owner, admin, moderator'] });
