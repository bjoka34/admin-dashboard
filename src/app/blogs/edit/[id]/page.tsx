'use client';

import React, { useEffect, useState } from 'react';
import Editor from "@/components/editor/advanced-editor";
import { JSONContent } from "novel";
import Input from '@/components/input/input';
import Dropdown from '@/components/dropdown/dropdown';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addBlog, getBlogById, updateBlog } from '@/api/repositories/blogRepository';
import { toast } from 'sonner';
import { defaultValue } from "../../../default-value";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { onUpload } from '@/components/editor/image-upload';
import { useRouter } from 'next/navigation';
import withAuth from '@/lib/private-routes';

type Props = {};

interface ProtectedPageProps {
    params: {
        id: number;
    };
}

export type categoriesType = {
    id: number;
    name: string;
};

const categories = [
    {
        id: 1,
        name: 'Sub-Projects',
    },
    {
        id: 2,
        name: 'News',
    }
];

const Page = ({ params }: ProtectedPageProps) => {

    const { data: blog, isLoading: isBlogsLoading, error } = useQuery({
        queryKey: ['blog', params.id],
        queryFn: () => getBlogById(params.id)
    });
    const router = useRouter();

    const [editorValueME, setEditorValueME] = useState<JSONContent>();
    const [editorValueEN, setEditorValueEN] = useState<JSONContent>();

    const user = useSelector((state: RootState) => state.user.user);
    const [selected, setSelected] = useState<categoriesType>(categories[0]);
    const [image, setImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name_me: '',
        name_en: '',
        short_description_me: '',
        short_description_en: '',
    });

    console.log(formData);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const imageURL = await onUpload(file);
                if (typeof imageURL === 'string') {
                    setImage(imageURL); // Safe to set imageURL as string
                    console.log('Uploaded image URL:', imageURL);
                    // Further processing or updating state with imageURL
                } else {
                    throw new Error('Invalid image URL');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                // Handle error
            }
        }
    };

    const { mutate, status } = useMutation({
        mutationFn: updateBlog,
        onSuccess: (res) => {
            console.log(res.data);
            toast.info("Blog post updated successfully");

            router.push('/blogs');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Updating blog post failed';
            console.log(error);

            toast.error(errorMessage);
        },
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!image) {
            return;
        }
        const blogData = {
            name: [{ me: formData.name_me }, { en: formData.name_en }],
            category: selected.name,
            content: [{ en: editorValueEN }, { me: editorValueME }],
            short_description: { en: formData.short_description_en, me: formData.short_description_me },
            cover_image: image,
            author: user?.name
        };
        mutate({ data: blogData, id: params.id }); // Pass an object with data and id
        // You can now send blogData to your server or API endpoint
    };

    useEffect(() => {
        if (blog?.data) {
            try {
                const { content, title, description, category, cover_image } = blog.data;

                // Parse JSON content
                const parsedContent = JSON.parse(content);
                const parsedTitle = JSON.parse(title);
                const parsedDescription = JSON.parse(description);

                // Update states
                setEditorValueME(parsedContent[1]?.me);
                setEditorValueEN(parsedContent[0]?.en);

                setFormData({
                    name_me: parsedTitle[0]?.me || '',
                    name_en: parsedTitle[1]?.en || '',
                    short_description_me: parsedDescription?.me || '',
                    short_description_en: parsedDescription?.en || '',
                });

                setSelected(categories.find(cat => cat.name === category) || categories[0]);
                console.log(cover_image);

                setImage(cover_image);
            } catch (e) {
                console.error('Error parsing JSON:', e);
            }
        }
    }, [blog]);

    if (isBlogsLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading blog data.</div>;

    return (
        <div className='w-2/3 mx-auto mt-5 mb-[100px]'>
            <h1 className='text-center text-[24px] font-semibold'>Edit Blog</h1>
            <form className='w-2/3 mx-auto mt-5 flex flex-col gap-5' onSubmit={handleSubmit}>
                <Input label={'Blog name ME'} inputName={'name_me'} value={formData.name_me} onChange={handleInputChange} />
                <Input label={'Blog name EN'} inputName={'name_en'} value={formData.name_en} onChange={handleInputChange} />
                <div className='relative'>
                    <p className='mb-1'>Choose a category</p>
                    <Dropdown setSelected={setSelected} selected={selected} categories={categories} />
                </div>
                {
                    editorValueEN && editorValueME && (
                        <div>
                            <p>Content ME:</p>
                            <Editor initialValue={editorValueME} onChange={setEditorValueME} />
                            <p>Content EN:</p>
                            <Editor initialValue={editorValueEN} onChange={setEditorValueEN} />
                        </div>
                    )
                }
                <Input label={'Short description ME'} inputName={'short_description_me'} value={formData.short_description_me} onChange={handleInputChange} />
                <Input label={'Short description EN'} inputName={'short_description_en'} value={formData.short_description_en} onChange={handleInputChange} />
                <div>
                    {image && (
                        <div className="mt-4">
                            <img src={image} alt="Uploaded" className="rounded-lg" />
                        </div>
                    )}
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                    <input onChange={handleImageUpload} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                </div>
                <button className="mx-auto w-[160px] h-[40px] px-5 flex items-center justify-center gap-2 rounded bg-blue-600 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                > Save Changes</button>
            </form>
        </div>
    );
};

export default withAuth(Page, { allowedRoles: ['owner, admin, moderator'] });
