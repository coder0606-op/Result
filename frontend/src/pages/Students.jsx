import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { computeStudentTotals } from '../services/initialData';
import { Plus, Search, Filter, Edit, Eye, Trash2, UserPlus, RefreshCw } from 'lucide-react';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadStudents();
    
    // Auto-sync with central server every 5 seconds
    const interval = setInterval(() => {
      loadStudents(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadStudents = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setIsSyncing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      await studentService.deleteStudent(id);
      loadStudents();
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      (s.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.enrollmentNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      String(s.rollNumber || '').includes(search);
    const matchesClass = selectedClass === 'all' || String(s.className) === selectedClass;
    const matchesSection = selectedSection === 'all' || (s.section || '').toUpperCase() === selectedSection.toUpperCase();
    return matchesSearch && matchesClass && matchesSection;
  });

  const uniqueClasses = Array.from(new Set(students.map((s) => String(s.className)))).sort();
  const uniqueSections = Array.from(new Set(students.map((s) => (s.section || 'A').toUpperCase()))).sort();

  return (
    <div className="space-y-6 font-body pb-10">
      
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-gray-900">Student Directory & Profiles</h1>
          <p className="text-xs text-gray-500">Manage student enrollments, edit credentials, and trigger report cards</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => loadStudents()}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            title="Sync latest student data across devices"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-maroon ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Server Data'}</span>
          </button>

          <button
            onClick={() => navigate('/create-report-card')}
            className="px-4 py-2 bg-gold/20 text-maroon hover:bg-gold/30 border border-gold/40 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Report Card</span>
          </button>

          <button
            onClick={() => navigate('/add-student')}
            className="px-4 py-2 bg-maroon text-white text-xs font-bold rounded-xl hover:bg-maroon-dark transition-all flex items-center gap-2 shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Filters & Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, enrollment, or roll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
            <Filter className="w-3.5 h-3.5 text-maroon" />
            <span>Class:</span>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 focus:border-maroon focus:ring-1 focus:ring-maroon"
          >
            <option value="all">All Classes</option>
            {uniqueClasses.map((c) => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold pl-2">
            <span>Section:</span>
          </div>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 focus:border-maroon focus:ring-1 focus:ring-maroon"
          >
            <option value="all">All Sections</option>
            {uniqueSections.map((sec) => (
              <option key={sec} value={sec}>Sec {sec}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Main Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((student) => {
          const { percentage, overallGrade } = computeStudentTotals(student);
          return (
            <div key={student.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:border-maroon/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-maroon/10 text-maroon uppercase">
                    Class {student.className} - {student.section}
                  </span>
                  <span className="text-xs font-mono text-gray-500 font-semibold">Roll #{student.rollNumber}</span>
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-full bg-maroon text-white font-extrabold text-lg flex items-center justify-center shadow-md shrink-0 overflow-hidden border-2 border-maroon">
                    {student.studentPhoto ? (
                      <img src={student.studentPhoto} alt={student.studentName} className="w-full h-full object-cover" />
                    ) : (
                      student.initials || 'ST'
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-heading font-bold text-base text-gray-900 group-hover:text-maroon transition-colors truncate">
                      {student.studentName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">Father: {student.fatherName}</p>
                    <p className="text-[11px] text-gray-400 font-mono">Enr: {student.enrollmentNumber}</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1 border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">DOB:</span>
                    <span className="font-semibold text-gray-800">{student.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">House:</span>
                    <span className="font-semibold text-gray-800">{student.house || 'Red House'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Overall Score:</span>
                    <span className="font-extrabold text-maroon">{percentage}% ({overallGrade})</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/report-cards?studentId=${student.id}`)}
                  className="px-3 py-1.5 bg-maroon/10 text-maroon hover:bg-maroon hover:text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Report Card</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/edit-student/${student.id}`)}
                    className="p-1.5 text-gray-500 hover:text-maroon hover:bg-gray-100 rounded-md transition-colors"
                    title="Edit Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Student"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Students;
