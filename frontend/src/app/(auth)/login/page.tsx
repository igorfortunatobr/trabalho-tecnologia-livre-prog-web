"use client";

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import api from '../../../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, senha: password });
            const { token, user } = response.data;
            signIn(token, user);
            toast.success('Login realizado com sucesso!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105 duration-300 border border-gray-700">
                <div className="flex justify-center mb-6">
                    <Image src="/logo.png" alt="FinControl Logo" width={180} height={50} className="h-12 w-auto" />
                </div>
                <h2 className="text-3xl font-bold text-center text-white mb-8">Bem-vindo de volta</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-400"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-white placeholder-gray-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-purple-500/30"
                    >
                        Entrar
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-400">
                    Não tem uma conta?{' '}
                    <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold hover:underline">
                        Cadastre-se
                    </Link>
                </div>
            </div>
        </div>
    );
}
