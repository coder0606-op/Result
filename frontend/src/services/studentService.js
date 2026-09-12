import api from './api';
import { initialStudents } from './initialData';

const STORAGE_KEY = 'school_students_data';

const getStoredStudents = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStudents));
    return initialStudents;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return initialStudents;
  }
};

const saveStoredStudents = (students) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const studentService = {
  getAllStudents: async () => {
    try {
      const response = await api.get('/students');
      if (Array.isArray(response.data)) {
        saveStoredStudents(response.data);
        return response.data;
      }
      return getStoredStudents();
    } catch (e) {
      return getStoredStudents();
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (e) {
      const students = getStoredStudents();
      return students.find(s => String(s.id) === String(id)) || students[0];
    }
  },

  createStudent: async (studentData) => {
    try {
      const response = await api.post('/students', studentData);
      const created = response.data;
      const current = getStoredStudents();
      const updated = [created, ...current.filter(s => String(s.id) !== String(created.id))];
      saveStoredStudents(updated);
      return created;
    } catch (e) {
      const students = getStoredStudents();
      const newId = students.length ? Math.max(...students.map(s => s.id || 0)) + 1 : 1;
      const initials = studentData.studentName
        ? studentData.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'ST';

      const newStudent = {
        id: newId,
        studentName: (studentData.studentName || '').toUpperCase(),
        fatherName: (studentData.fatherName || '').toUpperCase(),
        motherName: (studentData.motherName || '').toUpperCase(),
        dob: studentData.dob || '01/01/2015',
        enrollmentNumber: studentData.enrollmentNumber || `ENR-${Math.floor(1000 + Math.random() * 9000)}`,
        rollNumber: studentData.rollNumber,
        className: studentData.className,
        section: (studentData.section || 'A').toUpperCase(),
        house: studentData.house || 'Yellow House',
        address: studentData.address || 'Siwan, Bihar',
        academicSession: studentData.academicSession || '2024-25',
        studentPhoto: studentData.studentPhoto || '',
        initials,
        status: 'Enrolled',
        attendance: {
          t1Present: 50, t1Total: 60,
          hyPresent: 52, hyTotal: 60,
          t2Present: 55, t2Total: 60,
          annualPresent: 54, annualTotal: 60
        },
        coScholastic: [
          { id: 1, activity: 'Work Education', hyGrade: 'A', annualGrade: 'A' },
          { id: 2, activity: 'Art Education', hyGrade: 'A', annualGrade: 'A' },
          { id: 3, activity: 'Sports / Yoga / NCC', hyGrade: 'A', annualGrade: 'A' }
        ],
        remarks: 'Promising student with good academic dedication.',
        resultStatus: 'Promote',
        scholastic: [
          { subject: 'HINDI', per1: 8, nb1: 5, sea1: 5, hy1: 70, per2: 8, nb2: 5, sea2: 5, yr2: 72 },
          { subject: 'ENGLISH', per1: 7, nb1: 4, sea1: 5, hy1: 65, per2: 8, nb2: 5, sea2: 5, yr2: 68 },
          { subject: 'MATHS', per1: 8, nb1: 5, sea1: 5, hy1: 75, per2: 9, nb2: 5, sea2: 5, yr2: 80 },
          { subject: 'GK', per1: 8, nb1: 4, sea1: 5, hy1: 60, per2: 8, nb2: 5, sea2: 5, yr2: 65 },
          { subject: 'DRAWING', per1: 9, nb1: 5, sea1: 5, hy1: 80, per2: 9, nb2: 5, sea2: 5, yr2: 82 },
          { subject: 'SANSKRIT', per1: 7, nb1: 5, sea1: 5, hy1: 62, per2: 8, nb2: 5, sea2: 5, yr2: 66 },
          { subject: 'SCIENCE', per1: 8, nb1: 5, sea1: 5, hy1: 72, per2: 8, nb2: 5, sea2: 5, yr2: 74 },
          { subject: 'COMPUTER', per1: 9, nb1: 5, sea1: 5, hy1: 85, per2: 9, nb2: 5, sea2: 5, yr2: 88 }
        ]
      };

      const updated = [newStudent, ...students];
      saveStoredStudents(updated);
      return newStudent;
    }
  },

  updateStudent: async (id, updatedFields) => {
    try {
      const response = await api.put(`/students/${id}`, updatedFields);
      const updated = response.data;
      const current = getStoredStudents();
      const idx = current.findIndex(s => String(s.id) === String(id));
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...updated };
        saveStoredStudents(current);
      }
      return updated;
    } catch (e) {
      const students = getStoredStudents();
      const idx = students.findIndex(s => String(s.id) === String(id));
      if (idx !== -1) {
        students[idx] = { ...students[idx], ...updatedFields };
        saveStoredStudents(students);
        return students[idx];
      }
      throw new Error('Student not found');
    }
  },

  deleteStudent: async (id) => {
    try {
      await api.delete(`/students/${id}`);
    } catch (e) { }
    const students = getStoredStudents();
    const updated = students.filter(s => String(s.id) !== String(id));
    saveStoredStudents(updated);
  },

  verifyStudentResult: async (searchQuery, className) => {
    try {
      const students = await studentService.getAllStudents();
      if (!searchQuery || !String(searchQuery).trim()) {
        return { success: false, message: 'Please enter a valid Roll Number or Enrollment Number.' };
      }

      const qClean = String(searchQuery).trim().toLowerCase();

      const matched = students.find(s => {
        const matchRoll = String(s.rollNumber || '').trim().toLowerCase() === qClean;
        const matchEnr = String(s.enrollmentNumber || '').trim().toLowerCase() === qClean;
        const matchId = String(s.id).trim().toLowerCase() === qClean;

        let matchClass = true;
        if (className && String(className).trim()) {
          matchClass = String(s.className || '').trim().toLowerCase() === String(className).trim().toLowerCase();
        }

        return (matchRoll || matchEnr || matchId) && matchClass;
      });

      if (matched) {
        return { success: true, student: matched };
      } else {
        return {
          success: false,
          message: `Invalid Roll Number or Enrollment Number "${searchQuery}"! Please check your credentials.`
        };
      }
    } catch (err) {
      return { success: false, message: 'Error verifying student record. Please try again.' };
    }
  }
};
