import { httpClient } from "../httpClient";

export const getCategories = async () => {
    const response = await httpClient.get(
        `/categories`
    );
    return response;
};

export const deleteCategory = async (id: number) => {
    const response = await httpClient.delete(
        `/categories/${id}`
    );
    return response;
};

export const getCategoryById = async (id: number) => {
    const response = await httpClient.get(
        `/categories/${id}`
    );
    return response;
};

export const updateCategory = async ({ data, id }: { data: any; id: number; }) => {
    const response = await httpClient.put(
        `/categories/${id}`, data
    );
    return response;
};

export const addCategory = async (data: any) => {
    const response = await httpClient.post(
        `/categories`, data
    );
    return response;
};
