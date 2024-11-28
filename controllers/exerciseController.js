const UserExercise = require('../models/UserExercise');
const Exercise = require('../models/Exercise');
const User = require('../models/User');

exports.getUserExercises = async (req, res) => {
    const userId = req.session.userId;
  
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
  
    try {
      const userExercises = await UserExercise.findAll({
        where: { user_id: userId },
        include: [{ model: Exercise, as: 'exercise' }],
      });
  
      if (userExercises.length === 0) {
        return res.status(200).json([]);
      }
  
      const formattedExercises = userExercises.map((userExercise) => ({
        id: userExercise.exercise.id,
        nome: userExercise.exercise.name,      
        descricao: userExercise.exercise.description,
        series: userExercise.exercise.series,
        repeticoes: userExercise.exercise.repetitions,
        assignedAt: userExercise.assigned_at,
        completed: userExercise.completed,
      }));
  
      return res.status(200).json(formattedExercises);
    } catch (error) {
      console.error('Erro ao buscar exercícios do usuário:', error);
      return res.status(500).json({ message: 'Erro ao buscar exercícios.' });
    }
};  

exports.getAllExercises = async (req, res) => {
    try {
      const exercises = await Exercise.findAll();
  
      if (exercises.length === 0) {
        return res.status(200).json({ message: 'Nenhum exercício cadastrado no momento.' });
      }
  
      const formattedExercises = exercises.map((exercise) => ({
        id: exercise.id,
        nome: exercise.name,               
        descricao: exercise.description,  
        series: exercise.series,
        repeticoes: exercise.repetitions,
      }));
  
      return res.status(200).json(formattedExercises);
    } catch (error) {
      console.error('Erro ao buscar todos os exercícios:', error);
      return res.status(500).json({ message: 'Erro ao buscar exercícios.' });
    }
  };
  
  exports.getUserData = async (req, res) => {
    const userId = req.session.userId;
  
    if (!userId) {
      console.log('Usuário não autenticado.');
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
  
    try {
      const user = await User.findByPk(userId, { attributes: ['id', 'name', 'email'] });
  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return res.status(500).json({ message: 'Erro ao buscar dados do usuário.' });
    }
  };
  