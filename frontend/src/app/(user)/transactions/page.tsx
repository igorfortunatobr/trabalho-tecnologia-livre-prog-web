"use client";

import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Categoria {
    id: number;
    nome: string;
}

interface Transacao {
    id: number;
    data: string;
    tipo: string; // "1" for Expense, "2" for Income
    valor: number;
    descricao: string;
    CategoriaTransacaos?: {
        Categoria: {
            nome: string;
        };
    }[];
}

export default function TransactionsPage() {
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTransacao, setEditingTransacao] = useState<Transacao | null>(null);

    // Form states
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [data, setData] = useState('');
    const [tipo, setTipo] = useState('1'); // Default to Expense
    const [categoriaId, setCategoriaId] = useState('');

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
            const payload = {
                transacao: {
                    descricao,
                    valor: parseFloat(valor),
                    data,
                    tipo
                },
                categorias: [{ idCategoria: parseInt(categoriaId), valor: parseFloat(valor) }]
            };

            if (editingTransacao) {
                await api.put(`/transacoes/${editingTransacao.id}`, payload);
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

    const handleEdit = (transacao: Transacao) => {
        setEditingTransacao(transacao);
        setDescricao(transacao.descricao);
        setValor(transacao.valor.toString());
        setData(transacao.data.split('T')[0]);
        setTipo(transacao.tipo);
        setShowModal(true);
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
        setValor('');
        setData('');
        setTipo('1');
        setCategoriaId('');
        setShowModal(false);
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Categoria</th>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {transacao.CategoriaTransacaos?.map(ct => ct.Categoria.nome).join(', ') || '-'}
                                </td>
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">Valor</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
                                <select
                                    value={categoriaId}
                                    onChange={(e) => setCategoriaId(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white"
                                    required
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nome}
                                        </option>
                                    ))}
                                </select>
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
