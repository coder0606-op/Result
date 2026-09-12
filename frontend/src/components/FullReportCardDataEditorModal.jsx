import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Calculator, BookOpen, Award, Calendar, MessageSquare } from 'lucide-react';
import { studentService } from '../services/studentService';
import { computeStudentTotals, calculateGrade } from '../services/initialData';

const FullReportCardDataEditorModal = ({ isOpen, onClose, student, onSaveSuccess }) => {
  const [activeTab, setActiveTab] = useState('scholastic');
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

  useEffect(() => {
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
  }, [student]);

  if (!isOpen || !student) return null;

  const handleScholasticChange = (idx, field, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    const updated = [...scholasticMarks];
    updated[idx][field] = num;
    setScholasticMarks(updated);
  };

  const handleCoScholasticChange = (idx, field, value) => {
    const updated = [...coScholastic];
    updated[idx][field] = value;
    setCoScholastic(updated);
  };

  const handleAttendanceChange = (field, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    setAttendance(prev => ({ ...prev, [field]: num }));
  };

  // Compute live updated totals for display inside modal header
  const tempStudent = {
    ...student,
    scholastic: scholasticMarks,
    attendance
  };
  const { totalGrand, maxPossible, percentage, overallGrade } = computeStudentTotals(tempStudent);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedStudent = {
        ...student,
        scholastic: scholasticMarks,
        coScholastic,
        attendance,
        remarks,
        resultStatus
      };
      const saved = await studentService.updateStudent(student.id, updatedStudent);
      if (onSaveSuccess) onSaveSuccess(saved || updatedStudent);
      onClose();
    } catch (err) {
      console.error('Failed to save report card data', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-body">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-gray-200 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-maroon text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-lg">Update Full Report Card Data</h3>
              <span className="px-2 py-0.5 bg-gold/20 text-gold-light border border-gold/30 rounded text-[10px] font-bold">
                Live Calculation
              </span>
            </div>
            <p className="text-xs text-gray-200 mt-0.5">
              Student: <span className="font-bold text-white">{student.studentName}</span> • Roll #{student.rollNumber} (Class {student.className}-{student.section})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-maroon-dark/80 px-3 py-1.5 rounded-lg border border-maroon-light/30 text-right">
              <div className="text-[10px] text-gray-300 uppercase font-bold">Updated Total Score</div>
              <div className="text-sm font-extrabold text-gold-light">
                {totalGrand.toFixed(2)} / {maxPossible} <span className="text-white">({percentage}%)</span>
              </div>
            </div>

            <button onClick={onClose} className="p-1 text-gray-300 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-100 px-6 pt-3 border-b border-gray-200 flex space-x-2 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('scholastic')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
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
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'coScholastic'
                ? 'bg-white text-maroon border-t-2 border-maroon shadow-xs'
                : 'text-gray-600 hover:text-maroon hover:bg-gray-200/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. Co-Scholastic Grades</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'bg-white text-maroon border-t-2 border-maroon shadow-xs'
                : 'text-gray-600 hover:text-maroon hover:bg-gray-200/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>3. Attendance Records</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'summary'
                ? 'bg-white text-maroon border-t-2 border-maroon shadow-xs'
                : 'text-gray-600 hover:text-maroon hover:bg-gray-200/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>4. Remarks & Result Status</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* TAB 1: Scholastic Marks */}
          {activeTab === 'scholastic' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Enter per-subject components (Periodic Test, Notebook, SEA, Half Yearly, Yearly Exam).</span>
                </div>
                <div className="font-extrabold text-maroon">
                  Grade: <span className="text-emerald-700">{overallGrade}</span>
                </div>
              </div>

              <div className="space-y-3">
                {scholasticMarks.map((sub, idx) => {
                  const t1Tot = (sub.per1 || 0) + (sub.nb1 || 0) + (sub.sea1 || 0) + (sub.hy1 || 0);
                  const t2Tot = (sub.per2 || 0) + (sub.nb2 || 0) + (sub.sea2 || 0) + (sub.yr2 || 0);
                  const subGrand = t2Tot > 0 ? (t1Tot + t2Tot) / 2 : t1Tot;
                  const subGrade = calculateGrade(subGrand);

                  return (
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 hover:border-maroon/40 transition-colors">
                      <div className="flex items-center justify-between font-bold border-b border-gray-200 pb-2">
                        <span className="text-sm font-heading text-maroon uppercase">{sub.subject}</span>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-600">T1: <strong className="text-maroon">{t1Tot}</strong></span>
                          <span className="text-gray-600">T2: <strong className="text-maroon">{t2Tot}</strong></span>
                          <span className="px-2 py-0.5 bg-gold/20 text-maroon font-extrabold rounded">
                            Grand: {subGrand.toFixed(2)} ({subGrade})
                          </span>
                        </div>
                      </div>

                      {/* Term 1 Inputs */}
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">TERM 1 COMPONENTS:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Per Test (Max 10)</label>
                            <input
                              type="number" max="10" min="0" value={sub.per1 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'per1', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Notebook (Max 5)</label>
                            <input
                              type="number" max="5" min="0" value={sub.nb1 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'nb1', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">SEA (Max 5)</label>
                            <input
                              type="number" max="5" min="0" value={sub.sea1 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'sea1', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Half Yearly (Max 80)</label>
                            <input
                              type="number" max="80" min="0" value={sub.hy1 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'hy1', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon font-bold text-maroon"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Term 2 Inputs */}
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">TERM 2 COMPONENTS:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Per Test (Max 10)</label>
                            <input
                              type="number" max="10" min="0" value={sub.per2 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'per2', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Notebook (Max 5)</label>
                            <input
                              type="number" max="5" min="0" value={sub.nb2 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'nb2', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">SEA (Max 5)</label>
                            <input
                              type="number" max="5" min="0" value={sub.sea2 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'sea2', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-600 font-bold mb-1">Yearly Exam (Max 80)</label>
                            <input
                              type="number" max="80" min="0" value={sub.yr2 ?? 0}
                              onChange={(e) => handleScholasticChange(idx, 'yr2', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon font-bold text-maroon"
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
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm text-maroon uppercase border-b border-gray-200 pb-1">
                Co-Scholastic Area Evaluation Grades (A, B, C, D)
              </h4>
              <div className="space-y-3">
                {coScholastic.map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="font-bold text-gray-800 text-xs w-48 shrink-0">
                      {item.activity}
                    </div>

                    <div className="grid grid-cols-2 gap-4 flex-1 w-full">
                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">Half Yearly Grade</label>
                        <select
                          value={item.hyGrade || 'A'}
                          onChange={(e) => handleCoScholasticChange(idx, 'hyGrade', e.target.value)}
                          className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon font-bold text-maroon"
                        >
                          <option value="A">Grade A (Excellent)</option>
                          <option value="B">Grade B (Very Good)</option>
                          <option value="C">Grade C (Good)</option>
                          <option value="D">Grade D (Needs Improvement)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">Annual Grade</label>
                        <select
                          value={item.annualGrade || 'A'}
                          onChange={(e) => handleCoScholasticChange(idx, 'annualGrade', e.target.value)}
                          className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon font-bold text-maroon"
                        >
                          <option value="A">Grade A (Excellent)</option>
                          <option value="B">Grade B (Very Good)</option>
                          <option value="C">Grade C (Good)</option>
                          <option value="D">Grade D (Needs Improvement)</option>
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
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm text-maroon uppercase border-b border-gray-200 pb-1">
                Attendance Records & Working Days
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <div className="font-bold text-maroon border-b border-gray-200 pb-1">Term 1 Attendance</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Present Days</label>
                      <input
                        type="number" value={attendance.t1Present || 0}
                        onChange={(e) => handleAttendanceChange('t1Present', e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Total Days</label>
                      <input
                        type="number" value={attendance.t1Total || 60}
                        onChange={(e) => handleAttendanceChange('t1Total', e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <div className="font-bold text-maroon border-b border-gray-200 pb-1">Half Yearly Attendance</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Present Days</label>
                      <input
                        type="number" value={attendance.hyPresent || 0}
                        onChange={(e) => handleAttendanceChange('hyPresent', e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Total Days</label>
                      <input
                        type="number" value={attendance.hyTotal || 60}
                        onChange={(e) => handleAttendanceChange('hyTotal', e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <div className="font-bold text-maroon border-b border-gray-200 pb-1">Term 2 Attendance</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Present Days</label>
                      <input
                        type="number" value={attendance.t2Present || 0}
                        onChange={(e) => handleAttendanceChange('t2Present', e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Total Days</label>
                      <input
                        type="number" value={attendance.t2Total || 60}
                        onChange={(e) => handleAttendanceChange('t2Total', e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <div className="font-bold text-maroon border-b border-gray-200 pb-1">Annual Attendance</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Present Days</label>
                      <input
                        type="number" value={attendance.annualPresent || 0}
                        onChange={(e) => handleAttendanceChange('annualPresent', e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-600 font-bold mb-1">Total Days</label>
                      <input
                        type="number" value={attendance.annualTotal || 60}
                        onChange={(e) => handleAttendanceChange('annualTotal', e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: Remarks & Result Status */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm text-maroon uppercase border-b border-gray-200 pb-1">
                Teacher's Remarks & Promotion Status
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Teacher's Remark / Remarks for Student</label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter custom remarks regarding student behavior and performance..."
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon text-xs"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Final Result Promotion Status</label>
                  <select
                    value={resultStatus}
                    onChange={(e) => setResultStatus(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:border-maroon focus:ring-1 focus:ring-maroon font-bold text-maroon text-sm"
                  >
                    <option value="Promote">Promoted to Next Class</option>
                    <option value="Detained">Detained in Same Class</option>
                    <option value="Term Pending">Term Pending / Incomplete</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Footer Save / Cancel Controls */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-500 font-semibold">
              Calculated Overall Score: <span className="font-extrabold text-maroon">{totalGrand.toFixed(2)}</span> ({percentage}%)
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-maroon text-white font-extrabold rounded-xl text-xs hover:bg-maroon-dark flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save & Refresh Report Card</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default FullReportCardDataEditorModal;
