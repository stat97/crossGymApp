import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useUpdateError = (res, setRes, user, setUser, setUpdatedUser) => {
  let contador = 0;

  if (res?.data?.testUpdate) {
    // Contar los errores (false)
    res.data.testUpdate.forEach((item) => {
      for (let clave in item) {
        if (item[clave] === false) {
          contador++;
        }
      }
    });
  }

  console.log('Contador:', contador);

  if (contador === 0 && res?.status === 200) {
    let check = '';

    res.data.testUpdate.forEach((item) => {
      for (let clave in item) {
        if (item[clave] === true) {
          check += `-${clave}-`;
        }
      }
    });

    const { token } = user;
    const userUpdate = {
      userName: res?.data?.updateUser?.userName,
      userLastName: res?.data?.updateUser?.userLastName,
      gender: res?.data?.updateUser?.gender,
      birthDate: {
        day: res?.data?.updateUser?.birthDate?.day ?? null,
        month: res?.data?.updateUser?.birthDate?.month ?? null,
        year: res?.data?.updateUser?.birthDate?.year ?? null,
      },
      height: res?.data?.updateUser?.height,
      weight: res?.data?.updateUser?.weight,
      email: res?.data?.updateUser?.email,
      image: res?.data?.updateUser?.image,
      check: res?.data?.updateUser?.check,
      _id: res?.data?.updateUser?._id,
      token,
    };

    localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify(userUpdate));
    setUser(userUpdate);
    setUpdatedUser(true); // Trigger navigation
    setRes({}); // Clear response state

    return Swal.fire({
      icon: 'success',
      title: 'Update data user ✅',
      text: `Update: ${check}`,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  if (res?.response?.status === 500 || res?.response?.status === 404) {
    setRes({}); // Clear response state
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "Internal Server Error! Don't update user ❎",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  if (contador !== 0 && res?.status === 404) {
    setRes({}); // Clear response state
    return Swal.fire({
      icon: 'error',
      title: 'Error update data user ❌',
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
