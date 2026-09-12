import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams, Link } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { schoolService } from '../services/schoolService';
import { computeStudentTotals, calculateGrade } from '../services/initialData';
import { 
  Save, ArrowLeft, BookOpen, Award, Calendar, MessageSquare, 
  Users, CheckCircle2, AlertCircle, RefreshCw, Eye, Sparkles
} from 'lucide-react';

const UpdateReportCardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id: paramStudentId } = useParams();

  const studentIdFromQuery = searchParams.get('studentId');
  const targetStudentId = paramStudentId || studentIdFromQuery;

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('scholastic');

  // Form states
  const [scholasticMarks, setScholasticMarks] = useState([]);
  const [coScholastic, setCoScholastic] = useState([]);
  const [attendance, setAttendance] = useState({
    t1Present: 54, t1Total: 60,
    hyPresent: 55, hyTotal: 60,
    t2Present: 58, t2Total: 60,
    annualPresent: 56, annualTotal: 60
  });
  const [remarks, setRemarks] = useState('');
  const [resultStatus, setResultStatus] = useState('Promote');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      let found = null;
      if (targetStudentId) {
        found = students.find(s => String(s.id) === String(targetStudentId) || s.enrollmentNumber === targetStudentId);
      }
      if (!found) found = students[0];
      populateStudentData(found);
    }
  }, [students, targetStudentId]);

  const loadStudents = async () => {
    const list = await studentService.getAllStudents();
    setStudents(list);
  };

  const populateStudentData = (student) => {
    setSelectedStudent(student);
    if (student) {
      if (student.scholastic) {
        setScholasticMarks(JSON.parse(JSON.stringify(student.scholastic)));
      }
      if (student.coScholastic) {
        setCoScholastic(JSON.parse(JSON.stringify(student.coScholastic)));
      }
      if (student.attendance) {
        setAttendance({ ...student.attendance });
      }
      setRemarks(student.remarks || '');
      setResultStatus(student.resultStatus || 'Promote');
    }
  };

  const handleStudentSelect = (e) => {
    const sId = e.target.value;
    const found = students.find(s => String(s.id) === String(sId));
    if (found) {
      populateStudentData(found);
      setSearchParams({ studentId: sId });
    }
  };

  const handleScholasticChange = (idx, field, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    const updated = [...scholasticMarks];
    updated[idx][field] = num;
    setScholasticMarks(updated);
    setSaveSuccess(false);
  };

  const handleCoScholasticChange = (idx, field, value) => {
    const updated = [...coScholastic];
    updated[idx][field] = value;
    setCoScholastic(updated);
    setSaveSuccess(false);
  };

  const handleAttendanceChange = (field, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    setAttendance(prev => ({ ...prev, [field]: num }));
    setSaveSuccess(false);
  };

  // Compute live calculations
  const tempStudent = selectedStudent ? {
    ...selectedStudent,
    scholastic: scholasticMarks,
    attendance
  } : null;

  const { totalGrand, maxPossible, percentage, overallGrade } = tempStudent 
    ? computeStudentTotals(tempStudent) 
    : { totalGrand: 0, maxPossible: 500, percentage: '0.00', overallGrade: 'F' };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setSaving(true);

    try {
      const updatedData = {
        ...selectedStudent,
        scholastic: scholasticMarks,
        coScholastic,
        attendance,
        remarks,
        resultStatus
      };

      const saved = await studentService.updateStudent(selectedStudent.id, updatedData);
      setSelectedStudent(saved || updatedData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update student report card data:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!selectedStudent) {
    return (
      <div className="p-8 text-center text-gray-600 font-body font-bold">
        Loading student records...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body pb-12 max-w-6xl mx-auto">
      
      {/* Top Banner & Title Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/report-cards?studentId=${selectedStudent.id}`}
            className="p-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-all"
            title="Back to Report Card"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-extrabold text-maroon">
                Update Report Card Data Page
              </h1>
              <span className="px-2.5 py-0.5 bg-gold/20 text-maroon font-bold text-[10px] rounded-full uppercase border border-gold/30">
                Full Data Editor
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Edit scholastic marks, co-scholastic grades, attendance totals & remarks on a dedicated page.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/report-cards?studentId=${selectedStudent.id}`}
            className="px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-maroon" />
            <span>View Printable Report</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-maroon text-white hover:bg-maroon-dark font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save All Data'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-xs">Report Card Data Saved Successfully!</p>
              <p className="text-[11px] text-emerald-700 font-medium">All scholastic marks, grades, attendance, and remarks have been updated.</p>
            </div>
          </div>
          <Link
            to={`/report-cards?studentId=${selectedStudent.id}`}
            className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition-all shadow-xs"
          >
            View Result
          </Link>
        </div>
      )}

      {/* Student Selector & Live Stats Bar */}
      <div className="bg-gradient-to-r from-maroon to-maroon-dark text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Student Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Users className="w-6 h-6 text-gold-light shrink-0" />
          <div className="flex-1 min-w-[260px]">
            <label className="block text-[10px] uppercase font-bold text-gold-light tracking-wider mb-1">
              Select Target Student
            </label>
            <select
              value={selectedStudent.id}
              onChange={handleStudentSelect}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 text-white rounded-xl text-xs font-bold focus:bg-white focus:text-gray-900 transition-all"
            >
              {students.map(s => (
                <option key={s.id} value={s.id} className="text-gray-900 font-bold">
                  {s.studentName} (Class {s.className}-{s.section}, Roll: {s.rollNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Metrics Header Box */}
        <div className="flex items-center gap-4 bg-white/10 px-5 py-2.5 rounded-xl border border-white/20 text-center w-full md:w-auto justify-around">
          <div>
            <span className="block text-[10px] text-gold-light font-extrabold uppercase">Grand Total</span>
            <span className="text-base font-extrabold text-white">{totalGrand.toFixed(2)} / {maxPossible}</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <span className="block text-[10px] text-gold-light font-extrabold uppercase">Percentage</span>
            <span className="text-base font-extrabold text-white">{percentage}%</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <span className="block text-[10px] text-gold-light font-extrabold uppercase">Grade</span>
            <span className="text-base font-extrabold text-gold-light px-2 py-0.5 bg-white/20 rounded">{overallGrade}</span>
          </div>
        </div>

      </div>

      {/* Editor Main Content Body */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Navigation Tabs */}
        <div className="bg-gray-50 px-6 pt-3 border-b border-gray-200 flex space-x-2 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('scholastic')}
            className={`px-5 py-3 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'scholastic'
                ? 'bg-white text-maroon border-t-2 border-maroon shadow-xs'
                : 'text-gray-600 hover:text-maroon hover:bg-gray-200/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Scholastic Marks Breakdown</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coScholastic')}
            className={`px-5 py-3 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'coScholastic'
                ? 'bg-white text-maroon border-t-2 border-maroon shadow-xs'
                : 'text-gray-600 hover:text-maroon hover:bg-gray-200/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. Co-Scholastic Activity Grades</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`px-5 py-3 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'bg-white text-maroon border-t-2 border-maroon shadow-xs'
                : 'text-gray-600 hover:text-maroon hover:bg-gray-200/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>3. Attendance Record Totals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`px-5 py-3 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'summary'
                ? 'bg-white text-maroon border-t-2 border-maroon shadow-xs'
                : 'text-gray-600 hover:text-maroon hover:bg-gray-200/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>4. Remarks & Result Status</span>
          </button>
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6 text-xs">
          
          {/* TAB 1: Scholastic Marks */}
          {activeTab === 'scholastic' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Enter per-subject components (Per Test 10, Notebook 5, SEA 5, Exam 80) for Term 1 and Term 2.</span>
                </div>
                <div className="font-extrabold text-maroon text-xs shrink-0">
                  Overall Grade: <span className="text-emerald-700">{overallGrade}</span>
                </div>
              </div>

              <div className="space-y-4">
                {scholasticMarks.map((sub, idx) => {
                  const t1Tot = (sub.per1 || 0) + (sub.nb1 || 0) + (sub.sea1 || 0) + (sub.hy1 || 0);
                  const t2Tot = (sub.per2 || 0) + (sub.nb2 || 0) + (sub.sea2 || 0) + (sub.yr2 || 0);
                  const subGrand = t2Tot > 0 ? (t1Tot + t2Tot) / 2 : t1Tot;
                  const subGrade = calculateGrade(subGrand);

                  return (
                    <div key={idx} className="p-5 bg-gray-50/80 border border-gray-200 rounded-2xl space-y-4 hover:border-maroon/40 transition-all shadow-2xs">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold border-b border-gray-200 pb-3 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-maroon"></span>
                          <span className="text-sm font-heading text-maroon uppercase tracking-wide">{sub.subject}</span>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-600">Term 1: <strong className="text-maroon">{t1Tot} / 100</strong></span>
                          <span className="text-gray-600">Term 2: <strong className="text-maroon">{t2Tot} / 100</strong></span>
                          <span className="px-3 py-1 bg-gold/20 text-maroon font-extrabold rounded-lg border border-gold/30">
                            Grand: {subGrand.toFixed(2)} ({subGrade})
                          </span>
                        </div>
                      </div>

                      {/* Term 1 Inputs */}
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">TERM 1 COMPONENTS (100 MARKS)</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Periodic Test (Max 10)</label>
                            <input
                              type="number" max="10" min="0" value={sub.per1 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'per1', e.target.value)}
                              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Notebook (Max 5)</label>
                            <input
                              type="number" max="5" min="0" value={sub.nb1 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'nb1', e.target.value)}
                              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Subject Enrichment SEA (Max 5)</label>
                            <input
                              type="number" max="5" min="0" value={sub.sea1 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'sea1', e.target.value)}
                              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Half Yearly Exam (Max 80)</label>
                            <input
                              type="number" max="80" min="0" value={sub.hy1 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'hy1', e.target.value)}
                              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon font-bold text-maroon"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Term 2 Inputs */}
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">TERM 2 COMPONENTS (100 MARKS)</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Periodic Test (Max 10)</label>
                            <input
                              type="number" max="10" min="0" value={sub.per2 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'per2', e.target.value)}
                              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Notebook (Max 5)</label>
                            <input
                              type="number" max="5" min="0" value={sub.nb2 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'nb2', e.target.value)}
                              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Subject Enrichment SEA (Max 5)</label>
                            <input
                              type="number" max="5" min="0" value={sub.sea2 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'sea2', e.target.value)}
                              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Annual Exam (Max 80)</label>
                            <input
                              type="number" max="80" min="0" value={sub.yr2 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'yr2', e.target.value)}
                              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon font-bold text-maroon"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Co-Scholastic Grades */}
          {activeTab === 'coScholastic' && (
            <div className="space-y-5">
              <h4 className="font-heading font-bold text-sm text-maroon uppercase border-b border-gray-200 pb-2">
                Co-Scholastic Activity Evaluation Grades (A, B, C, D)
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {coScholastic.map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="font-bold text-gray-900 text-xs w-56 shrink-0 flex items-center gap-2">
                      <Award className="w-4 h-4 text-gold-dark" />
                      <span>{item.activity}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 flex-1 w-full">
                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">Half Yearly Evaluation</label>
                        <select
                          value={item.hyGrade || 'A'}
                          onChange={(e) => handleCoScholasticChange(idx, 'hyGrade', e.target.value)}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon font-bold text-maroon"
                        >
                          <option value="A">Grade A (Outstanding)</option>
                          <option value="B">Grade B (Very Good)</option>
                          <option value="C">Grade C (Good)</option>
                          <option value="D">Grade D (Satisfactory)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">Annual Evaluation</label>
                        <select
                          value={item.annualGrade || 'A'}
                          onChange={(e) => handleCoScholasticChange(idx, 'annualGrade', e.target.value)}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon font-bold text-maroon"
                        >
                          <option value="A">Grade A (Outstanding)</option>
                          <option value="B">Grade B (Very Good)</option>
                          <option value="C">Grade C (Good)</option>
                          <option value="D">Grade D (Satisfactory)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Attendance Records */}
          {activeTab === 'attendance' && (
            <div className="space-y-5">
              <h4 className="font-heading font-bold text-sm text-maroon uppercase border-b border-gray-200 pb-2">
                Attendance Working Days Breakdown
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                  <div className="font-bold text-maroon border-b border-gray-200 pb-1.5 flex items-center justify-between">
                    <span>Term 1 Attendance</span>
                    <span className="text-[10px] text-gray-500 font-normal">First Term</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Present Days</label>
                      <input
                        type="number" value={attendance.t1Present || 0}
                        onChange={(e) => handleAttendanceChange('t1Present', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon font-bold text-maroon"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Total Days</label>
                      <input
                        type="number" value={attendance.t1Total || 60}
                        onChange={(e) => handleAttendanceChange('t1Total', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                  <div className="font-bold text-maroon border-b border-gray-200 pb-1.5 flex items-center justify-between">
                    <span>Half Yearly Attendance</span>
                    <span className="text-[10px] text-gray-500 font-normal">Mid Session</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Present Days</label>
                      <input
                        type="number" value={attendance.hyPresent || 0}
                        onChange={(e) => handleAttendanceChange('hyPresent', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon font-bold text-maroon"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Total Days</label>
                      <input
                        type="number" value={attendance.hyTotal || 60}
                        onChange={(e) => handleAttendanceChange('hyTotal', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                  <div className="font-bold text-maroon border-b border-gray-200 pb-1.5 flex items-center justify-between">
                    <span>Term 2 Attendance</span>
                    <span className="text-[10px] text-gray-500 font-normal">Second Term</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Present Days</label>
                      <input
                        type="number" value={attendance.t2Present || 0}
                        onChange={(e) => handleAttendanceChange('t2Present', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon font-bold text-maroon"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Total Days</label>
                      <input
                        type="number" value={attendance.t2Total || 60}
                        onChange={(e) => handleAttendanceChange('t2Total', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                  <div className="font-bold text-maroon border-b border-gray-200 pb-1.5 flex items-center justify-between">
                    <span>Annual Attendance</span>
                    <span className="text-[10px] text-gray-500 font-normal">Full Session</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Present Days</label>
                      <input
                        type="number" value={attendance.annualPresent || 0}
                        onChange={(e) => handleAttendanceChange('annualPresent', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon font-bold text-maroon"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Total Days</label>
                      <input
                        type="number" value={attendance.annualTotal || 60}
                        onChange={(e) => handleAttendanceChange('annualTotal', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:border-maroon"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: Remarks & Result Status */}
          {activeTab === 'summary' && (
            <div className="space-y-5">
              <h4 className="font-heading font-bold text-sm text-maroon uppercase border-b border-gray-200 pb-2">
                Teacher's Remarks & Promotion Result Status
              </h4>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Class Teacher's Remarks</label>
                  <textarea
                    rows={4}
                    value={remarks}
                    onChange={(e) => {
                      setRemarks(e.target.value);
                      setSaveSuccess(false);
                    }}
                    placeholder="Enter custom remarks regarding student behavior and performance..."
                    className="w-full p-3.5 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon text-xs"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Promotion Result Status</label>
                  <select
                    value={resultStatus}
                    onChange={(e) => {
                      setResultStatus(e.target.value);
                      setSaveSuccess(false);
                    }}
                    className="w-full p-3.5 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon font-bold text-maroon text-sm"
                  >
                    <option value="Promote">Promoted to Next Class</option>
                    <option value="Detained">Detained in Same Class</option>
                    <option value="Term Pending">Term Pending / Incomplete</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Form Controls */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-600 font-semibold">
              Live Total: <span className="font-extrabold text-maroon">{totalGrand.toFixed(2)} / {maxPossible}</span> ({percentage}%)
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/report-cards?studentId=${selectedStudent.id}`}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200"
              >
                Cancel & Return
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-maroon text-white font-extrabold rounded-xl text-xs hover:bg-maroon-dark flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save & Refresh Report Card'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>

    </div>
  );
};

export default UpdateReportCardPage;
