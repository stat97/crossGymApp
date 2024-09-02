import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useRegisterError = (res, setRegisterOk, setRes) => {
  //? si la respuesta es ok ---- > directamente está el status en la primera clave, es decir: res.status
  //? si la respuesta no está ok --> res.response.status
  //! ------------------ 200 : todo ok
  if (res?.status === 200) {
    console.log('Entró en el if 🎉');
    const dataToString = JSON.stringify(res);
    localStorage.setItem('data', dataToString);
    setRegisterOk(() => true);

    Swal.fire({
      icon: 'success',
      title: 'Welcome to my Page 💌',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  //! ------------------- 409: usuario ya registrado
  if (res?.response?.status === 409) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please, your email is incorrect! ❎',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  //! ------------------- La contraseña no está en el formato correcto
  const responseData = res?.response?.data;

  if (typeof responseData === 'string' && responseData.includes('validation failed: password')) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Min 8 characters, 1 upper case, 1 lower case and a special character ❎',
      showConfirmButton: false,
      timer: 3000,
    });
    setRes({});
  }

  //! ------------------- cuando el nombre de usuario ya existe
  if (
    typeof responseData === 'string' &&
    responseData.includes('duplicate key error collection: userProyect.users index: name_1 dup key: { name')
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Sorry, choose another name ❎',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  //! -------------------- 500 : error interno del servidor
  if (res?.response?.status === 500) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Internal server error! ❎ Please try again.',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }

  //! -------------------- 404: 'error, resend code'
  if (
    res?.response?.status === 404 &&
    res?.response?.data?.confirmationCode?.includes('error, resend code')
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Register ok, error to resend code ❎',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }
};
