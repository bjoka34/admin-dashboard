'use client';
import { deleteCategory, getCategories } from '@/api/repositories/categoriesRepository';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import { TbCategoryMinus } from "react-icons/tb";
import withAuth from '@/lib/private-routes';

type Props = {};

const page = (props: Props) => {
    const { data: categories, isLoading: isCategoriesLoading, error, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories()
    });

    const { mutate, status } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: (res) => {
            refetch();
            toast.info("Category deleted successfully");

        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'ERROR: Category was not deleted';

            toast.error(errorMessage);
        },
    });


    const handleDelete = (id: number) => {
        mutate(id);
        console.log(`Delete blog with id: ${id}`);
    };


    return (
        <div className='p-5'>
            <h1 className='font-semibold text-[28px] text-center'>Categories</h1>
            <div className='flex justify-end px-[150px]'>
                <Link href="/blogs/categories/add">
                    <button className="w-[160px] h-[40px] px-5 flex items-center justify-center gap-2 rounded bg-blue-600 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                    ><FaPlus /> Add new Category</button>
                </Link>
            </div>
            <div className='mt-[100px] mx-auto w-2/3'>
                {
                    !isCategoriesLoading && categories?.data.map((category: any, index: number) => {

                        return (
                            <li key={category.name} className="flex justify-between gap-x-6 py-5 shadow-sm items-center">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auto">
                                        <TbCategoryMinus className='text-[24px] mb-2' />
                                        <p className="text-sm font-semibold leading-6 dark:text-white text-gray-900">{category.name}</p>
                                    </div>
                                </div>
                                <div className='flex gap-5'>
                                    <Link className='h-[30px]' href={`/blogs/categories/edit/${category.id}`}>
                                        <button
                                            type="button"
                                            className="w-[80px] h-[40px] flex items-center justify-center gap-2 rounded bg-primary text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:text-black dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">
                                            Edit
                                            <FaEdit />
                                        </button>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(category.id)}
                                        className="w-[80px] h-[40px] flex items-center justify-center gap-2 rounded bg-primary text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:text-black dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">
                                        Delete
                                        <FaTrash />
                                    </button>
                                </div>
                            </li>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default withAuth(page, { allowedRoles: ['owner, admin'] });
