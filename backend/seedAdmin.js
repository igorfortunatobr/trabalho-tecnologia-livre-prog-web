const sequelize = require('./database/database');
const Usuario = require('./api/model/usuario/modelUsuario');

async function seedAdmin() {
    try {
        await sequelize.sync();

        const adminEmail = 'admin@example.com';
        const adminExists = await Usuario.findOne({ where: { email: adminEmail } });

        if (adminExists) {
            console.log('Admin user already exists.');
            return;
        }

        await Usuario.create({
            nome: 'Admin User',
            email: adminEmail,
            senha: 'adminpassword', // In a real app, hash this!
            isAdmin: true
        });

        console.log('Admin user created successfully.');
        console.log('Email: admin@example.com');
        console.log('Password: adminpassword');
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await sequelize.close();
    }
}

seedAdmin();
