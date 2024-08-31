import './FormProfile.css';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAuth } from '../../context/authContext';
import { useDeleteUser, useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';
import { Uploadfile } from '../../components/UploadFile/Uploadfile';

export const FormProfile = () => {
  const { user, setUser, setDeleteUser } = useAuth();
  const { handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const navigate = useNavigate();

  const defaultData = {
    userName: user?.name,
    userLastName: user?.lastName,
  };

  //! ------------ 1) La función que gestiona el formulario----
  const formSubmit = (formData) => {
    const fullData = {
      ...formData,
      userName: document.getElementById('userName').value,
      userLastName: document.getElementById('userLastName').value,
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
      navigate('/profile2');
    }
  }, [updatedUser, navigate]);

  return (
    <>
      <div className="div-user-profile-setting">
        <div className="div-user-profile-setting-card">
          <figure className="dataProfile">
            <h4>Crear perfil</h4>
            <img className="profile-photo" src={user.image} alt="foto User" />
          </figure>
          <h5 className="user-profile-text">
            Hi {}
            <span
              style={{
                textDecoration: 'underline',
                textDecorationColor: '#97f85b',
                textDecorationThickness: '3px',
              }}
            >
              {user.name}
            </span>
            , you can make changes to your user profile
          </h5>
        
         
          <hr className="profile-setting__line" />
          <form className="form-update-profile" onSubmit={handleSubmit(formSubmit)}>
            <label htmlFor="userName">Nombre</label>
            <input
              className="input_user"
              type="text"
              id="userName"
              name="userName"
              autoComplete="off"
              defaultValue={defaultData?.userName}
            />
            <label htmlFor="userLastName">Apellidos</label>
            <input
              className="input_user"
              type="text"
              id="userLastName"
              name="userLastName"
              autoComplete="off"
              defaultValue={defaultData?.userLastName}
            />
           

            <button className="button--blue" type="submit" disabled={send}>
              Siguiente
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
