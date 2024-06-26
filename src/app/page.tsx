'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../api/repositories/authRepository';
import { useDispatch, useSelector } from 'react-redux';
import { login, setError } from '../redux/slices/userSlice';
import { useMutation } from '@tanstack/react-query';
import { RootState } from '@/redux/store';

const LoginPage = () => {
  const [userEmail, setEmail] = useState('');
  const [userPassword, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const router = useRouter();
  const dispatch = useDispatch();

  const { mutate, status } = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      console.log(res.data);

      const { id, name, email, token, admin } = res.data;
      dispatch(login({ id, name, email, admin, token }));
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.log(error);

      const errorMessage = error.response?.data?.message || 'Login failed';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
    },
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = {
      email: userEmail,
      password: userPassword
    };
    mutate(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={userEmail}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={userPassword}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {localError && <p>{localError}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
