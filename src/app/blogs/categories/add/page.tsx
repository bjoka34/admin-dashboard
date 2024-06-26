'use client';

import React, { useState } from 'react';
import Input from '@/components/input/input';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addCategory } from '@/api/repositories/categoriesRepository';
import { useRouter } from 'next/navigation';
import withAuth from '@/lib/private-routes';

type Props = {};

export type categoriesType = {
    id: number;
    name: string;
};


const Page = (props: Props) => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name_me: '',
        name: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    const { mutate, status } = useMutation({
        mutationFn: addCategory,
        onSuccess: (res) => {
            console.log(res.data);
            toast.info("Category post added succesfully");

            router.push('/blogs/categories');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Adding category post failed';
            console.log(error);

            toast.error(errorMessage);

        },
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const data = JSON.stringify(formData);
        mutate(data); // Pass an object with data and id
        // You can now send categoryData to your server or API endpoint
    };

    return (
        <div className='w-2/3 mx-auto mt-5 mb-[100px]'>
            <h1 className='text-center text-[24px] font-semibold'>Add new category</h1>
            <form className='w-2/3 mx-auto mt-5 flex flex-col gap-5' onSubmit={handleSubmit}>
                <Input required={true} label={'Blog name ME'} inputName={'name_me'} value={formData.name_me} onChange={handleInputChange} />
                <Input required={true} label={'Blog name EN'} inputName={'name'} value={formData.name} onChange={handleInputChange} />

                <button className="mx-auto w-[160px] h-[40px] px-5 flex items-center justify-center gap-2 rounded bg-blue-600 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                > Add</button>
            </form>
        </div>
    );
};

export default withAuth(Page, { allowedRoles: ['owner, admin, moderator'] });
