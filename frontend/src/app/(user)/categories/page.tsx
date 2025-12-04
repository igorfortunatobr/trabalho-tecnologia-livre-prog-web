"use client";

import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Categoria {
    id: number;
    nome: string;
}

export default function CategoriesPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
    const [nome, setNome] = useState('');

    useEffect(() => {
        loadCategorias();
    }, []);

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
            if (editingCategory) {
                await api.put(`/categorias/${editingCategory.id}`, { nome });
                toast.success('Categoria atualizada com sucesso');
            } else {
                await api.post('/categorias', { nome });
                toast.success('Categoria criada com sucesso');
            }
            setShowModal(false);
            setEditingCategory(null);
            setNome('');
            loadCategorias();
        } catch (error) {
            toast.error('Erro ao salvar categoria');
        }
    };

    const handleEdit = (categoria: Categoria) => {
        setEditingCategory(categoria);
        setNome(categoria.nome);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir esta categoria?')) {
            try {
                await api.delete(`/categorias/${id}`);
                toast.success('Categoria excluída com sucesso');
                loadCategorias();
            } catch (error) {
                toast.error('Erro ao excluir categoria. Verifique se não está em uso.');
            }
        }
    };

    const openModal = () => {
        setEditingCategory(null);
        setNome('');
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Categorias</h2>
                <button
                    onClick={openModal}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/20"
                >
                    <FaPlus /> Nova Categoria
                </button>
            </div>

            <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {categorias.map((categoria) => (
                            <tr key={categoria.id} className="hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{categoria.nome}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(categoria)}
                                        className="text-purple-400 hover:text-purple-300 mr-4 transition-colors"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(categoria.id)}
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
                        <h3 className="text-xl font-bold mb-4 text-white">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-400"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
