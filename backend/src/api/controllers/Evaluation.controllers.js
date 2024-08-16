// controllers/evaluationController.js

const Evaluation = require('../models/Evaluation.model');
const setError = require('../../helpers/handle-error');

// Obtener Evaluación por ID de Usuario
const getEvaluationsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const evaluations = await Evaluation.find({ userId }).populate('userId', 'name email'); // Incluye información del usuario si es necesario
    if (!evaluations || evaluations.length === 0) {
      return res.status(404).json({ message: 'No evaluations found' });
    }

    return res.status(200).json(evaluations);
  } catch (error) {
    return next(setError(500, error.message || 'Error retrieving evaluations'));
  }
};

// Actualizar Evaluación
const updateEvaluation = async (req, res, next) => {
  try {
    const { evaluationId } = req.params;
    const updates = req.body;

    const evaluation = await Evaluation.findByIdAndUpdate(evaluationId, updates, { new: true });
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    return res.status(200).json(evaluation);
  } catch (error) {
    return next(setError(500, error.message || 'Error updating evaluation'));
  }
};

// Exportar controladores
module.exports = { getEvaluationsByUserId, updateEvaluation };
