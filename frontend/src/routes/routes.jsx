import { createBrowserRouter } from 'react-router-dom';

import App from '../App';
import { Protected } from '../components/ProtectedRoute/Protected';
import { Home } from '../pages/Home/Home';

// import { CheckCode } from '../pages/Login/CheckCode';
//import { ForgotPassword } from '../pages/ChangePassword/ChangePassword';
// import { FormProfile } from '../pages/Login/FormProfile';
import { Register } from '../pages/Register/Register';
// import { ProfilePage } from '../pages/Profiles/ProfilePage';
import { Login } from '../pages/Login/Login';
import { ChangePassword } from '../pages/ChangePassword/ChangePassword';
import { ForgotPassword } from '../pages/ForgotPassword/ForgotPassword';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
       {
        path: '/register',
         element: <Register />,
       },
      {
        path: '/login',
        element: <Login />,
      },
      // cambiar contraseña dentro del perfil
      {
        path: '/changePassword',
        element: (
          <Protected>
            <ChangePassword />
          </Protected>
        ),
      },
      // olvidaste la contraseña ?
      {
        path: '/forgotPassword',
        element: <ForgotPassword />,
      },
    //   {
    //     path: '/profiles',
    //     element: <ProfilePage />,
    //   },
     // {
       // path: '/forgotPassword',
       // element: <ForgotPassword />,
      //},
    //   {
    //     path: '/verifyCode',
    //     element: (
    //       <ProtectedCheckChildren>
    //         <CheckCode />
    //       </ProtectedCheckChildren>
    //     ),
    //   },
    //   {
    //     path: '/profile',
    //     element: (
    //       <Protected>
    //         <FormProfile />
    //       </Protected>
    //     ),
    //   },

       
    ],
  },
]);