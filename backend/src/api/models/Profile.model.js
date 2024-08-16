const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//--------------------------------------------------------------------------------------

const ProfileSchema = new Schema(
  {
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    //*Edad
    age: {
    type: Number,
    required:true,
    },
    //*Peso
    weight: {
        type: Number,
        required:true,
    },
    //*Profesión
    job: {
        type: String,
        required:true,
    },
    //*Altura
    height: {
        type:Number,
        required:true,
    },
    //*Lesiones previas
    previousInjuries: {
        type: String,
        trim: true,
    },
},
{ timestamps: true } //Refleja el momento exacto de la modificación
);

const Profile = mongoose.model("Profile", ProfileSchema);

//-------------------Exportación del modelo para su uso en otros archivos------------------------------------
module.exports = Profile;

