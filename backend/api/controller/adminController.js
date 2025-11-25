const Usuario = require('../model/usuario/modelUsuario');
const Categoria = require('../model/categoria/modelCategoria');
const Transacao = require('../model/transacao/modelTransacao');
const CategoriaTransacao = require('../model/categoriaTransacao/modelCategoriaTransacao');
const express = require('express');
const router = express.Router();

// Listar todos os usuários
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['senha'] } // Não retornar a senha
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários.', error });
    }
});

// Listar todas as categorias
router.get('/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar categorias.', error });
    }
});

// Listar todas as transações
router.get('/transacoes', async (req, res) => {
    try {
        const transacoes = await Transacao.findAll();
        res.json(transacoes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar transações.', error });
    }
});

// Listar todas as categorias de transações
router.get('/categoria-transacoes', async (req, res) => {
    try {
        const categoriaTransacoes = await CategoriaTransacao.findAll();
        res.json(categoriaTransacoes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar categorias de transações.', error });
    }
});

module.exports = router;
