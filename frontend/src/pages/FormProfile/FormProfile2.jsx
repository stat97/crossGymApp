import './FormProfile.css';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { Uploadfile } from '../../components/UploadFile/Uploadfile';
import { useAuth } from '../../context/authContext';
import { useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';

export const FormProfile2 = () => {
  const { user, setUser } = useAuth();
  const { handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const navigate = useNavigate();

 
  //! ------------ 1) La función que gestiona el formulario----
  const formSubmit = (formData) => {
    const fullData = {
      ...formData,
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
      navigate('/profile3');
    }
  }, [updatedUser, navigate]);

  return (
    <>
      <form className="form-update-profile" onSubmit={handleSubmit(formSubmit)}>
        <label htmlFor="file-upload-form">Change profile photo</label>
        <Uploadfile />

        <button className="button--blue" type="submit" disabled={send}>
          Siguiente
        </button>
      </form>
    </>
  );
};
