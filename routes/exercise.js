const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

router.get('/user', exerciseController.getUserExercises);
router.get('/data', exerciseController.getUserData);

//a ordem das rotas importa..
router.get('/', exerciseController.getAllExercises);


module.exports = router;