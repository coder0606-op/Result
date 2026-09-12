import api from './api';
import { defaultSchool } from './initialData';

const SCHOOL_STORAGE_KEY = 'school_settings_config';

export const schoolService = {
  getSchoolSettings: async () => {
    try {
      const response = await api.get('/school');
      return response.data;
    } catch (e) {
      const cached = localStorage.getItem(SCHOOL_STORAGE_KEY);
      if (cached) {
        try { return JSON.parse(cached); } catch (err) { }
      }
      localStorage.setItem(SCHOOL_STORAGE_KEY, JSON.stringify(defaultSchool));
      return defaultSchool;
    }
  },

  updateSchoolSettings: async (settings) => {
    try {
      const response = await api.put('/school', settings);
      return response.data;
    } catch (e) {
      localStorage.setItem(SCHOOL_STORAGE_KEY, JSON.stringify(settings));
      return settings;
    }
  }
};
