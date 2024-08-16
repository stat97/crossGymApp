import './App.css';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Header, ScrollToTopButton } from './components';


const App = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
        <ScrollToTopButton />
      </main>
      <Footer />
    </>
  );
};

export default App;