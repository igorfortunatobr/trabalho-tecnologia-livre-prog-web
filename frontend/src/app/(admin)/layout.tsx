"use client";

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (!user.isAdmin) {
                router.push('/dashboard');
            }
        }
    }, [user, loading, router]);

    if (loading || !user || !user.isAdmin) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-purple-500">Admin Panel</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-300">{user.nome} (Admin)</span>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Voltar ao Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
