//----------------------------------* Middleware and utils *-------------------------------------------------
const middleware = require("../../middleware/auth.middleware");
const { deleteImgCloudinary } = require("../../middleware/files.middleware");
const { generateToken } = require("../../utils/token");
const randomPassword = require("../../utils/randomPassword");
const randomCode = require("../../utils/randomCode");
const sendEmail = require("../../utils/sendEmail"); //!sendEmail no ha sido llamado aún

//----------------------------------* Libraries and models*---------------------------------------------------------

const nodemailer = require("nodemailer");
const validator = require("validator");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const setError = require("../../helpers/handle-error");
const express = require("express");

const User = require("../models/User.model");

dotenv.config();

//---------------------------------* REGISTER WITH REDIRECT *-------------------------------------------------------

const registerWithRedirect = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    await User.syncIndexes();
    let confirmationCode = randomCode();
    const userExist = await User.findOne(
      { email: req.body.email },
      { userFullName: req.body.userFullName }
    );
    if (!userExist) {
      const newUser = new User({ ...req.body, confirmationCode });
      if (req.file) {
        newUser.image = req.file.path;
      } else {
        newUser.image = "https://pic.onlinewebfonts.com/svg/img_181369.png";
      }

      try {
        const userSave = await newUser.save();
        const PORT = process.env.PORT;
        if (userSave) {
          return res.redirect(
            303,
            `http://localhost:${PORT}/api/v1/users/register/sendMail/${userSave._id}`
          );
        }
      } catch (error) {
        return res.status(404).json(error.message);
      }
    } else {
      if (req.file) deleteImgCloudinary(catchImg);
      return res.status(409).json("Este usuario ya existe");
    }
  } catch (error) {
    if (req.file) {
      deleteImgCloudinary(catchImg);
    }
    return next(error);
  }
};
//-------------------CONTROLADORES QUE PUEDEN SER REDIRECT-------------------------------------------

/* Se llaman por sí mismos por parte del cliente o vía redirect, como controladores de funciones accesorias */

const sendCode = async (req, res, next) => {
  try {
    //Se saca el param recibido por la ruta
    const { id } = req.params;
    // Se busca user por id para obtener -> Email y código de confirmación
    const userDB = await User.findById(id);
    const emailEnv = process.env.EMAIL; //Se envía el código
    const password = process.env.PASSWORD;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailEnv,
        pass: password,
      },
    });

    const mailOptions = {
      from: emailEnv,
      to: userDB.email,
      subject: "Código de Confirmación para CrossGymApp",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
          <div style="text-align: center; padding: 20px; background-color: #f7f7f7;">
            <h2 style="color: #333;">¡Bienvenido a CrossGymApp!</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px; line-height: 1.5;">
              ¡Gracias por confiar en <strong>CrossGymApp</strong>! Nos alegra mucho tenerte como parte de nuestra comunidad fitness.
            </p>
            <p style="font-size: 16px; line-height: 1.5;">
              Tu código de confirmación es:
            </p>
            <div style="background-color: #f0f0f0; border: 1px solid #ddd; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;">
              ${userDB.confirmationCode}
            </div>
            <p style="font-size: 16px; line-height: 1.5;">
              Por favor, ingrésalo en la plataforma para completar tu registro. Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. Estamos aquí para ayudarte a alcanzar tus metas.
            </p>
            <p style="font-size: 16px; line-height: 1.5;">
              ¡Bienvenido/a a CrossGymApp!
            </p>
            <p style="font-size: 16px; line-height: 1.5;">
              Saludos cordiales,<br>
              El equipo de CrossGymApp<br>
              Gracias por confiar en nosotros
            </p>
          </div>
        </div>
      `,
    };
    

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(404).json({
          user: userDB,
          confirmationCode: "Error, resend code",
        });
      }
      console.log("Email sent: " + info.response);
      return res.status(200).json({
        user: userDB,
        confirmationCode: userDB.confirmationCode,
      });
    });
  } catch (error) {
    return next(error);
  }
};

//------------------------------* RESEND CODE *-------------------------------------------------------------------

const resendCode = async (req, res, next) => {
  try {
    // Se configura nodemailer para el envío del código
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });

    // Se verifica 1º si el usuario existe.
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      const mailOptions = {
        from: email,
        to: req.body.email,
        subject: "Solicitud de Nuevo Código de Confirmación para CrossGymApp",
        html: `
      <div style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
        <div style="text-align: center; padding: 20px; background-color: #f7f7f7;">
          <h2 style="color: #333;">Solicitud de Nuevo Código de Confirmación para CrossGymApp</h2>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; line-height: 1.5;">
            Lamentamos saber que no has recibido el código de confirmación para completar tu registro en <strong>CrossGymApp</strong>. Entendemos lo importante que es para ti completar este proceso y estamos aquí para ayudarte.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            Para solucionar el problema, hemos generado un nuevo código de confirmación que puedes usar para completar tu registro. Por favor, utiliza el siguiente código:
          </p>
          <div style="background-color: #f0f0f0; border: 1px solid #ddd; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;">
            ${userExists.confirmationCode}
          </div>
          <p style="font-size: 16px; line-height: 1.5;">
            Si aún no has recibido el primer código, te recomendamos que revises tu carpeta de spam o correo no deseado, ya que a veces los mensajes pueden ser filtrados allí.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            Si sigues teniendo problemas o necesitas asistencia adicional, no dudes en responder a este correo o ponerte en contacto con nuestro equipo de soporte. Estamos aquí para ayudarte y asegurarnos de que tu experiencia con CrossGymApp sea lo más fluida posible.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            Gracias por tu paciencia y por confiar en CrossGymApp.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            Saludos cordiales,<br>
            El equipo de CrossGymApp
          </p>
        </div>
      </div>
    `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(404).json({
            resend: false,
          });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({
            resend: true,
          });
        }
      });
    } else {
      return res.status(404).json("User not found");
    }
  } catch (error) {
    return next(setError(500, error.message || "Error general send code"));
  }
};

//------------------------------* CHECK NEW USER *-------------------------------------------------------------------

const checkNewUser = async (req, res, next) => {
  try {
    //! nos traemos de la req.body el email y codigo de confirmation
    const { email, confirmationCode } = req.body;

    const userExists = await User.findOne({ email });

    if (!userExists) {
      //!No existe----> 404 de no se encuentra
      return res.status(404).json("User not found");
    } else {
      // cogemos que comparamos que el codigo que recibimos por la req.body y el del userExists es igual
      if (confirmationCode === userExists.confirmationCode) {
        try {
          await userExists.updateOne({ check: true });

          // hacemos un testeo de que este user se ha actualizado correctamente, hacemos un findOne
          const updateUser = await User.findOne({ email });

          // este finOne nos sirve para hacer un ternario que nos diga si la propiedad vale true o false
          return res.status(200).json({
            testCheckOk: updateUser.check == true ? true : false,
          });
        } catch (error) {
          return res.status(404).json(error.message);
        }
      } else {
        try {
          /// En caso dec equivocarse con el codigo lo borramos de la base datos y lo mandamos al registro
          await User.findByIdAndDelete(userExists._id);

          // borramos la imagen
          deleteImgCloudinary(userExists.image);

          // devolvemos un 200 con el test de ver si el delete se ha hecho correctamente
          return res.status(200).json({
            userExists,
            check: false,

            // test en el runtime sobre la eliminacion de este user
            delete: (await User.findById(userExists._id))
              ? "error delete user"
              : "ok delete user",
          });
        } catch (error) {
          return res
            .status(404)
            .json(error.message || "error general delete user");
        }
      }
    }
  } catch (error) {
    // siempre en el catch devolvemos un 500 con el error general
    return next(setError(500, error.message || "General error check code"));
  }
};

//------------------------------* LOG IN *-------------------------------------------------------------------

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email });

    if (userDB) {
      // Verifica si el usuario ha sido verificado
      if (userDB.check === false) {
        return res.status(404).json("User not verified");
      }

      // Compara dos contraseñas: una sin encriptar y otra que sí lo está
      if (bcrypt.compareSync(password, userDB.password)) {
        const token = generateToken(userDB._id, email);
        return res.status(200).json({
          user: userDB,
          token,
        });
      } else {
        return res.status(404).json("Password don't match");
      }
    } else {
      return res.status(404).json("User not registered");
    }
  } catch (error) {
    return next(error);
  }
};

//------------------------------* PASSWORDS *-------------------------------------------------------------------

//------------------------------* CAMBIO DE CONTRASEÑA CUANDO NO ESTA LOGGEADO  *-------------------------------------------------------------------

const changePassword = async (req, res, next) => {
  try {
    /** vamos a recibir  por el body el email y vamos a comprobar que
     * este user existe en la base de datos
     */
    const { email } = req.body;
    console.log(req.body);
    const userDb = await User.findOne({ email });
    if (userDb) {
      /// si existe hacemos el redirect
      const PORT = process.env.PORT;
      return res.redirect(
        307,
        `http://localhost:${PORT}/api/v1/users/sendPassword/${userDb._id}`
      );
    } else {
      return res.status(404).json("User no register");
    }
  } catch (error) {
    return next(error);
  }
};

const sendPassword = async (req, res, next) => {
  try {
    /** VAMOS A BUSCAR AL USER POOR EL ID DEL PARAM */
    const { id } = req.params;
    const userDb = await User.findById(id);
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });
    let passwordSecure = randomPassword();
    console.log(passwordSecure);
    const mailOptions = {
        from: email,
        to: userDb.email,
        subject: "Código de Nuevo Inicio de Sesión para CrossGymApp",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
            <div style="text-align: center; padding: 20px; background-color: #f7f7f7;">
              <h2 style="color: #333;">Solicitud de Cambio de Contraseña</h2>
            </div>
            <div style="padding: 20px;">
              <p style="font-size: 16px; line-height: 1.5;">
                Estimado/a ${userDb.userName},
              </p>
              <p style="font-size: 16px; line-height: 1.5;">
                Hemos recibido una solicitud para cambiar la contraseña de tu cuenta en <strong>CrossGymApp</strong>. A continuación, encontrarás tu nuevo código de inicio de sesión:
              </p>
              <div style="background-color: #f0f0f0; border: 1px solid #ddd; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;">
                ${passwordSecure}
              </div>
              <p style="font-size: 16px; line-height: 1.5;">
                Si no realizaste esta solicitud o si tienes alguna pregunta, por favor, ponte en contacto con nuestro equipo de soporte. Estamos aquí para ayudarte.
              </p>
              <p style="font-size: 16px; line-height: 1.5;">
                Gracias por tu atención y por confiar en CrossGymApp.
              </p>
              <p style="font-size: 16px; line-height: 1.5;">
                Saludos cordiales,<br>
                El equipo de CrossGymApp
              </p>
            </div>
          </div>
        `,
      };
      
      
    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        /// SI HAY UN ERROR MANDO UN 404
        console.log(error);
        return res.status(404).json("dont send email and dont update user");
      } else {
        // SI NO HAY NINGUN ERROR
        console.log("Email sent: " + info.response);
        ///guardamos esta contraseña en mongo db

        /// 1 ) encriptamos la contraseña
        const newPasswordBcrypt = bcrypt.hashSync(passwordSecure, 10);

        try {
          /** este metodo te lo busca por id y luego modifica las claves que le digas
           * en este caso le decimos que en la parte dde password queremos meter
           * la contraseña hasheada
           */
          await User.findByIdAndUpdate(id, { password: newPasswordBcrypt });

          //!------------------ test --------------------------------------------
          // vuelvo a buscar el user pero ya actualizado
          const userUpdatePassword = await User.findById(id);

          // hago un compare sync ----> comparo una contraseña no encriptada con una encrptada
          /// -----> userUpdatePassword.password ----> encriptada
          /// -----> passwordSecure -----> contraseña no encriptada
          if (bcrypt.compareSync(passwordSecure, userUpdatePassword.password)) {
            // si son iguales quiere decir que el back se ha actualizado correctamente
            return res.status(200).json({
              updateUser: true,
              sendPassword: true,
            });
          } else {
            /** si no son iguales le diremos que hemos enviado el correo pero que no
             * hemos actualizado el user del back en mongo db
             */
            return res.status(404).json({
              updateUser: false,
              sendPassword: true,
            });
          }
        } catch (error) {
          return res.status(404).json(error.message);
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};
//*Antes de estar logeado es change password y modifypassword es cuando entras ya logeado y quieres cambiar la contraseña.

//--------------------------* CAMBIO DE CONTRASEÑA CUANDO YA SE ESTA ESTA LOGADO *------------------------------------------------

const modifyPassword = async (req, res, next) => {
  /** IMPORTANTE ---> REQ.USER ----> LO CREAR LOS AUTH MIDDLEWARE */
  console.log("req.user", req.user);

  try {
    const { password, newPassword } = req.body;
    const { _id } = req.user;

    /** comparamos la contrasela vieja sin encriptar y la encriptada */
    if (bcrypt.compareSync(password, req.user.password)) {
      /** tenemos que encriptar la contraseña para poder guardarla en el back mongo db */
      const newPasswordHashed = bcrypt.hashSync(newPassword, 10);

      /** vamos a actualizar la contraseña en mongo db */
      try {
        await User.findByIdAndUpdate(_id, { password: newPasswordHashed });

        /** TESTING EN TIEMPO REAL  */

        //1) Traemos el user actualizado
        const userUpdate = await User.findById(_id);

        // 2) vamos a comparar la contraseña sin encriptar y la tenemos en el back que esta encriptada
        if (bcrypt.compareSync(newPassword, userUpdate.password)) {
          /// SI SON IGUALES 200 ---> UPDATE OK
          return res.status(200).json({
            updateUser: true,
          });
        } else {
          ///NO SON IGUALES -------> 404 no son iguales
          return res.status(404).json({
            updateUser: false,
          });
        }
      } catch (error) {
        return res.status(404).json(error.message);
      }
    } else {
      /** si las contraseñas no son iguales le mando un 404 diciendo que las contraseñas no son iguales */
      return res.status(404).json("password dont match");
    }
  } catch (error) {
    return next(error);
    /**
     * return next(
      setError(
        500,
        error.message || 'Error general to ChangePassword with AUTH'
      )
    );
     */
  }
};

//-----------------------------------* UPDATE *-------------------------------------------------------------



//-----------------------------------* AUTO LOGIN *-------------------------------------------------------------

const autoLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email });

    if (userDB) {
      // comparo dos contraseñas encriptadas
      if (password == userDB.password) {
        const token = generateToken(userDB._id, email);
        return res.status(200).json({
          user: userDB,
          token,
        });
      } else {
        return res.status(404).json("password dont match");
      }
    } else {
      return res.status(404).json("User no register");
    }
  } catch (error) {
    return next(error);
  }
};

// -------------------------------------- UPDATE --------------------------------------------------------
const update = async (req, res, next) => {
  // capturamos la imagen nueva subida a cloudinary
  let catchImg = req.file?.path;

  try {
    // actualizamos los elementos unique del modelo
    await User.syncIndexes();

    // instanciamos un nuevo objeto del modelo de user con el req.body
    const patchUser = new User(req.body);

    // si tenemos imagen metemos a la instancia del modelo esta imagen nuevo que es lo que capturamos en catchImg
    req.file && (patchUser.image = catchImg);

    /** vamos a salvaguardar info que no quiero que el usuario pueda cambiarme */
    // AUNQUE ME PIDA CAMBIAR ESTAS CLAVES NO SE LO VOY A CAMBIAR
    patchUser._id = req.user._id;
    patchUser.password = req.user.password;
    patchUser.rol = req.user.rol;
    patchUser.confirmationCode = req.user.confirmationCode;
    patchUser.email = req.user.email;
    patchUser.check = req.user.check;
    patchUser.comments = req.user.comments;
    patchUser.profile = req.user.profile;
    patchUser.evaluation = req.user.evaluation;
     

    if (req.body?.gender) {
      // lo comprobamos y lo metermos en patchUser con un ternario en caso de que sea true o false el resultado de la funcion
      const resultEnum = enumOk("enumGender", req.body?.gender);
      patchUser.gender = resultEnum.check ? req.body?.gender : req.user.gender;
    }

    try {
      /** hacemos una actualizacion NO HACER CON EL SAVE
       * le metemos en el primer valor el id de el objeto a actualizar
       * y en el segundo valor le metemos la info que queremos actualizar
       */
      await User.findByIdAndUpdate(req.user._id, patchUser);

      // si nos ha metido una imagen nueva y ya la hemos actualizado pues tenemos que borrar la antigua
      // la antigua imagen la tenemos guardada con el usuario autenticado --> req.user
      if (req.file) deleteImgCloudinary(req.user.image);

      // ++++++++++++++++++++++ TEST RUNTIME+++++++++++++++++++++++++++++++++++++++
      /** siempre lo pprimero cuando testeamos es el elemento actualizado para comparar la info que viene
       * del req.body
       */
      const updateUser = await User.findById(req.user._id);

      /** sacamos las claves del objeto del req.body para saber que info nos han pedido actualizar */
      const updateKeys = Object.keys(req.body);

      // creamos un array donde guardamos los test
      const testUpdate = [];

      // recorremos el array de la info que con el req.body nos dijeron de actualizar
      /** recordar este array lo sacamos con el Object.keys */

      // updateKeys ES UN ARRAY CON LOS NOMBRES DE LAS CLAVES = ["name", "email", "rol"]

      ///----------------> para todo lo diferente de la imagen ----------------------------------

      updateKeys.forEach((item) => {
        /** vamos a comprobar que la info actualizada sea igual que lo que me mando por el body... */
        if (updateUser[item] === req.body[item]) {
          /** aparte vamos a comprobar que esta info sea diferente a lo que ya teniamos en mongo subido antes */
          if (updateUser[item] != req.user[item]) {
            // si es diferente a lo que ya teniamos lanzamos el nombre de la clave y su valor como true en un objeto
            // este objeto see pusea en el array que creamos arriba que guarda todos los testing en el runtime
            testUpdate.push({
              [item]: true,
            });
          } else {
            // si son igual lo que pusearemos sera el mismo objeto que arrriba pro diciendo que la info es igual
            testUpdate.push({
              [item]: "sameOldInfo",
            });
          }
        } else {
          testUpdate.push({
            [item]: false,
          });
        }
      });

      //--------------------------para la imagen----------------------------------
      if (req.file) {
        /** si la imagen del user actualizado es estrictamente igual a la imagen nueva que la
         * guardamos en el catchImg, mandamos un objeto con la clave image y su valor en true
         * en caso contrario mandamos esta clave con su valor en false
         */
        updateUser.image === catchImg
          ? testUpdate.push({
              image: true,
            })
          : testUpdate.push({
              image: false,
            });
      }

      /** una vez finalizado el testing en el runtime vamos a mandar el usuario actualizado y el objeto
       * con los test
       */
      return res.status(200).json({
        updateUser: await User.findById(req.user._id),
        testUpdate,
      });
    } catch (error) {
      if (req.file) deleteImgCloudinary(catchImg);
      return res.status(404).json(error.message);
    }
  } catch (error) {
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};

//-------------------------------*GET BY ID*-------------------------------------------------------------

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userById = await User.findById(id);
    if (userById) {
      return res.status(200).json(userById);
    } else {
      return res.status(404).json("no se ha encontrado el usuario");
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};



//--------------------------------*GET ALL*-------------------------------------------------------------

const getAll = async (req, res, next) => {
  try {
    const allUser = await User.find()
    /** el find nos devuelve un array */
    if (allUser.length > 0) {
      return res.status(200).json(allUser);
    } else {
      return res.status(404).json("no se han encontrado los usuarios");
    }
  } catch (error) {
    return res.status(404).json({
      error: "error al buscar - lanzado en el catch",
      message: error.message,
    });
  }
};


//!------------
//? GET BY NAME
//!------------

const getByName = async (req, res, next) => {
  //es para name y para userName!!
  try {
    console.log(req.body);
    let { name } = req.params;

    console.log(name);
    const UsersByName = await User.find({
      $or: [
        { userName: { $regex: name, $options: "i" } },
        { nickName: { $regex: name, $options: "i" } },
      ],
    });
    console.log(UsersByName);
    if (UsersByName.length > 0) {
      return res.status(200).json(UsersByName);
    } else {
      return res
        .status(404)
        .json("That username doesn't show up in our database.");
    }
  } catch (error) {
    return (
      res.status(500).json({
        error: "Error en el catch",
        message: error.message,
      }) && next(error)
    );
  }
};

//-------------------------------------------------------------------------------------------------------------------------

module.exports = {
  sendCode,
  registerWithRedirect,
  resendCode,
  checkNewUser,
  login,
  autoLogin,
  changePassword,
  sendPassword,
  modifyPassword,
  getById,
  getAll,
  getByName,
  update,
};