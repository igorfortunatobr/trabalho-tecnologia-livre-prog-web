const PDFDocument = require('pdfkit');

class RelatorioStrategy {
    constructor(userId, filtro, nomeRelatorio = "Relatório") {
        this.userId = userId;
        this.filtro = filtro;
        this.nomeRelatorio = nomeRelatorio
    }

    async gerarRelatorio() {
        throw new Error('Método gerarRelatorio deve ser implementado');
    }

    async gerarPDF(data) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                const base64Data = pdfData.toString('base64');
                resolve(base64Data);
            });

            this.montarConteudo(doc, data);
            doc.end();
        });
    }

    // Método getter para a propriedade 'title'
    get subtitulo() {
        return this._subtitulo;
    }

    // Método setter para a propriedade 'title'
    set subtitulo(value) {
        if (typeof value === 'string' && value.length > 0) {
            this._subtitulo = value;
        } else {
            throw new Error('Subtitulo deve ser uma string não vazia.');
        }
    }

    montarConteudo(doc, data) {
        this.adicionarCabecalho(doc);
        this.adicionarCorpo(doc, data);
        this.adicionarRodape(doc);
    }

    adicionarCabecalho(doc) {
        doc.fontSize(16).text(this.nomeRelatorio, { align: 'center' });
        doc.moveDown(0.5); // Espaço entre o título e a data do relatório
        doc.fontSize(12).text(`Relatório gerado em: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(1); // Espaço entre a data e o início da tabela
    }

    adicionarCorpo(doc, data) {
        throw new Error('Método adicionarCorpo deve ser implementado');
    }

    adicionarRodape(doc) {
        // O rodapé pode ser adicionado aqui, se necessário
    }

    desenharTabela(doc, headers, rows, startX = 50, startY = 150, columnPadding = 10) {
        if (this?.subtitulo) {
            doc.fontSize(12).text(this.subtitulo, { align: 'center' });
            doc.moveDown(1); // Espaço entre a data e o início da tabela
        }

        // Calcular a largura de cada coluna
        const columnWidths = headers.map((header, i) => {
            const columnValues = rows.map(row => row[i]);
            // Calcular a largura máxima do cabeçalho e das células
            const maxHeaderWidth = doc.widthOfString(header);
            const maxCellWidth = Math.max(...columnValues.map(value => doc.widthOfString(value.toString())));
            return Math.max(maxHeaderWidth, maxCellWidth) + columnPadding * 2;
        });

        // Calcular a largura total da tabela e centralizar
        const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
        const marginX = (doc.page.width - tableWidth) / 2;

        let currentY = startY;
        let currentX = marginX;

        // Desenhar o cabeçalho
        doc.fontSize(11).font('Helvetica-Bold');
        headers.forEach((header, i) => {
            doc.rect(currentX, currentY, columnWidths[i], 20).stroke();
            doc.text(header, currentX + columnPadding, currentY + 5, {
                width: columnWidths[i] - columnPadding * 2,
                align: 'center' // Alinhar texto ao centro
            });
            currentX += columnWidths[i];
        });

        // Mover para a linha abaixo do cabeçalho
        currentY += 20;
        currentX = marginX;

        // Desenhar as linhas de dados
        doc.fontSize(10).font('Helvetica');
        rows.forEach(row => {
            row.forEach((cell, i) => {
                doc.rect(currentX, currentY, columnWidths[i], 20).stroke();
                doc.text(cell, currentX + columnPadding, currentY + 5, {
                    width: columnWidths[i] - columnPadding * 2,
                    align: 'right' // Alinhar texto à direita para números
                });
                currentX += columnWidths[i];
            });
            currentY += 20;
            currentX = marginX;
        });

        // Desenhar linha de fundo abaixo da tabela
        doc.moveTo(marginX, currentY).lineTo(marginX + tableWidth, currentY).stroke();
    }



}

module.exports = RelatorioStrategy;

module.exports = {RelatorioStrategy}