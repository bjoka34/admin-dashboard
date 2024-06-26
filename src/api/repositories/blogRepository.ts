import { httpClient } from "../httpClient";

export const getBlogs = async (categories: string, tags: string) => {

    const response = await httpClient.get(
        `/blogs?category=${categories}&tags=${tags}`
    );
    return response;

};

export const getBlogById = async (id: number) => {
    const response = await httpClient.get(
        `/blogs/edit/${id}`
    );
    return response;
};

export const uploader = async (data: any) => {
    const response = await httpClient.post(
        `/blogs/upload`
    );
    return response;
};

export const addBlog = async (data: any) => {
    const response = await httpClient.post(
        `/blogs`, data
    );
    return response;
};

export const updateBlog = async ({ data, id }: { data: any; id: number; }) => {
    const response = await httpClient.put(
        `/blogs/${id}`, data
    );
    return response;
};

export const deleteBlog = async (id: number) => {
    const response = await httpClient.delete(
        `/blogs/${id}`
    );
    return response;
};


