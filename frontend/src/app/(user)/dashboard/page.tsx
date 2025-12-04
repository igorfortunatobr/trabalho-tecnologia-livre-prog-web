"use client";

import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [receitasDespesas, setReceitasDespesas] = useState<any>(null);
    const [totalPorCategoria, setTotalPorCategoria] = useState<any>(null);
    const [saldoDiario, setSaldoDiario] = useState<any>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            loadDashboardData();
        }
    }, [user, loading, router]);

    const loadDashboardData = async () => {
        try {
            const [resReceitasDespesas, resTotalCategoria, resTransacoes] = await Promise.all([
                api.get('/transacoes/relacao-receitas-despesas-mensal'),
                api.get('/transacoes/valor-total-transacoes-categoria'),
                api.get('/transacoes/all')
            ]);

            setReceitasDespesas(resReceitasDespesas.data);
            setTotalPorCategoria(resTotalCategoria.data);
            processSaldoDiario(resTransacoes.data);
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard', error);
        }
    };

    const processSaldoDiario = (transacoes: any[]) => {
        // Sort transactions by date
        const sortedTransacoes = [...transacoes].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

        const saldoMap = new Map();
        let saldoAcumulado = 0;

        sortedTransacoes.forEach(t => {
            const date = new Date(t.data).toLocaleDateString();
            const valor = t.tipo === '2' ? t.valor : -t.valor;
            saldoAcumulado += valor;
            saldoMap.set(date, saldoAcumulado);
        });

        setSaldoDiario({
            labels: Array.from(saldoMap.keys()),
            data: Array.from(saldoMap.values())
        });
    };

    if (loading || !user) {
        return null;
    }

    const barChartData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
            {
                label: 'Receitas',
                data: receitasDespesas?.receitas || [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: 'Despesas',
                data: receitasDespesas?.despesas || [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const pieChartData = {
        labels: totalPorCategoria?.map((item: any) => item.nome) || [],
        datasets: [
            {
                data: totalPorCategoria?.map((item: any) => item.valor) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const lineChartData = {
        labels: saldoDiario?.labels || [],
        datasets: [
            {
                label: 'Saldo Acumulado',
                data: saldoDiario?.data || [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">Receitas vs Despesas (Mensal)</h3>
                    <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { position: 'top' as const } } }} />
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">Totais por Categoria</h3>
                    <div className="h-64 flex justify-center">
                        <Pie data={pieChartData} />
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 md:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-4">Saldo Acumulado Diário</h3>
                    <Line data={lineChartData} options={{ responsive: true, plugins: { legend: { position: 'top' as const } } }} />
                </div>
            </div>
        </div>
    );
}
