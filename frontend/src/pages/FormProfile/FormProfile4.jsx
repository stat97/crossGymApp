import './FormProfile.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAuth } from '../../context/authContext';
import { useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';
import { ProfileSteps } from '../../components/ProfileSteps/ProfileSteps';

export const FormProfile4 = () => {
  const { user, setUser } = useAuth();
  const { handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const navigate = useNavigate();

  const defaultData = {
    height: user?.height?? '',
    weight: user?.weight?? '',
  };

  const formSubmit = async (formData) => {
    const fullData = {
      ...formData,
      height: formData.height,
      weight: formData.weight,
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
      navigate('/profile5');
    }
  }, [updatedUser, navigate]);

  return (
    <>
    <ProfileSteps/>
    <form className="form-update-profile" onSubmit={handleSubmit(formSubmit)}>
      <label htmlFor="height">Altura (m)</label>
      <input
        className="input_user"
        type="text"
        id="height"
        name="height"
        autoComplete="off"
        defaultValue={defaultData?.height}
      />
      <label htmlFor="weight">Peso (kg)</label>
      <input
        className="input_user"
        type="text"
        id="weight"
        name="weight"
        autoComplete="off"
        defaultValue={defaultData?.weight}
      />
      <button className="button--blue" type="submit" disabled={send}>
        Siguiente
      </button>
    </form>
    </>
  );
};
