import './Register.css';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/authContext';
import { useRegisterError } from '../../hooks/useRegister/useRegisterError';
import { registerWithRedirect } from '../../services/user.service';

export const Register = () => {
  // `allUser` es la respuesta completa del servicio de registro (status 200)
  const navigate = useNavigate();
  const { allUser, setAllUser, bridgeData, setDeleteUser } = useAuth();
  const { register, handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [okRegister, setOkRegister] = useState(false);

  //------------------------------* Función para enviar el formulario *-------------------------------------------------------------

  const formSubmit = async (formData) => {
    const customFormData = {
      ...formData,
    };
    setSend(true);
    setRes(await registerWithRedirect(customFormData));
    setSend(false);
  };

  //------------------------------* Efecto para manejar la respuesta del formulario *-------------------------------------------------------------

  useEffect(() => {
    console.log(res);
    useRegisterError(res, setOkRegister, setRes);
    if (res?.status === 200) bridgeData('ALLUSER');
  }, [res]);

  useEffect(() => {
    console.log('😍', allUser);
  }, [allUser]);

  useEffect(() => {
    setDeleteUser(() => false);
  }, []);

  //------------------------------* Manejo del estado de navegación *-------------------------------------------------------------

  if (okRegister) {
    return <Navigate to="/verifyCode" />;
  }

  return (
    <div className="register_container">
      <div className="form-register">
        <h4>Registro</h4>
        <form onSubmit={handleSubmit(formSubmit)}>
          <label htmlFor="email">
            <input
              className="input_email1"
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              {...register('email', { required: true })}
              placeholder="Correo electrónico"
            />
          </label>
          <label htmlFor="password">
            <input
              className="input_Password1"
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              {...register('password', { required: true })}
              placeholder="Contraseña"
            />
          </label>
          <div className="btn_container">
            <button className="button--blue" type="submit" disabled={send}>
              Registrarse
            </button>
          </div>
        </form>
        <div className="footerForm">
          <p className="bottom-text p-xs">
            Al hacer clic en el botón Registrarse, aceptas nuestros{' '}
            <Link className="linkr1">Términos y Condiciones</Link> y{' '}
            <Link className="linkr1">Política de Privacidad</Link>.
          </p>
          <p className="p-xs">
            ¿Ya tienes una cuenta?{' '}
            <Link className="linkr1" to="/login">
              <br /> Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
