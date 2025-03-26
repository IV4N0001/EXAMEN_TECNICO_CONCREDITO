import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../services/LoginRegister';
import '../assets/styles/Login.css';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      setToken(data.access_token);
      navigate('/todos');
    } catch (err: any) {
      console.log(err);

      if (err.message) {
        toast.error(String(err.message));
      } else {
        toast.error('Error al iniciar sesión. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Inicio de Sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        <button type="submit">Iniciar Sesión</button>
      </form>

      <div className="register-link">
        ¿Aún no tienes cuenta? <a href="/register">Regístrate</a>
      </div>
      <div className="forgot-password-link">
        ¿Olvidaste tu contraseña? <a href="/request-password-reset">Recupérala</a>
      </div>
      <ToastContainer 
      />
    </div>
  );
};

export default Login;