import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <section className="hero-section">
        <div className="herobox">
          <h1> Monitorea tu condicion física</h1>
          <h4></h4>
          <button
            className="button--blue"
            onClick={() => {
              user ? navigate('/dashboard') : navigate('/register');
            }}
          >
            {user ? 'Your Dashboard' : 'Join us'}
          </button>
        </div>
      </section>

      <section className="big-title-section">
        <h2>
          crossGymApp es una app de monitoreo físico
        </h2>
      </section>
    </>
    )}