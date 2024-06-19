'use client';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteBlog, getBlogs } from '../../api/repositories/blogRepository';
import { useRouter } from 'next/navigation';
import { FaPlus } from "react-icons/fa6";
import Blogs from '@/components/blogs/blogs';
import Link from 'next/link';
import { toast } from 'sonner';
import withAuth from '@/lib/private-routes';

type Props = {};

const page = (props: Props) => {
    const [tags, setTags] = useState("all");
    const [categories, setCategories] = useState("all");
    const router = useRouter();


    const { data: blogs, isLoading: isBlogsLoading, error, refetch } = useQuery({
        queryKey: ['blog_page'],
        queryFn: () => getBlogs(categories, tags)
    });

    const { mutate, status } = useMutation({
        mutationFn: deleteBlog,
        onSuccess: (res: any) => {
            console.log(res.data);
            toast.info("Blog post deleted successfully");
            refetch(); // Refetch the blogs data after deletion
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Deleting blog post failed';
            console.log(error);

            toast.error(errorMessage);
        },
    });

    const IsLoading = () => {
        if (isBlogsLoading) {
            return (
                <p>Loading...</p>
            );
        }
    };

    return (
        <div className='mt-[50px]'>
            <div className='flex justify-end px-[150px]'>
                <Link href="/blogs/add">
                    <button className="w-[160px] h-[40px] px-5 flex items-center justify-center gap-2 rounded bg-blue-600 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                    ><FaPlus /> Add new Blog</button>
                </Link>
            </div>
            <IsLoading />
            {blogs && blogs.data.length > 0 && <Blogs blogs={blogs} mutate={mutate} />}
        </div>

    );
};

export default withAuth(page, { allowedRoles: ['owner, admin, moderator'] });
