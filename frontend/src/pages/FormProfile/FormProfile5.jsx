import './FormProfile.css';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAuth } from '../../context/authContext';
import { useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';
import { ProfileSteps } from '../../components/ProfileSteps/ProfileSteps';

export const FormProfile5 = () => {
  const { user, setUser, setDeleteUser } = useAuth();
  const { handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const navigate = useNavigate();

  const defaultData = {
    gender: user?.gender,
  };

  //! ------------ 1) La función que gestiona el formulario----
  const formSubmit = (formData) => {
    const fullData = {
      ...formData,
      gender: formData.gender,
    };

    Swal.fire({
      title: 'Are you sure you want to change your data profile?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(73, 193, 162)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const inputFile = document.getElementById('file-upload');

        const customFormData = {
          ...fullData,
          image: inputFile?.files.length ? inputFile.files[0] : undefined,
        };

        setSend(true);
        setRes(await update(customFormData));
        setSend(false);
      }
    });
  };

  //! -------------- 2) useEffect que gestiona la parte de la respuesta ------- customHook
  useEffect(() => {
    useUpdateError(res, setRes, user, setUser, setUpdatedUser);
  }, [res]);

  useEffect(() => {
    if (updatedUser) {
      setUpdatedUser(false);
      navigate('/profile6');
    }
  }, [updatedUser, navigate]);


  return (
    <>
    <ProfileSteps/>
      <form className="form-update-profile" onSubmit={handleSubmit(formSubmit)}>
        <h2 className="form-title">Selecciona tu género</h2>

        <div className="button-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="Hombre"
              defaultChecked={defaultData.gender === 'Hombre'}
            />
            Hombre
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Mujer"
              defaultChecked={defaultData.gender === 'Mujer'}
            />
            Mujer
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="No binario"
              defaultChecked={defaultData.gender === 'No binario'}
            />
            No binario
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Prefiero no decirlo"
              defaultChecked={defaultData.gender === 'Prefiero no decirlo'}
            />
            Prefiero no decirlo
          </label>
        </div>

        <p className="form-note">
          Esta información nos ayuda a establecer tu perfil.
        </p>

        <button className="button-next" type="submit" disabled={send}>
          Siguiente
        </button>
      </form>
    </>
  );
};
