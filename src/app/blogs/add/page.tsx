'use client';

import React, { useEffect, useState } from 'react';
import { defaultValue } from "../../default-value";
import Editor from "@/components/editor/advanced-editor";
import { JSONContent } from "novel";
import Input from '@/components/input/input';
import Dropdown from '@/components/dropdown/dropdown';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addBlog, getBlogs } from '@/api/repositories/blogRepository';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { onUpload } from '@/components/editor/image-upload';
import { getCategories } from '@/api/repositories/categoriesRepository';
import withAuth from '@/lib/private-routes';
import DropdownRelated from '@/components/dropdown/dropdownRelated';

type Props = {};

type Categories = {
    id: number,
    name: string;
};

const Page = (props: Props) => {
    const router = useRouter();
    const [editorValueME, setEditorValueME] = useState<JSONContent>(defaultValue);
    const [editorValueEN, setEditorValueEN] = useState<JSONContent>(defaultValue);
    const user = useSelector((state: RootState) => state.user.user);
    const [selected, setSelected] = useState<Categories>({
        id: -1,
        name: "Loading..."
    });
    const [selected2, setSelected2] = useState({
        id: -1,
        name: "Loading..."
    });
    const [singleImage, setSingleImage] = useState<string | null>(null);
    const [multipleImages, setMultipleImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name_me: '',
        name_en: '',
        video: "",
        short_description_me: '',
        short_description_en: '',
    });

    const { data: categories, isLoading: isCategoriesLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories()
    });

    const { data: blogs, isLoading: isBlogsLoading, error: errorBlogs } = useQuery({
        queryKey: ['blogs'],
        queryFn: () => getBlogs("Sub-Projects", "all")
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSingleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const imageURL = await onUpload(file);
                if (typeof imageURL === 'string') {
                    setSingleImage(imageURL); // Safe to set imageURL as string
                    console.log('Uploaded single image URL:', imageURL);
                } else {
                    throw new Error('Invalid image URL');
                }
            } catch (error) {
                console.error('Error uploading single image:', error);
            }
        }
    };

    const handleMultipleImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const uploadedImages: string[] = [];
            const filesArray = Array.from(files); // Convert FileList to an array
            for (const file of filesArray) {
                try {
                    const imageURL = await onUpload(file);
                    if (typeof imageURL === 'string') {
                        uploadedImages.push(imageURL);
                    } else {
                        throw new Error('Invalid image URL');
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
            }
            setMultipleImages(prevImages => [...prevImages, ...uploadedImages]);
        }
    };

    const { mutate, status } = useMutation({
        mutationFn: addBlog,
        onSuccess: (res) => {
            console.log(res.data);
            toast.info("Blog post added succesfully");

            router.push('/blogs');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Adding blog post failed';
            console.log(error);

            toast.error(errorMessage);
        },
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!singleImage) {
            return;
        }
        const title_me = formData.name_me.replace(/-/g, ' ');
        const title_en = formData.name_en.replace(/-/g, ' ');

        const blogData = {
            name: [{ me: title_me }, { en: title_en }],
            video: formData.video,
            category: selected.name,
            about: selected.id,
            content: [{ en: editorValueEN }, { me: editorValueME }],
            short_description: { en: formData.short_description_en, me: formData.short_description_me },
            cover_image: singleImage,
            gallery: JSON.stringify(multipleImages),
            author: user?.name
        };
        mutate(blogData);
    };

    useEffect(() => {
        setSelected(categories?.data[0]);
    }, [categories]);

    return (
        <div className='w-2/3 mx-auto mt-5 mb-[100px]'>
            <h1 className='text-center text-[24px] font-semibold'>Add new blog</h1>
            <div className='w-2/3 mx-auto mt-5 flex flex-col gap-5'>
                <Input label={'Blog name ME'} required={true} inputName={'name_me'} value={formData.name_me} onChange={handleInputChange} />
                <Input label={'Blog name EN'} required={true} inputName={'name_en'} value={formData.name_en} onChange={handleInputChange} />
                <div className='relative z-[999999999]'>
                    <p className='mb-1'>Choose a category</p>
                    {
                        categories && selected && <Dropdown setSelected={setSelected} selected={selected} categories={categories?.data} />
                    }
                </div>
                {selected?.name === "News" && <div className='relative z-[999999]'>
                    <p className='mb-1'>{blogs?.data.length > 0 && 'Related to project?'}</p>
                    <DropdownRelated setSelected={setSelected2} selected={selected2} data={blogs?.data} />
                </div>
                }
                <div>
                    <p>Content ME:</p>
                    <Editor initialValue={editorValueME} onChange={setEditorValueME} />
                    <p>Content EN:</p>
                    <Editor initialValue={editorValueEN} onChange={setEditorValueEN} />
                </div>
                <Input label={'Short description ME'} required={true} inputName={'short_description_me'} value={formData.short_description_me} onChange={handleInputChange} />
                <Input label={'Short description EN'} required={true} inputName={'short_description_en'} value={formData.short_description_en} onChange={handleInputChange} />
                <Input label={'Video (optional)'} required={false} inputName={'video'} value={formData.video} onChange={handleInputChange} />

                {/* Single Image Upload */}
                <div className='single-image'>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="single_file_input">Upload single file</label>
                    <input onChange={handleSingleImageUpload} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="single_file_input_help" id="single_file_input" type="file" accept="image/*" />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="single_file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                    {singleImage && <img src={singleImage} alt="Single upload preview" className="w-[150px] h-[150px] object-cover mt-2" />}
                </div>

                {/* Multiple Images Upload */}
                <div className='multiple-images'>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="multiple_file_input">Upload multiple files</label>
                    <input onChange={handleMultipleImagesUpload} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="multiple_file_input_help" id="multiple_file_input" type="file" multiple accept="image/*" />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="multiple_file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                </div>
                <div className='image-previews flex flex-wrap gap-5'>
                    {multipleImages.map((img, index) => (
                        <img key={index} src={img} alt={`Preview ${index}`} className="w-[150px] h-[150px] object-cover mr-2 mb-2" />
                    ))}
                </div>
                <button onClick={handleSubmit} className="mx-auto w-[160px] h-[40px] px-5 flex items-center justify-center gap-2 rounded bg-blue-600 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                > Add</button>
            </div>
        </div>
    );
};

export default withAuth(Page, { allowedRoles: ['owner', 'admin', 'moderator'] });
