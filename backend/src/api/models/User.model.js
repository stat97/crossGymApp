const bcrypt = require("bcrypt");
const validator = require("validator");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//--------------------------------------------------------------------------------------

const UserSchema = new Schema(
  {
    userFullName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: [validator.isEmail, "Email not valid"],
      // Si el email no es válido, se lanzará el error ----> "Email not valid"
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      required: true,
    },
    rol: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isStrongPassword],
    }, //minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1
    image: {
      type: String,
    },
    confirmationCode: {
      type: Number,
      required: true,
    },
    check: {
      type: Boolean,
      default: false,
    },

    profile: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
      },

  },
  { timestamps: true } //Refleja el momento exacto de la modificación
);

UserSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next("Error hashing password", error);
  }
});
const User = mongoose.model("User", UserSchema);

//-------------------Exportación del modelo para su uso en otros archivos------------------------------------
module.exports = User;

// Ok