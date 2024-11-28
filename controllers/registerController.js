const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  
  if (!name || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'As senhas não coincidem.' });
  }

  if (![1, 2].includes(role)) {
    return res.status(400).json({ message: 'O valor de "role" é inválido.' });
  }

  try {

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Este email já está cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const roleText = role === 1 ? 'teacher' : 'student';

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: roleText,
    });

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};