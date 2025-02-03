const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Registrar un nuevo usuario
router.post("/register", authController.registerUser);

// Iniciar sesión
router.post("/login", authController.loginUser);

module.exports = router;