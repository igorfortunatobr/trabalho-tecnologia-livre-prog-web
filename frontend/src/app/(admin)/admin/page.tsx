"use client";

import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';

interface User {
    id: number;
    nome: string;
    email: string;
    isAdmin: boolean;
}

interface Categoria {
    id: number;
    nome: string;
}

interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: string;
}

interface CategoriaTransacao {
    id: number;
    idCategoria: number;
    idTransacao: number;
    valor: number;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState<User[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [catTransacoes, setCatTransacoes] = useState<CategoriaTransacao[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const response = await api.get('/admin/usuarios');
                setUsers(response.data);
            } else if (activeTab === 'categories') {
                const response = await api.get('/admin/categorias');
                setCategorias(response.data);
            } else if (activeTab === 'transactions') {
                const response = await api.get('/admin/transacoes');
                setTransacoes(response.data);
            } else if (activeTab === 'cat_transactions') {
                const response = await api.get('/admin/categoria-transacoes');
                setCatTransacoes(response.data);
            }
        } catch (error) {
            toast.error('Erro ao carregar dados');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'users', label: 'Usuários' },
        { id: 'categories', label: 'Categorias' },
        { id: 'transactions', label: 'Transações' },
        { id: 'cat_transactions', label: 'Cat. Transações' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id
                                        ? 'border-purple-500 text-purple-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                                    } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-4 text-gray-400">Carregando...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-900">
                                    <tr>
                                        {activeTab === 'users' && (
                                            <>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</th>
                                            </>
                                        )}
                                        {activeTab === 'categories' && (
                                            <>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                                            </>
                                        )}
                                        {activeTab === 'transactions' && (
                                            <>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descrição</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                                            </>
                                        )}
                                        {activeTab === 'cat_transactions' && (
                                            <>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID Categoria</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID Transação</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {activeTab === 'users' &&
                                        users.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{u.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{u.nome}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{u.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{u.isAdmin ? 'Sim' : 'Não'}</td>
                                            </tr>
                                        ))}
                                    {activeTab === 'categories' &&
                                        categorias.map((c) => (
                                            <tr key={c.id} className="hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{c.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{c.nome}</td>
                                            </tr>
                                        ))}
                                    {activeTab === 'transactions' &&
                                        transacoes.map((t) => (
                                            <tr key={t.id} className="hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{t.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{t.descricao}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">R$ {t.valor}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{t.tipo === '1' ? 'Despesa' : 'Receita'}</td>
                                            </tr>
                                        ))}
                                    {activeTab === 'cat_transactions' &&
                                        catTransacoes.map((ct) => (
                                            <tr key={ct.id} className="hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ct.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ct.idCategoria}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ct.idTransacao}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">R$ {ct.valor}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
