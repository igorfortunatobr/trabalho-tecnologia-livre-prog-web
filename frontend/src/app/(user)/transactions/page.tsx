"use client";

import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Categoria {
    id: number;
    nome: string;
}

interface TransacaoCategoria {
    idCategoria: number;
    valor: number;
    nome?: string; // Optional for display purposes
}

interface Transacao {
    id: number;
    data: string;
    tipo: string; // "1" for Expense, "2" for Income
    valor: number;
    descricao: string;
    categorias?: {
        idCategoria: number;
        valor: number;
        nome: string;
    }[];
}

export default function TransactionsPage() {
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTransacao, setEditingTransacao] = useState<Transacao | null>(null);

    // Form states
    const [descricao, setDescricao] = useState('');
    // const [valor, setValor] = useState(''); // Removed, calculated from categories
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [tipo, setTipo] = useState('1'); // Default to Expense
    const [selectedCategories, setSelectedCategories] = useState<TransacaoCategoria[]>([]);

    useEffect(() => {
        loadTransacoes();
        loadCategorias();
    }, []);

    const loadTransacoes = async () => {
        try {
            const response = await api.get('/transacoes/all');
            setTransacoes(response.data);
        } catch (error) {
            toast.error('Erro ao carregar transações');
        }
    };

    const loadCategorias = async () => {
        try {
            const response = await api.get('/categorias/all');
            setCategorias(response.data);
        } catch (error) {
            toast.error('Erro ao carregar categorias');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const totalValor = selectedCategories.reduce((acc, curr) => acc + curr.valor, 0);

            if (selectedCategories.length === 0) {
                toast.error('Adicione pelo menos uma categoria.');
                return;
            }

            const payload = {
                transacao: {
                    descricao,
                    valor: totalValor,
                    data,
                    tipo
                },
                categorias: selectedCategories.map(c => ({ idCategoria: c.idCategoria, valor: c.valor }))
            };

            if (editingTransacao) {
                await api.put(`/transacoes/id/${editingTransacao.id}`, payload);
                toast.success('Transação atualizada com sucesso');
            } else {
                await api.post('/transacoes', payload);
                toast.success('Transação criada com sucesso');
            }
            closeModal();
            loadTransacoes();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao salvar transação');
        }
    };

    const handleEdit = async (transacao: Transacao) => {
        try {
            // Fetch full details to get categories
            const response = await api.get(`/transacoes/id/${transacao.id}`);
            const fullTransacao = response.data;

            setEditingTransacao(fullTransacao);
            setDescricao(fullTransacao.descricao);
            setData(fullTransacao.data.split('T')[0]);
            setTipo(fullTransacao.tipo);

            if (fullTransacao.categorias) {
                setSelectedCategories(fullTransacao.categorias.map((c: any) => ({
                    idCategoria: c.idCategoria,
                    valor: c.valor,
                    nome: c.nome
                })));
            } else {
                setSelectedCategories([]);
            }

            setShowModal(true);
        } catch (error) {
            toast.error('Erro ao carregar detalhes da transação');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir esta transação?')) {
            try {
                await api.delete(`/transacoes/${id}`);
                toast.success('Transação excluída com sucesso');
                loadTransacoes();
            } catch (error) {
                toast.error('Erro ao excluir transação');
            }
        }
    };

    const closeModal = () => {
        setEditingTransacao(null);
        setDescricao('');
        setData(new Date().toISOString().split('T')[0]);
        setTipo('1');
        setSelectedCategories([]);
        setShowModal(false);
    };

    const addCategory = () => {
        setSelectedCategories([...selectedCategories, { idCategoria: 0, valor: 0 }]);
    };

    const removeCategory = (index: number) => {
        const newCategories = [...selectedCategories];
        newCategories.splice(index, 1);
        setSelectedCategories(newCategories);
    };

    const updateCategory = (index: number, field: keyof TransacaoCategoria, value: any) => {
        const newCategories = [...selectedCategories];
        newCategories[index] = { ...newCategories[index], [field]: value };
        setSelectedCategories(newCategories);
    };

    const calculateTotalValue = () => {
        return selectedCategories.reduce((acc, curr) => acc + (curr.valor || 0), 0);
    };

    const calculateTotals = () => {
        const income = transacoes
            .filter((t) => t.tipo === '2')
            .reduce((acc, t) => acc + t.valor, 0);
        const expense = transacoes
            .filter((t) => t.tipo === '1')
            .reduce((acc, t) => acc + t.valor, 0);
        return { income, expense, balance: income - expense };
    };

    const { income, expense, balance } = calculateTotals();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Transações</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/20"
                >
                    <FaPlus /> Nova Transação
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                    <h3 className="text-gray-400 text-sm font-medium">Receitas</h3>
                    <p className="text-2xl font-bold text-green-400">R$ {income.toFixed(2)}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-red-500">
                    <h3 className="text-gray-400 text-sm font-medium">Despesas</h3>
                    <p className="text-2xl font-bold text-red-400">R$ {expense.toFixed(2)}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                    <h3 className="text-gray-400 text-sm font-medium">Saldo</h3>
                    <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                        R$ {balance.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descrição</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {transacoes.map((transacao) => (
                            <tr key={transacao.id} className="hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {new Date(transacao.data).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transacao.descricao}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${transacao.tipo === '1' ? 'text-red-400' : 'text-green-400'}`}>
                                    {transacao.tipo === '1' ? '-' : '+'} R$ {transacao.valor.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(transacao)}
                                        className="text-purple-400 hover:text-purple-300 mr-4 transition-colors"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(transacao.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-xl">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-white">{editingTransacao ? 'Editar Transação' : 'Nova Transação'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                                <input
                                    type="text"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-400"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Data</label>
                                <input
                                    type="date"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-400"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                                <select
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white"
                                >
                                    <option value="1">Despesa</option>
                                    <option value="2">Receita</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Categorias</label>
                                {selectedCategories.map((cat, index) => (
                                    <div key={index} className="flex gap-2 mb-2 items-start">
                                        <div className="flex-1">
                                            <select
                                                value={cat.idCategoria}
                                                onChange={(e) => updateCategory(index, 'idCategoria', parseInt(e.target.value))}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white"
                                                required
                                            >
                                                <option value="0">Selecione uma categoria</option>
                                                {categorias.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-32">
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Valor"
                                                value={cat.valor}
                                                onChange={(e) => updateCategory(index, 'valor', parseFloat(e.target.value))}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-400"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeCategory(index)}
                                            className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Remover categoria"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addCategory}
                                    className="mt-2 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                >
                                    <FaPlus size={12} /> Adicionar Categoria
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Valor Total</label>
                                <div className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300">
                                    R$ {calculateTotalValue().toFixed(2)}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
