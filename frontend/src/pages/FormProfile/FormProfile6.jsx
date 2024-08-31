import './FormProfile.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAuth } from '../../context/authContext';
import { useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';

export const FormProfile6 = () => {
  const { user, setUser } = useAuth();
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const navigate = useNavigate();

  const defaultData = {
    job: user?.job,
  };

  const formSubmit = async (formData) => {
    const fullData = {
      ...formData,
    };

    Swal.fire({
      title: '¿Estás seguro de que quieres cambiar tu trabajo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(73, 193, 162)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SÍ',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSend(true);
        const response = await update(fullData);
        setRes(response);
        setSend(false);
      }
    });
  };

  useEffect(() => {
    console.log('Effect triggered with res:', res);
    if (Object.keys(res).length > 0) {
      useUpdateError(res, setRes, user, setUser, setUpdatedUser);
    }
  }, [res]);

  useEffect(() => {
    if (updatedUser) {
      setUpdatedUser(false);
      navigate('/profile7');
    }
  }, [updatedUser, navigate]);

  return (
    <form className="form-update-profile" onSubmit={handleSubmit(formSubmit)}>
      <label htmlFor="job">Trabajo</label>
      <input
        className="input_user"
        type="text"
        id="job"
        name="job"
        autoComplete="off"
        defaultValue={defaultData?.job}
        {...register('job', { required: true })}
      />
      <button className="button--blue" type="submit" disabled={send}>
        Actualizar
      </button>
    </form>
  );
};
