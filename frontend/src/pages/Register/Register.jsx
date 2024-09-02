import './Register.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/authContext';
import { useRegisterError } from '../../hooks/useRegister/useRegisterError';
import { registerWithRedirect } from '../../services/user.service';

export const Register = () => {
  const navigate = useNavigate();
  const { allUser, setAllUser, bridgeData, setDeleteUser } = useAuth();
  const { register, handleSubmit, watch, setError, clearErrors, formState: { errors } } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [okRegister, setOkRegister] = useState(false);

  const formSubmit = async (formData) => {
    const customFormData = {
      ...formData,
    };
    setSend(true);
    setRes(await registerWithRedirect(customFormData));
    setSend(false);
  };

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

  if (okRegister) {
    return <Navigate to="/verifyCode" />;
  }

  // Watch password fields
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

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
              {...register('email', { required: 'Correo electrónico es requerido' })}
              placeholder="Correo electrónico"
            />
            {errors.email && <p>{errors.email.message}</p>}
          </label>
          <label htmlFor="password">
            <input
              className="input_Password1"
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              {...register('password', { required: 'Contraseña es requerida' })}
              placeholder="Contraseña"
            />
            {errors.password && <p>{errors.password.message}</p>}
          </label>
          <label htmlFor="confirmPassword">
            <input
              className="input_Password1"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="off"
              {...register('confirmPassword', {
                required: 'Confirmar contraseña es requerido',
                validate: value =>
                  value === password || 'Las contraseñas no coinciden'
              })}
              placeholder="Repita su contraseña"
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
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
