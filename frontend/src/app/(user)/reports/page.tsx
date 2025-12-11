"use client";

import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { downloadPdf } from '../../../utils/downloadPDF';
import { toast } from 'react-toastify';

interface Categoria {
    id: number;
    nome: string;
}

export default function ReportsPage() {
    const getCurrentDate = () => {
        const today = new Date();
        const offset = today.getTimezoneOffset();
        const localDate = new Date(today.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    };

    const [tipoRelatorio, setTipoRelatorio] = useState('transacoes');
    const [dataInicio, setDataInicio] = useState(getCurrentDate());
    const [dataFim, setDataFim] = useState(getCurrentDate());
    const [idCategoria, setIdCategoria] = useState('');
    const [tipoTransacao, setTipoTransacao] = useState('1'); // 1 for Expense, 2 for Income
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    useEffect(() => {
        loadCategorias();
    }, []);

    const loadCategorias = async () => {
        try {
            const response = await api.get('/categorias/all');
            setCategorias(response.data);
        } catch (error) {
            console.error('Erro ao carregar categorias', error);
        }
    };

    const generateReport = async () => {
        try {
            const payload: any = {
                dataInicio,
                dataFim,
            };
            if (tipoRelatorio === 'transacaoCategoria') {
                payload.idCategoria = idCategoria;
            }
            if (tipoRelatorio === 'transacoes') {
                payload.tipoTransacao = tipoTransacao;
            }

            const response = await api.post(`/relatorio?tipo=${tipoRelatorio}`, payload);
            downloadPdf(response.data || '');
        } catch (error: any) {
            console.error('Erro ao gerar relatório', error);
            toast.error(error.response?.data?.message || 'Erro ao gerar relatório');
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white">Relatórios</h2>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Relatório</label>
                        <select
                            value={tipoRelatorio}
                            onChange={(e) => setTipoRelatorio(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white"
                        >
                            <option value="transacoes">Transações</option>
                            <option value="transacaoCategoria">Transação por Categoria</option>
                            <option value="gastosCategoria">Totais por Categoria</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Data Início</label>
                            <input
                                type="date"
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Data Fim</label>
                            <input
                                type="date"
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white"
                            />
                        </div>
                    </div>

                    {tipoRelatorio === 'transacaoCategoria' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
                            <select
                                value={idCategoria}
                                onChange={(e) => setIdCategoria(e.target.value)}
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
                    )}

                    {tipoRelatorio === 'transacoes' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Transação</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-gray-300">
                                    <input
                                        type="radio"
                                        value="1"
                                        checked={tipoTransacao === '1'}
                                        onChange={(e) => setTipoTransacao(e.target.value)}
                                        className="text-purple-600 focus:ring-purple-600 bg-gray-700 border-gray-600"
                                    />
                                    Despesas
                                </label>
                                <label className="flex items-center gap-2 text-gray-300">
                                    <input
                                        type="radio"
                                        value="2"
                                        checked={tipoTransacao === '2'}
                                        onChange={(e) => setTipoTransacao(e.target.value)}
                                        className="text-purple-600 focus:ring-purple-600 bg-gray-700 border-gray-600"
                                    />
                                    Receitas
                                </label>
                                <label className="flex items-center gap-2 text-gray-300">
                                    <input
                                        type="radio"
                                        value="3"
                                        checked={tipoTransacao === '3'}
                                        onChange={(e) => setTipoTransacao(e.target.value)}
                                        className="text-purple-600 focus:ring-purple-600 bg-gray-700 border-gray-600"
                                    />
                                    Ambos
                                </label>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={generateReport}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-purple-500/20"
                    >
                        Gerar Relatório
                    </button>
                </div>
            </div>
        </div>
    );
}
