
import './Register.css';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { Uploadfile } from '../../components/UploadFile/Uploadfile';
import { useAuth } from '../../context/authContext';
import { useRegisterError } from '../../hooks/useRegisterError';
import { registerWithRedirect } from '../../services/user.service';

export const Register = () => {
  // allUser es la respuesta completa del 200 del service de registro
  const navigate = useNavigate();
  const { allUser, setAllUser, bridgeData, setDeleteUser } = useAuth();
  const { register, handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [okRegister, setOkRegister] = useState(false);

  //------------------------------* Función para el formulario *-------------------------------------------------------------

  const formSubmit = async (formData) => {
    const inputFile = document.getElementById('file-upload').files;

    if (inputFile.length != 0) {
      // Si no es 0 --> Hay una imagen
      const custonFormData = {
        ...formData,
        image: inputFile[0],
      };

      setSend(true);
      setRes(await registerWithRedirect(custonFormData));
      setSend(false);
    } else {
      const custonFormData = {
        ...formData,
      };
      setSend(true);
      setRes(await registerWithRedirect(custonFormData));
      setSend(false);
    }
  };

  //------------------------------* Parte 2: Función para el formulario *-------------------------------------------------------------
  // AllUser: Los usuarios que vienen del register
  // User: Los usuarios que vienen del login

  useEffect(() => {
    console.log(res);
    useRegisterError(res, setOkRegister, setRes);
    if (res?.status == 200) bridgeData('ALLUSER');
  }, [res]);

  useEffect(() => {
    console.log('😍', allUser);
  }, [allUser]);

  useEffect(() => {
    setDeleteUser(() => false);
  }, []);

  //------------------------------* Estados de navegación *-------------------------------------------------------------
  if (okRegister) {
    return <Navigate to="/verifyCode" />;
  }

  return (
    <>
      <div className="register_container">
        <div className="form-register">
          <h4>SIGN UP</h4>
          <form onSubmit={handleSubmit(formSubmit)}>
            <label htmlFor="input_user">
              <input
                className="input_user"
                type="text"
                id="userName"
                name="userName"
                autoComplete="false"
                {...register('userName', { required: true })}
                placeholder="Nombre"
              />
            </label>

            <label htmlFor="input_password">
              <input
                className="input_user"
                type="password"
                id="password"
                name="password"
                autoComplete="false"
                {...register('password', { required: true })}
                placeholder="Password"
              />
            </label>

            <label htmlFor="input_email">
              <input
                className="input_user"
                type="email"
                id="email"
                name="email"
                autoComplete="false"
                {...register('email', { required: true })}
                placeholder="Email"
              />
            </label>
            <div className="gender">
              <label htmlFor="hombre" className="label-radio hombre">
                Hombre
              </label>
              <input
                type="radio"
                name="gender"
                id="Male"
                value="Male"
                {...register('gender')}
              />
              <label htmlFor="mujer" className="label-radio mujer">
                Mujer
              </label>
              <input
                type="radio"
                name="gender"
                id="Female"
                value="Female"
                {...register('gender')}
              />
            </div>

            <Uploadfile />
            <div className="btn_container">
              <button className="button--blue" type="submit" disabled={send}>
                Registro
              </button>
            </div>
          </form>
          <div className="footerForm">
            <p className="bottom-text p-xs">
            Al hacer clic en el botón Registrarse, aceptas nuestros{' '}
              <Link className="linkr1">Términos y Condiciones</Link> y{' '}
              <Link className="linkr1">Política de Privacidad</Link>.
            </p>
            <p className=" p-xs">
              ¿Ya tienes una cuenta?{' '}
              <Link className="linkr1" to="/login">
                <br /> Logeate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};