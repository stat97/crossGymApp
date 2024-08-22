import { createBrowserRouter } from 'react-router-dom';

import App from '../App';
import { Protected } from '../components/ProtectedRoute/Protected';
import { ProtectedCheckChildren } from '../components/ProtectedRoute/ProtectedCheckChildren';
import { Home } from '../pages/Home/Home';
// import { ChangePassword } from '../pages/Login/ChangePassword';
// import { CheckCode } from '../pages/Login/CheckCode';
// import { ForgotPassword } from '../pages/Login/ForgotPassword';
// import { FormProfile } from '../pages/Login/FormProfile';
import { Register } from '../pages/Register/Register';
// import { ProfilePage } from '../pages/Profiles/ProfilePage';
import { Login } from '../pages/Login/Login';

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
    //   {
    //     path: '/profiles',
    //     element: <ProfilePage />,
    //   },
    //   {
    //     path: '/forgotPassword',
    //     element: <ForgotPassword />,
    //   },
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

    //   {
    //     path: '/changePassword',
    //     element: (
    //       <Protected>
    //         <ChangePassword />
    //       </Protected>
    //     ),
    //   },
    ],
  },
]);