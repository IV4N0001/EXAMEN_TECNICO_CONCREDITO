import { API_URL } from '../config/api.config';

export const requestPasswordReset = async (email: string) => {
  const response = await fetch(`${API_URL}/user/requestPasswordReset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const resetPassword = async (token: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/user/resetPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message);
    }
  
    return data;
  };