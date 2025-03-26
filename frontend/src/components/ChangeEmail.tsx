import React, { useState } from 'react';
import { changeEmail } from '../services/ChangeUserData';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/ChangeEmail.css';
import { FaTimes } from 'react-icons/fa';

const ChangeEmail: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { token } = useAuth();
    const [newEmail, setNewEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newEmail.trim()) {
            setError('Por favor ingresa un correo electrónico');
            return;
        }

        try {
            const response = await changeEmail(newEmail, token!);
            setMessage(response.message);
            setError('');
            setTimeout(() => onClose(), 2000); // Cerrar el formulario después de 2 segundos
        } catch (err: any) {
            setError(err.message || 'Error al cambiar el correo electrónico');
        }
    };

    return (
        <div className="change-email-modal">
            <div className="change-email-content">
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <h2>Cambiar Correo Electrónico</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type="email"
                            placeholder="Nuevo correo electrónico"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    {message && <p className="success">{message}</p>}
                    <button type="submit">Confirmar</button>
                </form>
            </div>
        </div>
    );
};

export default ChangeEmail;