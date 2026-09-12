import api from './api';
import { studentService } from './studentService';

export const marksService = {
  getStudentMarks: async (studentId) => {
    try {
      const response = await api.get(`/marks/student/${studentId}`);
      return response.data;
    } catch (e) {
      const student = await studentService.getStudentById(studentId);
      return student ? student.scholastic : [];
    }
  },

  updateStudentMarks: async (studentId, scholasticMarks) => {
    try {
      const response = await api.put(`/marks/student/${studentId}`, scholasticMarks);
      return response.data;
    } catch (e) {
      // Update local storage record
      await studentService.updateStudent(studentId, {
        scholastic: scholasticMarks,
        status: 'Enrolled'
      });
      return scholasticMarks;
    }
  }
};
