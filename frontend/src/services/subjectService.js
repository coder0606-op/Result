import api from './api';
import { defaultSubjects } from './initialData';

const SUBJECTS_STORAGE_KEY = 'school_subjects_list';

const getStoredSubjects = () => {
  const data = localStorage.getItem(SUBJECTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(defaultSubjects));
    return defaultSubjects;
  }
  try { return JSON.parse(data); } catch (e) { return defaultSubjects; }
};

export const subjectService = {
  getSubjects: async () => {
    try {
      const response = await api.get('/subjects');
      return response.data;
    } catch (e) {
      return getStoredSubjects();
    }
  },

  addSubject: async (subjectData) => {
    try {
      const response = await api.post('/subjects', subjectData);
      return response.data;
    } catch (e) {
      const list = getStoredSubjects();
      const newId = list.length ? Math.max(...list.map(s => s.id)) + 1 : 1;
      const newSub = {
        id: newId,
        name: subjectData.name.toUpperCase(),
        code: subjectData.code ? subjectData.code.toUpperCase() : `SUB-${newId}`
      };
      const updated = [...list, newSub];
      localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(updated));
      return newSub;
    }
  },

  updateSubject: async (id, subjectData) => {
    try {
      const response = await api.put(`/subjects/${id}`, subjectData);
      return response.data;
    } catch (e) {
      const list = getStoredSubjects();
      const idx = list.findIndex(s => s.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...subjectData };
        localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(list));
        return list[idx];
      }
      throw new Error('Subject not found');
    }
  },

  deleteSubject: async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
    } catch (e) {
      const list = getStoredSubjects();
      const updated = list.filter(s => s.id !== id);
      localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(updated));
    }
  }
};
