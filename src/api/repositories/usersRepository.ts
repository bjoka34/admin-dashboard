import { User } from "../../types/types";
import { httpClient } from "../httpClient";

export const getUsers = async () => {
    const response = await httpClient.get("/users");
    console.log(response);
    return response;
};

