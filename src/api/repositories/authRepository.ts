import { User } from "../../types/types";
import { httpClient } from "../httpClient";

export const loginUser = async (data: User) => {
    const response = await httpClient.post("/auth/login", data);
    console.log(response);
    return response;
};

