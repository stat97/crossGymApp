import './FormProfile.css';


import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { Uploadfile } from '../../components/UploadFile/Uploadfile';
import { useAuth } from '../../context/authContext';
import { useDeleteUser, useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';

export const FormProfile = () => {
  const { user, setUser, setDeleteUser } = useAuth();
  const { register, handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const navigate = useNavigate();



  const defaultData = {
    userName: user?.name,
  };

  //! ------------ 1) La funcion que gestiona el formulario----
  const formSubmit = (formData) => {
    Swal.fire({
      title: 'Are you sure you want to change your data profile?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(73, 193, 162)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const inputFile = document.getElementById('file-upload').files;

        if (inputFile.length != 0) {
          const custonFormData = {
            ...formData,
            image: inputFile[0],
          };
          

          setSend(true);
          setRes(await update(custonFormData));

          setSend(false);
        } else {
          const custonFormData = {
            ...formData,
          };
          setSend(true);
          setRes(await update(custonFormData));
          

          setSend(false);
        }
      }
    });
  };

  //! -------------- 2 ) useEffect que gestiona la parte de la respuesta ------- customHook

  useEffect(() => {
    useUpdateError(res, setRes, user, setUser, setUpdatedUser);
  }, [res]);

  useEffect(() => {
    if (updatedUser) {
      setUpdatedUser(false);
      navigate('/dashboard');
    }
  }, [res]);

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
        
          <Link
            className="delete-user"
            onClick={() => useDeleteUser(user, setUser, setDeleteUser)}
            style={{ cursor: 'pointer' }}
          >
            Delete user
          </Link>
          <hr className="profile-setting__line" />
          <form className="form-update-profile" onSubmit={handleSubmit(formSubmit)}>
            <label htmlFor="custom-input">Nombre</label>
            <input
              className="input_user"
              type="text"
              id="userName"
              name="userName"
              autoComplete="false"
              defaultValue={defaultData?.userName}
              {...register('userName')}
            />
            <label htmlFor="custom-input">Apellidos</label>
             <input
              className="input_user"
              type="text"
              id="userName"
              apellido="apellido"
              autoComplete="false"
              defaultValue={defaultData?.userName}
              {...register('userName')}
            />
            <label htmlFor="file-upload-form">Change profile photo</label>

            <Uploadfile />
            <button className="button--blue" type="submit" disabled={send}>
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
};