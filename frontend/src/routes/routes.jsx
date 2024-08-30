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
import { ChangePassword } from '../pages/Password/ChangePassword/ChangePassword';
import { ForgotPassword } from '../pages/Password/ForgotPassword/ForgotPassword';
import { CheckCode } from '../pages/CheckCode/CheckCode';
import { ProtectedCheckChildren } from '../components';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { FormProfile } from '../pages/FormProfile/FormProfile';
import { FormProfile2 } from '../pages/FormProfile/FormProfile2';
import { FormProfile3 } from '../pages/FormProfile/FormProfile3';
import { FormProfile4 } from '../pages/FormProfile/FormProfile4';

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
        path: '/verifyCode',
        element: (
         <ProtectedCheckChildren>
            <CheckCode />
         </ProtectedCheckChildren>
        ),
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
      {
        path: '/dashboard',
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
      // olvidaste la contraseña ?
      {
        path: '/forgotPassword',
        element: <ForgotPassword />,
      },
      {
        path: '/forgotPassword',
         element: <ForgotPassword />,
       },
       {
        path: '/profile',
        element: (
          <Protected>
             <FormProfile />
           </Protected>
         ),
      },
      {
        path: '/profile2',
        element: (
          <Protected>
             <FormProfile2 />
           </Protected>
         ),
      },
      {
        path: '/profile3',
        element: (
          <Protected>
             <FormProfile3 />
           </Protected>
         ),
      },
      {
        path: '/profile4',
        element: (
          <Protected>
             <FormProfile4 />
           </Protected>
         ),
      },
    //   {
    //     path: '/profiles',
    //     element: <ProfilePage />,
    //   },
     
     
      

       
    ],
  },
]);