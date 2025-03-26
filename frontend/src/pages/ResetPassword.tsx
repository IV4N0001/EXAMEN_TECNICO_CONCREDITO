import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetPassword } from '../services/RequestPasswordReset';
import '../assets/styles/ResetPassword.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword: React.FC = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    
    try {
      await resetPassword(token, newPassword);
      toast.success('¡Contraseña actualizada con éxito!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Error al restablecer la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h1>Restablecer Contraseña</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Token de recuperación"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        
        <div className="password-container">
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowNewPassword(!showNewPassword)}
            aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        
        <div className="password-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
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
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Procesando...' : 'Restablecer Contraseña'}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default ResetPassword;