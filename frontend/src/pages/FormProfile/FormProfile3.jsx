import './FormProfile.css';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAuth } from '../../context/authContext';
import { useDeleteUser, useUpdateError } from '../../hooks';
import { update } from '../../services/user.service';
import { Uploadfile } from '../../components/UploadFile/Uploadfile';

export const FormProfile3 = () => {
  const { user, setUser, setDeleteUser } = useAuth();
  const { handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(false);
  const navigate = useNavigate();

  const defaultData = {
    userBirthDateDay: user?.birthDate?.day, 
    userBirthDateMonth: user?.birthDate?.month,
    userBirthDateYear: user?.birthDate?.year,
  };

  //! ------------ 1) La función que gestiona el formulario----
  const formSubmit = (formData) => {
    const fullData = {
      ...formData,
      birthDate: {
        day: document.getElementById('userBirthDateDay').value,
        month: document.getElementById('userBirthDateMonth').value,
        year: document.getElementById('userBirthDateYear').value,
      },

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
            <label htmlFor="userBirthDateDay">Dia</label>
            <input
              className="input_user"
              type="text"
              id="userBirthDateDay"
              name=" userBirthDateDay"
              autoComplete="off"
              defaultValue={defaultData?. userBirthDateDay}
            />
            <label htmlFor="userBirthDateMonth">Mes</label>
            <input
              className="input_user"
              type="text"
              id="userBirthDateMonth"
              name=" userBirthDateMonth"
              autoComplete="off"
              defaultValue={defaultData?. userBirthDateMonth}
            />
             <label htmlFor= "userBirthDateYear">Year </label>
             <input
              className="input_user"
              type="text"
              id="userBirthDateYear"
              name=" userBirthDateYear"
              autoComplete="off"
              defaultValue={defaultData?. userBirthDateYear}
            />
           

            <button className="button--blue" type="submit" disabled={send}>
              Siguiente
            </button>
          </form>
       
    </>
  );
};
