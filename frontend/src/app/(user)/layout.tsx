"use client";

import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, signOut, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Carregando...</div>;
    }

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Categorias', path: '/categories' },
        { name: 'Transações', path: '/transactions' },
        { name: 'Relatórios', path: '/reports' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="mr-8">
                                <Image src="/logo.png" alt="FinControl Logo" width={150} height={40} className="h-10 w-auto" />
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.path}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${pathname === item.path
                                                ? 'bg-purple-600 text-white shadow-md'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-300">Olá, <span className="text-purple-400 font-semibold">{user.nome}</span></span>
                            {user.isAdmin && (
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                                >
                                    Admin Panel
                                </button>
                            )}
                            <button
                                onClick={signOut}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                            >
                                Sair
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
