const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Recebido:', { email, password });

  try {
    const user = await User.findOne({ where: { email } });

    console.log('Usuário encontrado:', user);

    if (!user) {
      console.log('Usuário não encontrado');
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    console.log('Senha válida:', validPassword);

    if (!validPassword) {
      console.log('Senha incorreta');
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    console.log('Login bem-sucedido, retornando dados do usuário');

    req.session.userId = user.id;

    console.log('ID do usuário salvo na sessão:', req.session.userId);
    
    return res.status(200).json({
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};