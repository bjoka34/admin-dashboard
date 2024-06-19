import { httpClient } from "../httpClient";

export const getBlogs = async (categories: string, tags: string) => {
    if (tags === 'all' && categories === "all") {
        const response = await httpClient.get(
            `/blogs`
        );
        return response;
    } else {
        const response = await httpClient.get(
            `/posts?category=${categories}&tags=${tags}`
        );
        return response;
    }
};

export const getBlogById = async (id: number) => {
    const response = await httpClient.get(
        `/blogs/${id}`
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


