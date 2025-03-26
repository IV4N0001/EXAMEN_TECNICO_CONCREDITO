import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register } from '../services/LoginRegister';
import '../assets/styles/Register.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    try {
      await register(username, email, password);
      toast.success('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error en el registro. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="register-container">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
        
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
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
        
        <div className="password-field">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        <button type="submit">Registrarse</button>
      </form>

      <div className="login-link">
        ¿Ya tienes cuenta? <a href="/login">Inicia Sesión</a>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;