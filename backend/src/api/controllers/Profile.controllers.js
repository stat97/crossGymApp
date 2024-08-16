// controllers/profileController.js

const Profile = require('../models/Profile.model');
const setError = require('../../helpers/handle-error');

// Obtener Perfil por ID de Usuario
const getProfileByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ userId }).populate('userId', 'name email'); // Incluye información del usuario si es necesario
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    return next(setError(500, error.message || 'Error retrieving profile'));
  }
};

// Actualizar Perfil
const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const profile = await Profile.findOneAndUpdate({ userId }, updates, { new: true });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    return next(setError(500, error.message || 'Error updating profile'));
  }
};

// Exportar controladores
module.exports = { getProfileByUserId, updateProfile };
