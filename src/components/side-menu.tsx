'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Link from 'next/link';

type Props = {};

const SideMenu = (props: Props) => {
    const userRole = useSelector((state: RootState) => state.user.user?.admin);
    console.log(userRole);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const RenderLinks = () => {
        if (!isClient) return null; // Render nothing on the server

        if (userRole === "owner") {
            return (
                <div className='flex flex-wrap gap-[50px] justify-center'>
                    <Link className='w-[300px] h-[150px] shadow-md border-solid border-2 border-black-600 text-[24px] font-semibold p-4 hover:scale-105 transition-all' href="/blogs">Blogs</Link>
                    <Link className='w-[300px] h-[150px] shadow-md border-solid border-2 border-black-600 text-[24px] font-semibold p-4 hover:scale-105 transition-all' href="/websites">Websites</Link>
                    <Link className='w-[300px] h-[150px] shadow-md border-solid border-2 border-black-600 text-[24px] font-semibold p-4 hover:scale-105 transition-all' href="/users">Users</Link>
                    <Link className='w-[300px] h-[150px] shadow-md border-solid border-2 border-black-600 text-[24px] font-semibold p-4 hover:scale-105 transition-all' href="/settings">Settings</Link>
                </div>
            );
        }

        if (userRole === "admin") {
            return (
                <>
                    <div className='flex flex-wrap gap-[50px] justify-center'>
                        <Link className='w-[300px] h-[150px] shadow-md border-solid border-2 border-black-600 text-[24px] font-semibold p-4 hover:scale-105 transition-all' href="/blogs">Blogs</Link>
                        <Link className='w-[300px] h-[150px] shadow-md border-solid border-2 border-black-600 text-[24px] font-semibold p-4 hover:scale-105 transition-all' href="/users">Users</Link>
                        <Link className='w-[300px] h-[150px] shadow-md border-solid border-2 border-black-600 text-[24px] font-semibold p-4 hover:scale-105 transition-all' href="/settings">Settings</Link>
                    </div>
                </>
            );
        }

        if (userRole === "moderator") {
            return (
                <>
                    <div className='flex flex-wrap gap-[50px] justify-center'>
                        <Link className='w-[300px] h-[150px] shadow-md border-solid border-2 border-black-600 text-[24px] font-semibold p-4 hover:scale-105 transition-all' href="/blogs">Blogs</Link>
                        <Link className='w-[300px] h-[150px] shadow-md border-solid border-2 border-black-600 text-[24px] font-semibold p-4 hover:scale-105 transition-all' href="/settings">Settings</Link>
                    </div>
                </>
            );
        }

        return null;
    };

    return (
        <nav>

            <div>
                <RenderLinks />
            </div>
        </nav>
    );
};

export default SideMenu;
