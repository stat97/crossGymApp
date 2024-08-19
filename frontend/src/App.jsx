import './App.css';
import { Outlet } from 'react-router-dom';
import { Footer, Header } from './components';


const App = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;