const express = require('express');
const router = express.Router();

const { logOut } = require('../controllers/authController');

const verifyToken = require("../middlewares/auth");
router.post('/logout', verifyToken, logOut); // Cerrar sesión 

module.exports = router;



