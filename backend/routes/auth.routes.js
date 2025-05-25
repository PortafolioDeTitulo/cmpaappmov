const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');

//registro de usuarios
router.post('/register', [
  body('username')
    .isLength({ min: 4 }).withMessage('El nombre de usuario debe tener al menos 4 caracteres'),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol')
    .notEmpty().withMessage('El rol es obligatorio')
    .isIn(['adminSistema', 'its', 'solicitante', 'coordinador', 'conductor'])
    .withMessage('Rol no válido')
], authController.register);

// login de usuario
router.post('/login', [
  body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
], authController.login);
module.exports = router;