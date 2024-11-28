const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao destruir a sessão:', err);
      return res.status(500).json({ message: 'Erro ao fazer logout.' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logout bem-sucedido.' });
  });
});

module.exports = router;