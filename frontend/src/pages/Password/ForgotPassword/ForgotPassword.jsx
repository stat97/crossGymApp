import './ForgotPassword.css';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { useForgotPasswordError } from '../../../hooks';
import { changePassword } from '../../../services/user.service';

export const ForgotPassword = () => {
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [forgotOk, setForgotOk] = useState(false);
  //! 1)-------------------- LA FUNCIOON QUE SE ENCARGA DE GESTIONAR LOS DATOS DEL FORMULARIO

  const formSubmit = async (formData) => {
    setSend(true);
    setRes(await changePassword(formData));
    setSend(false);
  };
  //! 2) ----------------USEEFFECT QUE GESTIONA LA RES CON SUS ERRORES Y SUS 200
  useEffect(() => {
    useForgotPasswordError(res, setRes, setForgotOk);
  }, [res]);

  //! 3) ---------------- ESTADOS DE NAVEGACION O QUE LA fiuncion ESTA ok
  if (forgotOk) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <div className="reset_password">
        <div className="reset">
          <h4>Resetea su contraseña</h4>
          <p>Porfavor escriba su email para recibir su nueva contraseña</p>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="input_form">
              <input
                className="input_user"
                type="email"
                id="email"
                name="email"
                autoComplete="false"
                placeholder="Email"
                {...register('email', { required: true })}
              />
              <button className="btn_container" type="submit" disabled={send}>
                Cambia tu contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};