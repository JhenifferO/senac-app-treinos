const User = require('../models/User');
const UserExercise = require('../models/UserExercise');
const Exercise = require('../models/Exercise');

exports.getStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: ['id', 'name', 'email'],
    });
    return res.status(200).json(students);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    return res.status(500).json({ message: 'Erro ao buscar alunos.' });
  }
};

exports.getProfessorData = async (req, res) => {
  const professorId = req.session.userId;

  if (!professorId) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  try {
    const professor = await User.findByPk(professorId, {
      attributes: ['id', 'name', 'email'],
    });

    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }

    return res.status(200).json(professor);
  } catch (error) {
    console.error('Erro ao buscar dados do professor:', error);
    return res.status(500).json({ message: 'Erro ao buscar dados do professor.' });
  }
};

exports.assignExercise = async (req, res) => {

  const { studentId, exerciseId } = req.body;

  if (!studentId || !exerciseId) {
    return res.status(400).json({ message: 'Parâmetros insuficientes.' });
  }

  try {
    const exercise = await Exercise.findByPk(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercício não encontrado.' });
    }

    const userExercise = await UserExercise.create({
      user_id: studentId,
      exercise_id: exerciseId,
    });

    return res.status(201).json({
      message: 'Exercício atribuído com sucesso.',
      data: userExercise,
    });
  } catch (error) {
    console.error('Erro ao atribuir exercício:', error);
    return res.status(500).json({ message: 'Erro ao atribuir exercício.' });
  }
};

exports.getStudentExercises = async (req, res) => {

  const studentId = req.params.id;

  try {
    const student = await User.findByPk(studentId, { where: { role: 'student' } });
    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    const studentExercises = await UserExercise.findAll({
      where: { user_id: studentId },
      include: [{ model: Exercise, as: 'exercise' }],
    });

    const formattedExercises = studentExercises.map((userExercise) => ({
      id: userExercise.exercise.id,
      nome: userExercise.exercise.name,
      descricao: userExercise.exercise.description,
      series: userExercise.exercise.series,
      repeticoes: userExercise.exercise.repetitions,
      assignedAt: userExercise.assigned_at,
    }));

    res.status(200).json(formattedExercises);
  } catch (error) {
    console.error('Erro ao buscar exercícios do aluno:', error);
    res.status(500).json({ message: 'Erro ao buscar exercícios do aluno.' });
  }
};


exports.removeStudentExercise = async (req, res) => {
  const { id: studentId, exerciseId } = req.params;

  try {

    const userExercise = await UserExercise.findOne({
      where: { user_id: studentId, exercise_id: exerciseId },
    });

    if (!userExercise) {
      return res.status(404).json({ message: 'Exercício não encontrado para o aluno.' });
    }

    await userExercise.destroy();

    res.status(200).json({ message: 'Exercício removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover exercício do aluno:', error);
    res.status(500).json({ message: 'Erro ao remover exercício.' });
  }
};

exports.assignExerciseToStudent = async (req, res) => {

  const studentId = req.params.studentId; 
  const { exerciseId } = req.body;

  try {

    const exercise = await Exercise.findByPk(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercício não encontrado.' });
    }

    const student = await User.findOne({
      where: { id: studentId, role: 'student' },
    });
    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    const existingExercise = await UserExercise.findOne({
      where: {
        user_id: studentId,
        exercise_id: exerciseId,
      },
    });

    if (existingExercise) {
      return res.status(400).json({ message: 'Esse Exercício já foi atribuído a este aluno.' });
    }

    const userExercise = await UserExercise.create({
      user_id: studentId,
      exercise_id: exerciseId,
      assigned_at: new Date(),
    });
    
    res.status(201).json({
      message: 'Exercício atribuído com sucesso.',
      userExercise,
    });
  } catch (error) {
    console.error('Erro ao adicionar exercício ao aluno:', error);
    res.status(500).json({ message: 'Erro ao adicionar exercício.' });
  }
};

exports.add_general_exercises = async (req, res) => {
  
  const { nome, descricao, series, repeticoes } = req.body;

  if (!nome || !descricao || !series || !repeticoes) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const newExercise = await Exercise.create({
      name: nome,
      description: descricao,
      series,
      repetitions: repeticoes,
    });

    res.status(201).json({
      message: 'Exercício adicionado com sucesso.',
      exercise: newExercise,
    });
  } catch (error) {
    console.error('Erro ao adicionar exercício:', error);
    res.status(500).json({ message: 'Erro ao adicionar exercício.' });
  }
};