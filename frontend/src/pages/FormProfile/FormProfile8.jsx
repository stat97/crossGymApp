import './FormProfile.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAuth } from '../../context/authContext';
import { useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';
import { ProfileSteps } from '../../components/ProfileSteps/ProfileSteps';

export const FormProfile8 = () => {
  const { user, setUser } = useAuth();
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const navigate = useNavigate();

  const formSubmit = async (formData) => {
    const fullData = {
      ...formData,
      sports: formData.sports || [], // Asegura que sports sea un array
    };

    Swal.fire({
      title: '¿Estás seguro de que quieres cambiar tus deportes?',
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
      <fieldset>
        <legend>¿Qué deportes sueles practicar?</legend>
        <div className="checkbox-group">
          {['Fitness', 'Rocódromo', 'Yoga', 'Entrenamiento Personal', 'Crosstraining', 'Deka/Hyrox'].map((sport) => (
            <label key={sport} className="checkbox-label">
              <input
                className='sportprofile'
                type="checkbox"
                value={sport}
                {...register('sports')} // Usa el register para gestionar la selección
                defaultChecked={user?.sports?.includes(sport)}
              />
              {sport}
            </label>
          ))}
        </div>
      </fieldset>
      <button className="button--blue" type="submit" disabled={send}>
        Guardar
      </button>
    </form>
    </>
  );
};
