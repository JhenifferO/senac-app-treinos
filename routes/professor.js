const express = require('express');
const professorController = require('../controllers/professorController');

const router = express.Router();

router.get('/students', professorController.getStudents);

router.get('/data', professorController.getProfessorData);

router.post('/student/:studentId/exercises', professorController.assignExerciseToStudent);

router.get('/student/:id/exercises', professorController.getStudentExercises);

router.delete('/student/:id/exercises/:exerciseId', professorController.removeStudentExercise);

router.post('/add_exercises', professorController.add_general_exercises);

module.exports = router;