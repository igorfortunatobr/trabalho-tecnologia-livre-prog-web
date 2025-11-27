const express = require('express');
const bcrypt = require('bcrypt');

const {ReportTransacoes} = require('./report/child/ReportTransacoes');
const {ReportTransacaoCategoria} = require('./report/child/ReportTransacaoCategoria');
const {ReportGastosCategoria} = require('./report/child/ReportGastosCategoria');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const userId = req.userId; // ID do usuário autenticado
        const tipoRelatorio = req.query.tipo;
        const filtro = req.body;
        let strategy;

        switch (tipoRelatorio) {
            case 'transacoes':
                strategy = new ReportTransacoes(userId, filtro, "Relatório de Transações");
                break;
            case 'transacaoCategoria':
                strategy = new ReportTransacaoCategoria(userId, filtro, "Relatório de Transações por Categoria");
                break;
            case 'gastosCategoria':
                strategy = new ReportGastosCategoria(userId, filtro, "Relatório de Gastos por Categoria");
                break;
            default:
                throw new Error(
                    { 
                        message: global.ENVIRONMENT.ERROR_REASONS_TEXT.INVALID_REPORT, 
                        errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.INVALID_REPORT 
                    }
                );
        }
    
        const relatorioBase64 = await strategy.gerarRelatorio();

        res.status(200).json(relatorioBase64);

    } catch (error) {
        global.UTILS.handleSequelizeError(error, res);
    }
});

module.exports = router;