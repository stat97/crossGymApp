import React from 'react';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Outlet } from 'react-router-dom';

export const ProfileSteps = () => {
  const steps = [
    { path: '/profile', label: 'Paso 1' },
    { path: '/profile2', label: 'Paso 2' },
    { path: '/profile3', label: 'Paso 3' },
    { path: '/profile4', label: 'Paso 4' },
    { path: '/profile5', label: 'Paso 5' },
    { path: '/profile6', label: 'Paso 6' },
    { path: '/profile7', label: 'Paso 7' },
    { path: '/profile8', label: 'Paso 8' },
  ];

  return (
    <div>
      {/* Aquí pasas los steps como prop a ProgressBar */}
      <ProgressBar steps={steps} />
      
      {/* Aquí se renderizan las diferentes rutas dentro del perfil */}
      <Outlet />
    </div>
  );
};


