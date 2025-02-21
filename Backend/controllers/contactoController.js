// controllers/contactoController.js
const Contacto = require('../models/contacto');

// Obtener todos los contactos
exports.getContactos = async (req, res) => {
    try {
        const contactos = await Contacto.findAll();
        res.status(200).json(contactos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los contactos' });
    }
};

// Obtener un contacto por ID
exports.getContactoById = async (req, res) => {
    try {
        const contacto = await Contacto.findByPk(req.params.id);
        if (!contacto) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }
        res.status(200).json(contacto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el contacto' });
    }
};

// Crear un nuevo contacto
exports.createContacto = async (req, res) => {
    try {
        const { Nombre, tipo_contacto, Dirección, Teléfono, Mail, Activo } = req.body;
        const nuevoContacto = await Contacto.create({
            Nombre,
            tipo_contacto,
            Dirección,
            Teléfono,
            Mail,
            Activo
        });
        res.status(201).json({ message: 'Contacto creado', contacto: nuevoContacto });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el contacto' });
    }
};

// Actualizar un contacto existente
exports.updateContacto = async (req, res) => {
    try {
        const { Nombre, tipo_contacto, Dirección, Teléfono, Mail, Activo } = req.body;
        const contacto = await Contacto.findByPk(req.params.id);
        if (!contacto) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        await contacto.update({
            Nombre,
            tipo_contacto,
            Dirección,
            Teléfono,
            Mail,
            Activo
        });

        res.status(200).json({ message: 'Contacto actualizado', contacto });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el contacto' });
    }
};

// Eliminar un contacto
exports.deleteContacto = async (req, res) => {
    try {
        const contacto = await Contacto.findByPk(req.params.id);
        if (!contacto) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        await contacto.destroy();
        res.status(200).json({ message: 'Contacto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el contacto' });
    }
};
