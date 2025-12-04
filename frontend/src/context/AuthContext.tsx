"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import api from '../services/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    nome: string;
    email: string;
    isAdmin: boolean;
}

interface AuthContextData {
    user: User | null;
    signIn: (token: string, user: User) => void;
    signOut: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadStorageData = () => {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                api.defaults.headers.Authorization = storedToken;
            }
            setLoading(false);
        };

        loadStorageData();
    }, []);

    const signIn = (token: string, user: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        api.defaults.headers.Authorization = token;
        setUser(user);
        if (user.isAdmin) {
            router.push('/admin');
        } else {
            router.push('/dashboard');
        }
    };

    const signOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}
