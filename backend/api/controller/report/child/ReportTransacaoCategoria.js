const { Sequelize, Op, EmptyResultError } = require('sequelize');
const CategoriaTransacao = require('../../../model/categoriaTransacao/modelCategoriaTransacao');
const Transacao = require('../../../model/transacao/modelTransacao');
const Categoria = require('../../../model/categoria/modelCategoria');

const {RelatorioStrategy} = require('../base/ReportStrategy');

class ReportTransacaoCategoria extends RelatorioStrategy {
    async gerarRelatorio() {
        const whereClause = { idUsuario: this.userId };
        const whereClauseTransacao = {...whereClause};
        const categoriaId = this.filtro.idCategoria;

        if (this.filtro) {
            // Adicionar filtro de data se dataInicio e dataFim forem fornecidos
            if (this.filtro.dataInicio && this.filtro.dataFim) {
                whereClauseTransacao.data = {
                    [Op.between]: [
                        Sequelize.fn('DATE', this.filtro.dataInicio),
                        Sequelize.fn('DATE', this.filtro.dataFim)
                    ],
                };
            }
        }

        const transacoesCategorias = await CategoriaTransacao.findAll({
            where: { idCategoria: categoriaId },
            include: [
                {
                    model: Transacao,
                    as: 'Transacao',
                    attributes: ['descricao', 'data', 'tipo', 'valor'], // Campos que você deseja retornar
                    where: whereClauseTransacao
                },
                {
                    model: Categoria,
                    as: 'Categoria',
                    attributes: ['nome'], // Campos que você deseja retornar
                    where: whereClause
                }
            ]
        });

        if (!transacoesCategorias?.length)
            throw new EmptyResultError("Nenhum dado encontrado.")

        return this.gerarPDF(transacoesCategorias);
    }

    adicionarCorpo(doc, data) {
        // Verifique a estrutura dos dados

        this.subtitulo = data[0]?.Categoria ? `Trasações da categoria "${data[0]?.Categoria?.dataValues?.nome}"` : "Não foi encontrada nenhuma transação para a categoria selecionada.";
        let contador = 1;
        const headers = ['N°', 'Descrição', 'Data', 'Valor (R$)'];
        const rows = data.map(item => [
            contador++,
            item.Transacao ? item.Transacao.dataValues.descricao : 'N/A', // Protege contra undefined
            item.Transacao ? global.UTILS.formatDateTime(item.Transacao.dataValues.data) : 'N/A', // Protege contra undefined
            item.Transacao ? item.Transacao.dataValues.valor.toFixed(2) : 'N/A', // Protege contra undefined
        ]);

        this.desenharTabela(doc, headers, rows);
    }
}

module.exports = {ReportTransacaoCategoria};