import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useRegisterError = (res, setRegisterOk, setRes) => {
  if (res?.status === 200) {
    Swal.fire({
      icon: 'success',
      title: 'Welcome to my Page 💌',
      showConfirmButton: false,
      timer: 1500,
    });
    setRegisterOk(true);
    setRes({});
  } else if (res?.response?.status === 409) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'This email is already registered. Please use a different email.',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  } else if (res?.response?.data?.includes('validation failed: password')) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Password must be at least 8 characters, including uppercase, lowercase, and special character.',
      showConfirmButton: false,
      timer: 3000,
    });
    setRes({});
  } else if (res?.response?.status === 500) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Internal server error! Please try again.',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  } else if (res?.response?.status === 404 && res?.response?.data?.confirmationCode?.includes('error, resend code')) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Register successful, but error resending confirmation code.',
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({});
  }
};
