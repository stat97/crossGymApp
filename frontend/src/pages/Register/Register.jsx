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
  const { register, handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [okRegister, setOkRegister] = useState(false);

  // Función para el formulario
  const formSubmit = async (formData) => {
    setSend(true);
    try {
      const response = await registerWithRedirect(formData);
      setRes(response);
    } catch (error) {
      setRes({ response: { status: 500, data: error.message } });
    } finally {
      setSend(false);
    }
  };

  useEffect(() => {
    useRegisterError(res, setOkRegister, setRes);
    if (res?.status === 200) {
      bridgeData('ALLUSER');
    }
  }, [res]);

  useEffect(() => {
    setDeleteUser(false);
  }, []);

  if (okRegister) {
    return <Navigate to="/verifyCode" />;
  }

  return (
    <div className="register_container">
      <div className="form-register">
        <h4>SIGN UP</h4>
        <form onSubmit={handleSubmit(formSubmit)}>
          <label htmlFor="email">
            <input
              className="input_user"
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              {...register('email', { required: true })}
              placeholder="Email"
            />
          </label>
          <label htmlFor="password">
            <input
              className="input_user"
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              {...register('password', { required: true })}
              placeholder="Password"
            />
          </label>
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
          <p className="p-xs">
            ¿Ya tienes una cuenta?{' '}
            <Link className="linkr1" to="/login">
              Logeate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
