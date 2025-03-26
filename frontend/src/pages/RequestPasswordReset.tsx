import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { requestPasswordReset } from '../services/RequestPasswordReset';
import '../assets/styles/RequestPasswordReset.css';

const RequestPasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await requestPasswordReset(email);
      toast.success('¡Token enviado! Revisa tu correo electrónico');
    } catch (err: any) {
      toast.error(err.message || 'Error al solicitar el token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <h1>Recuperar Contraseña</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar Token'}
        </button>
      </form>

      <div className="token-received-link">
        ¿Ya recibiste tu token? <a href="/reset-password">Restablece tu contraseña</a>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RequestPasswordReset;