const Usuario = require('../model/usuario/modelUsuario');

async function verificarAdmin(req, res, next) {
    try {
        const usuario = await Usuario.findByPk(req.userId);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (!usuario.isAdmin) {
            return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
        }

        next();
    } catch (error) {
        console.error('Erro ao verificar permissão de admin:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

module.exports = { verificarAdmin };
