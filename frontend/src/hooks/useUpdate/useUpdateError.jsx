import Swal from 'sweetalert2/dist/sweetalert2.all.js';

export const useUpdateError = (res, setRes, user, setUser, setUpdatedUser) => {
  let contador = 0;

  console.log('useUpdateError called with res:', res);

  // Verifica si res.data.testUpdate existe y es un array
  if (Array.isArray(res?.data?.testUpdate)) {
    console.log('testUpdate data:', res.data.testUpdate);

    // Recorre cada objeto en el array testUpdate
    res.data.testUpdate.forEach((item, index) => {
      console.log(`Processing item ${index}:`, item);

      // Verifica cada clave del objeto
      for (let clave in item) {
        console.log(`Checking clave: ${clave}, value: ${item[clave]}`);
        
        // Incrementa el contador si el valor es true
        if (item[clave] === false) {
          contador++;
        }
      }
    });
  } else {
    console.warn('testUpdate is not an array:', res?.data?.testUpdate);
  }

  console.log('Final Contador:', contador);

  // Manejo de la respuesta exitosa
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
      height: res?.data?.updateUser?.height ?? null,
      weight: res?.data?.updateUser?.weight ?? null,
      email: res?.data?.updateUser?.email,
      image: res?.data?.updateUser?.image,
      check: res?.data?.updateUser?.check,
      _id: res?.data?.updateUser?._id,
      token,
    };

    localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify(userUpdate));
    setUser(userUpdate);
    setUpdatedUser(true);
    setRes({});

    return Swal.fire({
      icon: 'success',
      title: 'Update data user ✅',
      text: `Update: ${check}`,
      showConfirmButton: false,
      timer: 1500,
    });
  } 

  // Manejo de errores del servidor
  if (res?.response?.status === 500 || res?.response?.status === 404) {
    setRes({});
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "Internal Server Error! Don't update user ❎",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  // Manejo de errores específicos de actualización
  if (contador !== 0 && res?.status === 404) {
    setRes({});
    return Swal.fire({
      icon: 'error',
      title: 'Error update data user ❌',
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
