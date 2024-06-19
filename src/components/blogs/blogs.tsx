import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

interface Props {
    blogs: any;
    mutate: any;
};

const Blogs = ({ blogs, mutate }: Props) => {

    const dateFormatter = (date: string) => {
        const newDate = new Date(date);
        return newDate.toLocaleString('sr-Latn-ME');
    };

    const handleDelete = (id: number) => {
        mutate(id);
        console.log(`Delete blog with id: ${id}`);
    };

    const parseTitle = (data: string) => {
        return JSON.parse(data);
    };

    return (
        <ul role="list" className="divide-y divide-gray-100 w-full px-[150px]">
            {blogs?.data.map((blog: any, index: number) => {
                return (
                    <li key={blog.author} className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="h-12 w-12 flex-none bg-gray-50" src={blog.cover_image} alt="" />
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 dark:text-white text-gray-900">{parseTitle(blog.title)[0].me}</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{blog.category}</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 dark:text-white text-gray-900">{blog.author}</p>
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                Last updated <time dateTime={blog.updatedAt}>{dateFormatter(blog.updatedAt)}</time>
                            </p>

                        </div>
                        <div className='flex gap-5'>
                            <Link className='h-[30px]' href={`/blogs/edit/${blog.id}`}>
                                <button
                                    type="button"
                                    className="w-[80px] h-[40px] flex items-center justify-center gap-2 rounded bg-primary text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:text-black dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">
                                    Edit
                                    <FaEdit />
                                </button>
                            </Link>
                            <button
                                type="button"
                                onClick={() => handleDelete(blog.id)}
                                className="w-[80px] h-[40px] flex items-center justify-center gap-2 rounded bg-primary text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:text-black dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">
                                Delete
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>);
};

export default Blogs;
