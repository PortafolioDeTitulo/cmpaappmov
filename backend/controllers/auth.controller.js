const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getPool, sql } = require('../db');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, rol, nombre, rut, correo, centro, areaDesempeno, departamento } = req.body;

  try {
    const pool = await getPool();
    const existingUserResult = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Usuarios WHERE username = @username');

    if (existingUserResult.recordset.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password_hash', sql.NVarChar, hashedPassword)
      .input('rol', sql.NVarChar, rol)
      .input('nombre', sql.NVarChar, nombre)
      .input('rut', sql.NVarChar, rut)
      .input('correo', sql.NVarChar, correo)
      .input('centro', sql.NVarChar, centro)
      .input('areaDesempeno', sql.NVarChar, areaDesempeno)
      .input('departamento', sql.NVarChar, departamento)
      .query(`INSERT INTO Usuarios (username, password_hash, rol, nombre, rut, correo, centro, areaDesempeno, departamento)
              VALUES (@username, @password_hash, @rol, @nombre, @rut, @correo, @centro, @areaDesempeno, @departamento)`);

    res.json({ message: 'Usuario registrado correctamente' });

  } catch (err) {
    console.error('Error during registration:', err);
    // Check for specific error types if necessary, e.g., connection errors vs query errors
    if (err.code === 'EREQUEST' || err.code === 'ECONNCLOSED') {
        return res.status(503).json({ message: 'Database operation failed. Please try again later.', error: err.message });
    }
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// LOGIN DE USUARIO
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const pool = await getPool();
    const userResult = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Usuarios WHERE username = @username');

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = userResult.recordset[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ username: user.username, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({
      message: 'Login exitoso',
      token,
      username: user.username,
      rol: user.rol
    });

  } catch (err) {
    console.error('Error during login:', err);
    if (err.code === 'EREQUEST' || err.code === 'ECONNCLOSED') {
        return res.status(503).json({ message: 'Database operation failed. Please try again later.', error: err.message });
    }
    res.status(500).json({ message: 'Error logging in user', error: err.message });
  }
};

// protecccion de rutas
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });

    req.userId = decoded.username;
    req.userRol = decoded.rol;
    next();
  });
}