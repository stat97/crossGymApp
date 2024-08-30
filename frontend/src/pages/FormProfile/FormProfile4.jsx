import './FormProfile.css';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAuth } from '../../context/authContext';
import { useDeleteUser, useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';
import { Uploadfile } from '../../components/UploadFile/Uploadfile';

export const FormProfile4 = () => {
  const { user, setUser, setDeleteUser } = useAuth();
  const { handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const navigate = useNavigate();

  const defaultData = {
    height: user?.height,
    weight: user?.weight,
    
  };

  //! ------------ 1) La función que gestiona el formulario----
  const formSubmit = (formData) => {
    const fullData = {
      ...formData,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,

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
      navigate('/profile4');
    }
  }, [updatedUser, navigate]);

  return (
    <>
      
          <form className="form-update-profile" onSubmit={handleSubmit(formSubmit)}>
            <label htmlFor="height">Altura</label>
            <input
              className="input_user"
              type="text"
              id="height"
              name="height"
              autoComplete="off"
              defaultValue={defaultData?.height}
            />
            <label htmlFor="weight">Peso</label>
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
