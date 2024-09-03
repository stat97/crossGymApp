import './FormProfile.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAuth } from '../../context/authContext';
import { useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';
import { ProfileSteps } from '../../components/ProfileSteps/ProfileSteps';

export const FormProfile7 = () => {
  const { user, setUser } = useAuth();
  const { handleSubmit, setValue } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(user?.objective || '');
  const navigate = useNavigate();

  const defaultData = {
    objective: user?.objective,
  };

  const formSubmit = async (formData) => {
    const fullData = {
      ...formData,
      objective: selectedObjective,
    };

    Swal.fire({
      title: '¿Estás seguro de que quieres cambiar tu objetivo?',
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
      setUpdatedUser(true);
      navigate('/profile8');
    }
  }, [updatedUser, navigate]);

  return (
    <>
    <ProfileSteps/>
    <form className="form-update-profile" onSubmit={handleSubmit(formSubmit)}>
      <fieldset>
        <legend>Selecciona un objetivo</legend>
        <div className="button-group">
          <button
            type="button"
            className={`objective-button ${selectedObjective === 'Salud' ? 'selected' : ''}`}
            onClick={() => setSelectedObjective('Salud')}
          >
            Salud
          </button>
          <button
            type="button"
            className={`objective-button ${selectedObjective === 'Fitness' ? 'selected' : ''}`}
            onClick={() => setSelectedObjective('Fitness')}
          >
            Fitness
          </button>
          <button
            type="button"
            className={`objective-button ${selectedObjective === 'Rendimiento' ? 'selected' : ''}`}
            onClick={() => setSelectedObjective('Rendimiento')}
          >
            Rendimiento
          </button>
          <button
            type="button"
            className={`objective-button ${selectedObjective === 'Lesion/Readaptación' ? 'selected' : ''}`}
            onClick={() => setSelectedObjective('Lesion/Readaptación')}
          >
            Lesión/Readaptación
          </button>
        </div>
      </fieldset>
      <button className="button--blue" type="submit" disabled={send}>
        Actualizar
      </button>
    </form>
    </>
  );
};
