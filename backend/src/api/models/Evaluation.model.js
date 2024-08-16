const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EvaluationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //*escala visual analógica para el dolor
    eva: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    //*escala de percepción de esfuerzo durante el entrenamiento
    rpe: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    //*Calidad de sueño
    cs: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    //*Nivel de estrés
    stress: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    //*Nivel de rigidez
    stiffness: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
  },
  { timestamps: true }
);

const Evaluation = mongoose.model("Evaluation", EvaluationSchema);
module.exports = Evaluation;
