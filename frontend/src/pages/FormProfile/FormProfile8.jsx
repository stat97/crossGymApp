import './FormProfile.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAuth } from '../../context/authContext';
import { useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';

export const FormProfile8 = () => {
  const { user, setUser } = useAuth();
  const { handleSubmit, setValue } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const [selectedSports, setSelectedSports] = useState(user?.sports || []);
  const navigate = useNavigate();

  const defaultData = {
    sports: user?.sports || [],
  };

  const handleSportChange = (event) => {
    const { value, checked } = event.target;
    setSelectedSports((prevSports) =>
      checked ? [...prevSports, value] : prevSports.filter(sport => sport !== value)
    );
  };

  const formSubmit = async (formData) => {
    const fullData = {
      ...formData,
      sports: selectedSports,
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
      <fieldset>
        <legend>Selecciona los deportes que practicas</legend>
        <div className="checkbox-group">
          {['Fitness', 'Rocódromo', 'Yoga', 'Entrenamiento Personal', 'Crosstraining', 'Deka/Hyrox'].map((sport) => (
            <label key={sport} className="checkbox-label">
              <input
                type="checkbox"
                value={sport}
                checked={selectedSports.includes(sport)}
                onChange={handleSportChange}
              />
              {sport}
            </label>
          ))}
        </div>
      </fieldset>
      <button className="button--blue" type="submit" disabled={send}>
        Actualizar
      </button>
    </form>
  );
};
