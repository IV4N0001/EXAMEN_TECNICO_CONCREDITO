import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, deleteCookie } from '../utils/cookies';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  // Obtener el token de la cookie al cargar la aplicación
  useEffect(() => {
    const tokenFromCookie = getCookie('token');
    if (tokenFromCookie) {
      setToken(tokenFromCookie); // Asignar el token al contexto
    }
  }, []);

  const logout = () => {
    deleteCookie('token'); // Eliminar la cookie
    setToken(null); // Limpiar el token del contexto
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};