// src/features/tasks/taskApi.js
import api from '../../api/axios';

export const getTasks = async () => {
  const res = await api.get('/tasks');
  return res.data;
};

export const createTask = async (title, priority) => {
  const res = await api.post('/tasks', { title, priority });
  return res.data;
};

export const updateTaskStatus = async (id, status) => {
  const res = await api.patch(`/tasks/${id}`, { status });
  return res.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};