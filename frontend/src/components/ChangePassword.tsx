import React, { useState } from 'react';
import { changePassword } from '../services/ChangeUserData';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/ChangePassword.css';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa'; 

const ChangePassword: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { token } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await changePassword(String(newPassword), token!);
            setMessage(response.message);
            setError('');
            setTimeout(() => onClose(), 2000); // Cerrar el formulario después de 2 segundos
        } catch (err: any) {
            setError(err.message || 'Error al cambiar la contraseña');
        }
    };

    return (
        <div className="change-password-modal">
            <div className="change-password-content">
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <h2>Cambiar Contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="input-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {error && <p className="error">{error}</p>}
                    {message && <p className="success">{message}</p>}
                    <button type="submit">Confirmar</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;