require('dotenv').config();
const express = require('express');
const sequelize = require('./database/database');
const usuarioController = require('./api/controller/usuarioController');
const categoriaController = require('./api/controller/categoriaController');
const transacaoController = require('./api/controller/transacaoController');
const authController = require('./api/controller/auth/authController');
const ENVIRONMENT = require('./api/environment/environment')
const UTILS = require('./api/environment/utils')
const cors = require("cors");

const { verificarToken } = require('./api/middleware/authMiddleware');

global.ENVIRONMENT = ENVIRONMENT;
global.UTILS = UTILS;

const app = express();

// * CORS - no origin define os sites que podem acessar a API (não aceita localhost)
app.use(
  cors({
    // origin: [
    // ],
  }),
);

// Middleware para analisar corpos de solicitação JSON
app.use(express.json());

// Rotas de usuário
app.use('/usuarios', usuarioController);

// Rotas de autenticação
app.use('/auth', authController);

////////////////////////////////////////////////////////
// Middleware para verificar token JWT em todas as rotas
app.use(verificarToken);
////////////////////////////////////////////////////////

// Rotas privadas
app.use('/categorias', categoriaController);
app.use('/transacoes', transacaoController);

const adminController = require('./api/controller/adminController');
const { verificarAdmin } = require('./api/middleware/adminMiddleware');

// Rotas de administrador
app.use('/admin', verificarAdmin, adminController);

const Transacao = require('./api/model/transacao/modelTransacao');
const Categoria = require('./api/model/categoria/modelCategoria');
const CategoriaTransacao = require('./api/model/categoriaTransacao/modelCategoriaTransacao');

// Definir as associações
Transacao.associate({ CategoriaTransacao });
Categoria.associate({ CategoriaTransacao });
CategoriaTransacao.associate({ Transacao, Categoria });

// Sincronização do modelo com o banco de dados e inicialização do servidor
sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT_NODE, () => {
      console.log('Servidor rodando em http://localhost:' + process.env.PORT_NODE);
    });
  })
  .catch(err => console.error('Erro ao sincronizar com o banco de dados:', err));
