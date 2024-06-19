import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: number;
    name: string;
    email: string;
    admin: string;
    token: string;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    error: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            console.log(state.user);

            localStorage.setItem('token', state.user.token);
            state.isAuthenticated = true;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('token');

        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        }
    }
});

export const { login, logout, updateUser, setError } = userSlice.actions;
export default userSlice.reducer;
