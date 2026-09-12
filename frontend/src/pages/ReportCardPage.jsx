import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { schoolService } from '../services/schoolService';
import ReportCard from '../components/ReportCard';
import FullReportCardDataEditorModal from '../components/FullReportCardDataEditorModal';
import AdvancedReportCardDataModal from '../components/AdvancedReportCardDataModal';
import { 
  Printer, Edit3, Users, Sparkles, ExternalLink, AlertCircle, 
  Check, Save, RotateCcw, Sliders, ToggleLeft, ToggleRight, CheckCircle2,
  FileText
} from 'lucide-react';

const ReportCardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const studentIdParam = searchParams.get('studentId');

  const [students, setStudents] = useState([]);
  const [school, setSchool] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editedStudent, setEditedStudent] = useState(null);

  // Direct Edit states
  const [isDirectEdit, setIsDirectEdit] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // A4 paper display mode
  const [isA4FullPreview, setIsA4FullPreview] = useState(true);

  // Modals
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

  // Search & Alerts
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      if (studentIdParam) {
        const found = students.find(s => String(s.id) === String(studentIdParam) || s.enrollmentNumber === studentIdParam);
        if (found) {
          setSelectedStudent(found);
          setEditedStudent(JSON.parse(JSON.stringify(found)));
          setIsDirty(false);
          setSearchError('');
        } else {
          setSearchError(`Invalid Roll Number or Enrollment Number "${studentIdParam}"!`);
          setSelectedStudent(null);
          setEditedStudent(null);
        }
      } else if (!selectedStudent) {
        setSelectedStudent(students[0]);
        setEditedStudent(JSON.parse(JSON.stringify(students[0])));
        setIsDirty(false);
      }
    }
  }, [students, studentIdParam]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const loadData = async (updatedStudent) => {
    const sData = await studentService.getAllStudents();
    const schData = await schoolService.getSchoolSettings();
    setStudents(sData);
    setSchool(schData);

    if (updatedStudent && updatedStudent.id) {
      setSelectedStudent(updatedStudent);
      setEditedStudent(JSON.parse(JSON.stringify(updatedStudent)));
      setIsDirty(false);
      setSearchParams({ studentId: updatedStudent.id });
    } else if (selectedStudent) {
      const refreshed = sData.find(s => String(s.id) === String(selectedStudent.id));
      if (refreshed) {
        setSelectedStudent(refreshed);
        setEditedStudent(JSON.parse(JSON.stringify(refreshed)));
        setIsDirty(false);
      }
    }
  };

  const handleStudentSelect = (id) => {
    if (isDirty) {
      const confirmSwitch = window.confirm("You have unsaved changes in Direct Edit mode. Switch student without saving?");
      if (!confirmSwitch) return;
    }
    const found = students.find(s => String(s.id) === String(id));
    if (found) {
      setSelectedStudent(found);
      setEditedStudent(JSON.parse(JSON.stringify(found)));
      setIsDirty(false);
      setSearchParams({ studentId: id });
      setSearchError('');
    }
  };

  const handleSearchVerification = async (e) => {
    e.preventDefault();
    setSearchError('');
    if (!searchInput.trim()) {
      setSearchError('Please enter a Roll Number or Enrollment Number.');
      return;
    }

    const res = await studentService.verifyStudentResult(searchInput);
    if (res.success && res.student) {
      setSelectedStudent(res.student);
      setEditedStudent(JSON.parse(JSON.stringify(res.student)));
      setIsDirty(false);
      setSearchParams({ studentId: res.student.id });
      setSearchInput('');
      setSearchError('');
    } else {
      setSearchError(res.message || 'Invalid Roll Number or Enrollment Number!');
    }
  };

  // Direct edit change handler from ReportCard
  const handleStudentDirectChange = (field, value) => {
    if (!editedStudent) return;
    const updated = {
      ...editedStudent,
      [field]: value
    };
    setEditedStudent(updated);
    setIsDirty(true);
  };

  // Save changes directly to server
  const handleSaveDirectEdits = async () => {
    if (!editedStudent) return;
    setSaving(true);
    try {
      const saved = await studentService.updateStudent(editedStudent.id, editedStudent);
      setSelectedStudent(saved);
      setEditedStudent(JSON.parse(JSON.stringify(saved)));
      setIsDirty(false);
      showToast('Report card direct edits saved successfully to server!');
      await loadData(saved);
    } catch (err) {
      showToast('Failed to save changes: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Revert/Cancel changes
  const handleRevertChanges = () => {
    if (selectedStudent) {
      setEditedStudent(JSON.parse(JSON.stringify(selectedStudent)));
      setIsDirty(false);
      showToast('Direct edits reverted to original data.', 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDisplayStudent = isDirectEdit ? (editedStudent || selectedStudent) : (selectedStudent || editedStudent);

  return (
    <div className="space-y-6 font-body pb-16 print:p-0 print:m-0 print:space-y-0 print:pb-0">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold transition-all animate-bounce no-print ${
          toast.type === 'error' ? 'bg-red-600 text-white' :
          toast.type === 'info' ? 'bg-blue-600 text-white' :
          'bg-emerald-600 text-white'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Action Bar (Hidden during printing) */}
      <div className="no-print bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Student Selector & Verification Input */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-maroon" />
              <span>Select Student:</span>
            </label>

            <select
              value={selectedStudent ? selectedStudent.id : ''}
              onChange={(e) => handleStudentSelect(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:border-maroon focus:ring-1 focus:ring-maroon min-w-[200px]"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.studentName} (Class {s.className}-{s.section}, Roll: {s.rollNumber})
                </option>
              ))}
            </select>

            <form onSubmit={handleSearchVerification} className="flex items-center gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setSearchError('');
                }}
                placeholder="Enter Roll No / Enrollment ID..."
                className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold focus:bg-white focus:border-maroon min-w-[180px]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-maroon text-white font-extrabold text-xs rounded-lg hover:bg-maroon-dark transition-all"
              >
                Verify
              </button>
            </form>
          </div>

          {/* Action Buttons: Direct Edit Toggle & Print */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* DIRECT EDIT MODE TOGGLE SWITCH (TOP BAR) */}
            <button
              onClick={() => setIsDirectEdit(!isDirectEdit)}
              className={`px-3 py-2 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 border shadow-xs ${
                isDirectEdit 
                  ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 ring-2 ring-amber-300' 
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
              title="Toggle in-place Direct Edit Mode on the report card"
            >
              <Edit3 className="w-4 h-4" />
              <span>Direct Edit Mode:</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                isDirectEdit ? 'bg-white text-amber-800' : 'bg-amber-200 text-amber-900'
              }`}>
                {isDirectEdit ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Direct Edit Save Button in Top Bar (Visible when dirty) */}
            {isDirectEdit && isDirty && (
              <button
                onClick={handleSaveDirectEdits}
                disabled={saving}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm animate-pulse"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Edits'}</span>
              </button>
            )}

            {/* A4 Paper Fit Switch */}
            <button
              onClick={() => setIsA4FullPreview(!isA4FullPreview)}
              className={`px-3 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 border ${
                isA4FullPreview ? 'bg-maroon/10 text-maroon border-maroon/30' : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
              title="Toggle A4 full paper sheet fit preview"
            >
              <FileText className="w-4 h-4" />
              <span>A4 1-Page: {isA4FullPreview ? 'Fit' : 'Auto'}</span>
            </button>

            {/* Modals & Full Page Links */}
            {selectedStudent && (
              <Link
                to={`/update-report-card?studentId=${selectedStudent.id}`}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 border border-gray-300"
                title="Open full page form editor"
              >
                <ExternalLink className="w-4 h-4 text-gray-600" />
                <span className="hidden sm:inline">Form Page</span>
              </Link>
            )}

            {/* Print Button with 1-page A4 indicator */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-maroon text-white font-extrabold text-xs rounded-xl hover:bg-maroon-dark transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              title="Print strictly on 1 single A4 paper page"
            >
              <Printer className="w-4 h-4" />
              <span>Print 1-Page A4</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invalid Roll/Enrollment Number Alert */}
      {searchError && (
        <div className="no-print p-4 bg-red-50 border-2 border-red-300 text-red-900 rounded-2xl shadow-md flex items-center gap-3 animate-shake">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-sm text-red-900 uppercase">Invalid Credentials!</h4>
            <p className="text-xs font-bold text-red-700 mt-0.5">{searchError}</p>
            <p className="text-[11px] text-red-600 mt-0.5">Please check your Roll Number or Enrollment ID and try again, or select a valid student from the dropdown.</p>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA: REPORT CARD + DEDICATED SIDEBAR CONTROLS */}
      <div className="flex flex-col xl:flex-row items-start justify-center gap-6">
        
        {/* REPORT CARD DISPLAY CONTAINER */}
        <div className={`w-full transition-all duration-300 ${
          isA4FullPreview ? 'max-w-[210mm] mx-auto shadow-2xl' : 'max-w-5xl mx-auto'
        }`}>
          {currentDisplayStudent && (
            <ReportCard 
              student={currentDisplayStudent} 
              school={school} 
              isDirectEdit={isDirectEdit}
              onStudentChange={handleStudentDirectChange}
              onToggleEdit={() => setIsDirectEdit(!isDirectEdit)}
              onSave={handleSaveDirectEdits}
              isDirty={isDirty}
              saving={saving}
              onDiscard={handleRevertChanges}
            />
          )}
        </div>

        {/* FLOATING / FIXED REPORT CARD SIDE CONTROL PANEL (SIDE DOCK) */}
        <div className="no-print w-full xl:w-72 shrink-0 space-y-4 side-dock-container">
          
          {/* Direct Edit Mode Control Card */}
          <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <h3 className="font-heading font-bold text-sm text-gray-900">Direct Edit Mode</h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isDirectEdit ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {isDirectEdit ? 'Active' : 'Off'}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              When enabled, click directly on any student details, marks, attendance, or remarks on the report card to edit in-place.
            </p>

            {/* Toggle Button */}
            <button
              onClick={() => setIsDirectEdit(!isDirectEdit)}
              className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                isDirectEdit 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'bg-gray-900 hover:bg-black text-white'
              }`}
            >
              {isDirectEdit ? (
                <>
                  <ToggleRight className="w-5 h-5 text-white" />
                  <span>Direct Edit Mode: ON</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                  <span>Turn Direct Edit ON</span>
                </>
              )}
            </button>

            {/* Edit Actions: Save / Discard */}
            {isDirectEdit && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <button
                  onClick={handleSaveDirectEdits}
                  disabled={!isDirty || saving}
                  className={`w-full py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-xs ${
                    isDirty 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer ring-2 ring-emerald-300' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving to Database...' : isDirty ? 'Save Edits to Server' : 'All Changes Saved'}</span>
                </button>

                {isDirty && (
                  <button
                    onClick={handleRevertChanges}
                    className="w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Discard Edits</span>
                  </button>
                )}

                <div className="text-[11px] text-center font-bold">
                  {isDirty ? (
                    <span className="text-amber-600 flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                      Unsaved changes pending
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      In sync with server
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* A4 Paper Printing Card */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-md space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <Printer className="w-5 h-5 text-maroon" />
              <h3 className="font-heading font-bold text-sm text-gray-900">A4 Paper Print Settings</h3>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="font-semibold">Paper Format:</span>
                <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">A4 Portrait</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="font-semibold">Page Fit:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Strict 1-Page Only</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="font-semibold">Zero Margins:</span>
                <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">Exact Fit (No Blank 2nd Page)</span>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="w-full py-2.5 bg-maroon hover:bg-maroon-dark text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print 1-Page A4 Only</span>
            </button>

            <p className="text-[10.5px] text-gray-500 text-center leading-normal">
              Locked to strictly 1 sheet of paper. Navigation bars, side controls, and extra page breaks are completely eliminated.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2 text-xs">
            <h4 className="font-bold text-gray-800 text-xs mb-2">Other Editor Options:</h4>
            
            <button
              onClick={() => setIsAdvancedModalOpen(true)}
              className="w-full py-2 px-3 bg-gold/10 hover:bg-gold/20 text-maroon font-bold rounded-xl text-left flex items-center justify-between border border-gold/30 transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-dark" />
                Advanced Modal Editor
              </span>
              <span className="text-[10px] text-gray-500">Popup</span>
            </button>

            <button
              onClick={() => setIsEditorModalOpen(true)}
              className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold rounded-xl text-left flex items-center justify-between border border-gray-200 transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-gray-600" />
                Quick Data Editor
              </span>
              <span className="text-[10px] text-gray-500">Modal</span>
            </button>
          </div>

        </div>

      </div>

      {/* Standard Full Report Card Data Editor Modal */}
      {selectedStudent && (
        <FullReportCardDataEditorModal
          isOpen={isEditorModalOpen}
          onClose={() => setIsEditorModalOpen(false)}
          student={selectedStudent}
          onSaveSuccess={loadData}
        />
      )}

      {/* New Advanced Modal Model */}
      {selectedStudent && (
        <AdvancedReportCardDataModal
          isOpen={isAdvancedModalOpen}
          onClose={() => setIsAdvancedModalOpen(false)}
          student={selectedStudent}
          onSaveSuccess={loadData}
        />
      )}

    </div>
  );
};

export default ReportCardPage;
