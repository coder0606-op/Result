import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { subjectService } from '../services/subjectService';
import { schoolService } from '../services/schoolService';
import { computeStudentTotals } from '../services/initialData';
import FullReportCardDataEditorModal from '../components/FullReportCardDataEditorModal';
import { 
  Users, 
  School, 
  BookOpen, 
  FileCheck, 
  Plus, 
  Printer, 
  Edit, 
  Eye, 
  Trash2, 
  Filter, 
  Sparkles,
  ChevronRight,
  Ticket
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [school, setSchool] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const [selectedStudentForMarks, setSelectedStudentForMarks] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const sData = await studentService.getAllStudents();
    const subData = await subjectService.getSubjects();
    const schData = await schoolService.getSchoolSettings();
    setStudents(sData);
    setSubjects(subData);
    setSchool(schData);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(student.rollNumber).includes(searchTerm);
    const matchesClass = selectedClass === 'all' || String(student.className) === selectedClass;
    return matchesSearch && matchesClass;
  });

  const uniqueClasses = Array.from(new Set(students.map(s => String(s.className)))).sort();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      await studentService.deleteStudent(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 font-body pb-10">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sidebar via-maroon-dark to-maroon text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-maroon/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-gold/20 text-gold-light border border-gold/30 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Performance Management</span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-wide">
            {school?.schoolName || 'MAHAVIRI SHISHU VIDYA MANDIR'}
          </h1>
          <p className="text-xs text-gray-200">
            {school?.address || 'Ward No-01 Lakhraw Siwan (Bihar)'} • Session {school?.academicSession || '2024-25'}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/add-student')}
            className="px-4 py-2 bg-gold text-maroon-dark font-extrabold text-xs rounded-xl hover:bg-gold-light transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
          <button
            onClick={() => navigate('/admit-card')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm"
          >
            <Ticket className="w-4 h-4" />
            <span>Admit Cards</span>
          </button>
          <button
            onClick={() => navigate('/report-cards')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Report Cards</span>
          </button>
        </div>
      </div>

      {/* Metric Cards (Total Students, Total Classes, Total Subjects, Total Reports) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4 hover:border-maroon/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-maroon/10 text-maroon flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Students</p>
            <h3 className="font-heading text-2xl font-extrabold text-gray-900">{students.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4 hover:border-maroon/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold-dark flex items-center justify-center">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Classes</p>
            <h3 className="font-heading text-2xl font-extrabold text-gray-900">{uniqueClasses.length || 1}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4 hover:border-maroon/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Subjects</p>
            <h3 className="font-heading text-2xl font-extrabold text-gray-900">{subjects.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4 hover:border-maroon/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reports Generated</p>
            <h3 className="font-heading text-2xl font-extrabold text-gray-900">{students.length}</h3>
          </div>
        </div>
      </div>

      {/* Main Student Directory Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-lg text-gray-900">Student Directory</h2>
            <p className="text-xs text-gray-500">Manage marks, student profile, and view report cards</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search name, roll, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:border-maroon focus:ring-1 focus:ring-maroon w-48 sm:w-64"
            />

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 focus:border-maroon focus:ring-1 focus:ring-maroon"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100 text-[11px] font-bold text-gray-600 uppercase border-b border-gray-200">
                <th className="py-3 px-4">Student Profile</th>
                <th className="py-3 px-4">Enrollment / Roll</th>
                <th className="py-3 px-4">Class & Sec</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const { percentage, overallGrade } = computeStudentTotals(student);
                  return (
                    <tr key={student.id} className="hover:bg-maroon/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-maroon/10 text-maroon font-extrabold flex items-center justify-center text-xs shadow-inner overflow-hidden shrink-0 border border-maroon/20">
                            {student.studentPhoto ? (
                              <img src={student.studentPhoto} alt={student.studentName} className="w-full h-full object-cover" />
                            ) : (
                              student.initials || 'ST'
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{student.studentName}</div>
                            <div className="text-[11px] text-gray-500">Father: {student.fatherName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono">
                        {student.enrollmentNumber} <span className="text-gray-400">|</span> Roll: {student.rollNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        Class {student.className} - {student.section}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold badge-enrolled">
                          {student.status || 'Enrolled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-maroon">
                        {percentage}% <span className="text-xs font-semibold text-emerald-700">({overallGrade})</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentForMarks(student)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Marks"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admit-card?studentId=${student.id}`)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            title="Generate Admit Card"
                          >
                            <Ticket className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/report-cards?studentId=${student.id}`)}
                            className="p-1.5 text-maroon hover:bg-maroon/10 rounded-md transition-colors"
                            title="View Report Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Full Report Card Data Editor Modal */}
      {selectedStudentForMarks && (
        <FullReportCardDataEditorModal
          isOpen={!!selectedStudentForMarks}
          onClose={() => setSelectedStudentForMarks(null)}
          student={selectedStudentForMarks}
          onSaveSuccess={loadData}
        />
      )}

    </div>
  );
};

export default Dashboard;
