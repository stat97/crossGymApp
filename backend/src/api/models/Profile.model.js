const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//--------------------------------------------------------------------------------------

const ProfileSchema = new Schema(
  {

    age: {
    type: Number,
    required:true,
    },
    weight: {
        type: Number,
        required:true,
    },
    job: {
        type: String,
        required:true,
    },

},
{ timestamps: true } //Refleja el momento exacto de la modificación
);

const Profile = mongoose.model("Profile", ProfileSchema);

//-------------------Exportación del modelo para su uso en otros archivos------------------------------------
module.exports = Profile;

// Ok