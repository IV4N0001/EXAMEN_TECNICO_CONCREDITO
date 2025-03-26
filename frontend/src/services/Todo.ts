import { API_URL } from '../config/api.config';

export const fetchTasks = async (token: string) => {
  const response = await fetch(`${API_URL}/task`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const createTask = async (title: string, token: string) => {
  const response = await fetch(`${API_URL}/task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const updateTask = async (id: number, updates: { title?: string; completed?: boolean }, token: string) => {
  const response = await fetch(`${API_URL}/task/id/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const deleteTask = async (id: number, token: string) => {
  const response = await fetch(`${API_URL}/task/id/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};