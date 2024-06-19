'use client';

import React, { useEffect, useState } from 'react';
import Editor from "@/components/editor/advanced-editor";
import { JSONContent } from "novel";
import Input from '@/components/input/input';
import Dropdown from '@/components/dropdown/dropdown';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addBlog, getBlogById, updateBlog } from '@/api/repositories/blogRepository';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { onUpload } from '@/components/editor/image-upload';
import { useRouter } from 'next/navigation';
import { getCategoryById, updateCategory } from '@/api/repositories/categoriesRepository';
import withAuth from '@/lib/private-routes';

type Props = {};

export type categoriesType = {
    id: number;
    name: string;
};

function Page({ params }: { params: { id: number; }; }) {

    const { data: category, isLoading: isCategoryLoading, error } = useQuery({
        queryKey: ['category', params.id],
        queryFn: () => getCategoryById(params.id)
    });

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
        mutationFn: updateCategory,
        onSuccess: (res) => {
            console.log(res.data);
            toast.info("Category updated successfully");

            router.push('/blogs//categories');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Updating blog post failed';
            console.log(error);

            toast.error(errorMessage);
        },
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const data = JSON.stringify(formData);
        mutate({ data: data, id: params.id }); // Pass an object with data and id
        // You can now send categoryData to your server or API endpoint
    };

    useEffect(() => {
        if (category?.data) {
            try {
                const { name, name_me } = category.data;

                // Parse JSON content
                setFormData({
                    name_me: name_me || '',
                    name: name || '',
                });
            } catch (e) {
                console.error('Error parsing JSON:', e);
            }
        }
    }, [category]);

    if (isCategoryLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading blog data.</div>;

    return (
        <div className='w-2/3 mx-auto mt-5 mb-[100px]'>
            <h1 className='text-center text-[24px] font-semibold'>Edit Blog</h1>
            <form className='w-2/3 mx-auto mt-5 flex flex-col gap-5' onSubmit={handleSubmit}>
                <Input label={'Category name ME'} inputName={'name_me'} value={formData.name_me} onChange={handleInputChange} />
                <Input label={'Category name EN'} inputName={'name'} value={formData.name} onChange={handleInputChange} />
                <button className="mx-auto w-[160px] h-[40px] px-5 flex items-center justify-center gap-2 rounded bg-blue-600 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                > Save Changes</button>
            </form>
        </div>
    );
}

export default withAuth(Page, { allowedRoles: ['owner, admin, moderator'] });
