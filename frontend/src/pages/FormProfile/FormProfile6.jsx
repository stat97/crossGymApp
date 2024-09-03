import './FormProfile.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAuth } from '../../context/authContext';
import { useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';
import { ProfileSteps } from '../../components/ProfileSteps/ProfileSteps';

export const FormProfile6 = () => {
  const { user, setUser } = useAuth();
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const navigate = useNavigate();

  const defaultData = {
    job: user?.job?? '',
  };

  const formSubmit = async (formData) => {
    const fullData = {
      ...formData,
      job: formData.job,
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
        const inputFile = document.getElementById('file-upload');
        const customFormData = {
          ...fullData,
          image: inputFile?.files.length ? inputFile.files[0] : undefined,
        };

        setSend(true);
        const response = await update(customFormData);
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
    <>
    <ProfileSteps/>
    <form className="form-update-profile" onSubmit={handleSubmit(formSubmit)}>
      <label htmlFor="job">¿Cuál es tu actual profesión?</label>
      <input
        className="input_user"
        type="text"
        id="job"
        name="job"
        autoComplete="off"
        defaultValue={defaultData?.job}

      />
      <button className="button--blue" type="submit" disabled={send}>
        Siguiente
      </button>
    </form>
    </>
  );
};
