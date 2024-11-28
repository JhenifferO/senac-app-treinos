const express = require('express');
const sequelize = require('./config/database');
const loginRoutes = require('./routes/login');
const userRoutes = require('./routes/user');
const exerciseRoutes = require('./routes/exercise');
const registerRoutes = require('./routes/register');
const authRoutes = require('./routes/authRoutes');
const professorRoutes = require('./routes/professor');
const app = express();

const session = require('express-session');

app.use(
  session({
    secret: '2093009841',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log('Sessão atual:', req.session);
  next();
});
// server.js ou app.js

app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/exercise', exerciseRoutes);
app.use('/professor', professorRoutes);
app.use('/logout', authRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados bem-sucedida.');

    sequelize.sync()
      .then(() => {
        app.listen(3000, () => {
          console.log('Servidor rodando na porta 3000');
        });
      })
      .catch((syncError) => {
        console.error('Erro ao sincronizar tabelas:', syncError);
      });
  })
  .catch((dbError) => {
    console.error('Erro ao conectar ao banco de dados:', dbError);
  });