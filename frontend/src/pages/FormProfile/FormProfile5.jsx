import './FormProfile.css';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAuth } from '../../context/authContext';
import { useDeleteUser, useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';
import { Uploadfile } from '../../components/UploadFile/Uploadfile';

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
        gender: document.getElementById('gender').value,

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
      navigate('/profile5');
    }
  }, [updatedUser, navigate]);
  return (
    <>
      <form className="form-update-profile" onSubmit={handleSubmit(formSubmit)}>
        <h2 className="form-title">Selecciona tu género</h2>
  
        <div className="button-group">
          <button 
            type="button" 
            className={`form-button ${selectedGender === 'Hombre' ? 'selected' : ''}`} 
            onClick={() => setSelectedGender('Hombre')}
          >
            Hombre
          </button>
          <button 
            type="button" 
            className={`form-button ${selectedGender === 'Mujer' ? 'selected' : ''}`} 
            onClick={() => setSelectedGender('Mujer')}
          >
            Mujer
          </button>
          <button 
            type="button" 
            className={`form-button ${selectedGender === 'No binario' ? 'selected' : ''}`} 
            onClick={() => setSelectedGender('No binario')}
          >
            No binario
          </button>
          <button 
            type="button" 
            className={`form-button ${selectedGender === 'Prefiero no decirlo' ? 'selected' : ''}`} 
            onClick={() => setSelectedGender('Prefiero no decirlo')}
          >
            Prefiero no decirlo
          </button>
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
}
