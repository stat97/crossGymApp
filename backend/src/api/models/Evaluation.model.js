const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EvaluationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    objectives: {
      type: [Number], // Array para almacenar los objetivos, e.g., [2, 3]
      required: true,
    },
    overheadSquatVideo: {
      type: String, // URL del video
    },
    kneeToWall: {
      type: Number, // Medida en cm
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: "Knee to Wall debe ser mayor o igual a 0",
      },
    },
    singleLegSquat: {
      score: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      trunkInclination: Boolean,
      pelvicInclination: Boolean,
      hipAdduction: Boolean,
      kneeValgus: Boolean,
      balanceLoss: Boolean,
    },
    hip: {
      rom: {
        type: Number,
      },
      abductionStrength: {
        type: Number,
      },
      adductionStrength: {
        type: Number,
      },
    },
    dorsal: {
      seatedRom: {
        type: Number,
      },
    },
    shoulder: {
      romInternal: {
        type: Number,
      },
      romExternal: {
        type: Number,
      },
      strengthInternal: {
        type: Number,
      },
      strengthExternal: {
        type: Number,
      },
    },
    pain: {
      eva: {
        type: Number,
        min: 0,
        max: 10,
      },
      rpe: {
        type: Number,
        min: 0,
        max: 10,
      },
      cs: {
        type: Number,
        min: 0,
        max: 10,
      },
      stress: {
        type: Number,
        min: 0,
        max: 10,
      },
      stiffness: {
        type: Number,
        min: 0,
        max: 10,
      },
    },
  },
  { timestamps: true }
);

const Evaluation = mongoose.model("Evaluation", EvaluationSchema);
module.exports = Evaluation;
