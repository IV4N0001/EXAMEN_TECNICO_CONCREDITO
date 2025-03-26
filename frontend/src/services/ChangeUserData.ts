import { API_URL } from '../config/api.config';

export const changePassword = async (newPassword: string, token: string) => {
  const response = await fetch(`${API_URL}/user/changePassword`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const changeEmail = async (newEmail: string, token: string) => {
  const response = await fetch(`${API_URL}/user/changeEmail`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newEmail }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};