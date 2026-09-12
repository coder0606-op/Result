import React, { useState } from 'react';
import { calculateGrade, computeStudentTotals } from '../services/initialData';
import { Edit3, CheckCircle2, ToggleLeft, ToggleRight, Save, RotateCcw } from 'lucide-react';

const ReportCard = ({ 
  student, 
  school, 
  isDirectEdit = false, 
  onStudentChange, 
  onToggleEdit,
  onSave,
  isDirty = false,
  saving = false,
  onDiscard
}) => {
  if (!student) return null;

  const [localEdit, setLocalEdit] = useState(false);
  const activeEditMode = onToggleEdit ? isDirectEdit : localEdit;
  const toggleEditHandler = onToggleEdit || (() => setLocalEdit(!localEdit));

  const { totalGrand, maxPossible, percentage, overallGrade, attendancePct } = computeStudentTotals(student);

  // Helper to handle general field change
  const handleField = (field, val) => {
    if (onStudentChange) {
      onStudentChange(field, val);
    }
  };

  // Helper for scholastic change
  const handleScholastic = (idx, subField, val) => {
    if (!onStudentChange) return;
    const num = val === '' ? '' : Math.max(0, Number(val));
    const currentScholastic = [...(student.scholastic || [])];
    currentScholastic[idx] = {
      ...currentScholastic[idx],
      [subField]: num
    };
    onStudentChange('scholastic', currentScholastic);
  };

  // Helper for coScholastic change
  const handleCoScholastic = (idx, gradeField, val) => {
    if (!onStudentChange) return;
    const currentCo = [...(student.coScholastic || [])];
    currentCo[idx] = {
      ...currentCo[idx],
      [gradeField]: val
    };
    onStudentChange('coScholastic', currentCo);
  };

  // Helper for attendance change
  const handleAttendance = (attField, val) => {
    if (!onStudentChange) return;
    const num = val === '' ? '' : Math.max(0, Number(val));
    const currentAtt = {
      ...(student.attendance || {}),
      [attField]: num
    };
    onStudentChange('attendance', currentAtt);
  };

  return (
    <div className={`report-card-printable bg-paper p-4 sm:p-7 rounded-xl border-2 border-maroon shadow-xl font-body max-w-5xl mx-auto my-2 text-gray-900 transition-all ${
      activeEditMode ? 'ring-2 ring-amber-400/80 ring-offset-2' : ''
    }`}>
      
      {/* DIRECT EDIT MODE ON/OFF CONTROLS DIRECTLY ON REPORT CARD (Hidden on print) */}
      <div className="no-print -mt-2 mb-3 bg-gradient-to-r from-amber-50 to-amber-100/90 border-2 border-amber-300 text-amber-950 px-3.5 py-2 rounded-xl flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-xs ${
            activeEditMode ? 'bg-amber-500' : 'bg-gray-400'
          }`}>
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xs text-gray-900">Direct Edit Mode</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                activeEditMode ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {activeEditMode ? 'ON' : 'OFF'}
              </span>
              {activeEditMode && isDirty && (
                <span className="text-[10px] text-amber-700 font-bold bg-amber-200/80 px-2 py-0.5 rounded-full animate-pulse">
                  Edits Pending Save
                </span>
              )}
            </div>
            <p className="text-[10.5px] text-gray-600 font-medium">
              {activeEditMode 
                ? 'Click any field, mark, attendance, or remarks on this card to edit directly in-place.'
                : 'Turn ON to edit student information, marks, and grades directly on this card.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Main ON / OFF Switch on Report Card */}
          <button
            type="button"
            onClick={toggleEditHandler}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              activeEditMode 
                ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-300' 
                : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300'
            }`}
            title="Toggle Direct Edit Mode On or Off"
          >
            {activeEditMode ? (
              <>
                <ToggleRight className="w-4 h-4 text-white" />
                <span>Edit Mode: ON</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-gray-400" />
                <span>Edit Mode: OFF</span>
              </>
            )}
          </button>

          {/* Quick Save button right on the report card */}
          {activeEditMode && isDirty && onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all animate-pulse cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Edits'}</span>
            </button>
          )}

          {/* Quick Discard button right on the report card */}
          {activeEditMode && isDirty && onDiscard && (
            <button
              type="button"
              onClick={onDiscard}
              className="px-2.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. INSTITUTIONAL HEADER */}
      <div className="border-b-2 border-maroon pb-2.5 mb-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <img 
            src={school?.schoolLogo || "/mahaviri_shishu_vidya_mandir_logo/screen.png"} 
            alt="School Crest" 
            className="w-14 h-14 print:w-16 print:h-16 object-contain rounded bg-white p-0.5 border border-maroon/20 shadow-xs shrink-0"
          />
          <div>
            <h1 className="font-heading text-lg sm:text-xl print:text-lg font-extrabold text-maroon uppercase tracking-wide">
              {school?.schoolName || 'MAHAVIRI SHISHU VIDYA MANDIR'}
            </h1>
            <p className="text-xs print:text-[11px] font-bold text-gray-700 mt-0.5">
              {school?.address || 'Ward No-01 Lakhraw Siwan (Bihar)'}
            </p>
            <p className="text-[10px] print:text-[10px] text-gray-600 font-medium mt-0.5">
              Affiliated to {school?.affiliationNumber || 'G.F.E.R.T, PATNA • Code: RTE/SWN/0052'} • Contact: {school?.contactNumber || '+91 98765 43210'}
            </p>
          </div>
        </div>

        <div className="text-center sm:text-right border-t sm:border-t-0 border-gray-300 pt-1 sm:pt-0">
          <span className="inline-block bg-maroon/10 text-maroon font-bold text-[11px] print:text-xs px-2.5 py-0.5 rounded-full uppercase border border-maroon/20">
            Session: {school?.academicSession || student?.academicSession || '2024-25'}
          </span>
          <p className="text-xs print:text-[11px] font-extrabold text-maroon-dark mt-1 tracking-wider uppercase">
            ANNUAL REPORT CARD
          </p>
        </div>
      </div>

      {/* 2. STUDENT PROFILE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mb-3 print:mb-2.5 border border-gray-300 rounded-lg p-2.5 print:p-2 bg-white/90 shadow-2xs">
        {/* Photo / Initials */}
        <div className="flex justify-center sm:justify-start items-center">
          {student.studentPhoto ? (
            <div className="w-32 h-32 sm:w-36 sm:h-36 print:w-28 print:h-28 rounded-lg overflow-hidden border-2 border-maroon/40 shadow-sm bg-white p-0.5 shrink-0">
              <img src={student.studentPhoto} alt={student.studentName} className="w-full h-full object-cover rounded" />
            </div>
          ) : (
            <div className="w-32 h-32 sm:w-36 sm:h-36 print:w-28 print:h-28 rounded-lg bg-maroon/10 border-2 border-maroon/30 text-maroon font-extrabold text-2xl print:text-xl flex items-center justify-center shadow-inner shrink-0">
              {student.initials || 'ST'}
            </div>
          )}
        </div>

        {/* Info Columns */}
        <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-3 text-xs print:text-[10.5px]">
          <div>
            <span className="block text-[9.5px] print:text-[8.5px] text-gray-500 font-bold uppercase">Student Name</span>
            {isDirectEdit ? (
              <input
                type="text"
                value={student.studentName || ''}
                onChange={(e) => handleField('studentName', e.target.value.toUpperCase())}
                className="w-full bg-amber-50/80 border border-amber-400 rounded px-1.5 py-0.5 font-extrabold text-xs text-maroon focus:bg-white focus:border-maroon focus:outline-none"
              />
            ) : (
              <span className="font-bold text-xs print:text-[11px] text-gray-900">{student.studentName}</span>
            )}
          </div>

          <div>
            <span className="block text-[9.5px] print:text-[8.5px] text-gray-500 font-bold uppercase">Father's Name</span>
            {isDirectEdit ? (
              <input
                type="text"
                value={student.fatherName || ''}
                onChange={(e) => handleField('fatherName', e.target.value.toUpperCase())}
                className="w-full bg-amber-50/80 border border-amber-400 rounded px-1.5 py-0.5 font-semibold text-xs text-gray-900 focus:bg-white focus:border-maroon focus:outline-none"
              />
            ) : (
              <span className="font-semibold text-gray-800">{student.fatherName}</span>
            )}
          </div>

          <div>
            <span className="block text-[9.5px] print:text-[8.5px] text-gray-500 font-bold uppercase">Mother's Name</span>
            {isDirectEdit ? (
              <input
                type="text"
                value={student.motherName || ''}
                onChange={(e) => handleField('motherName', e.target.value.toUpperCase())}
                className="w-full bg-amber-50/80 border border-amber-400 rounded px-1.5 py-0.5 font-semibold text-xs text-gray-900 focus:bg-white focus:border-maroon focus:outline-none"
              />
            ) : (
              <span className="font-semibold text-gray-800">{student.motherName}</span>
            )}
          </div>

          <div>
            <span className="block text-[9.5px] print:text-[8.5px] text-gray-500 font-bold uppercase">Class & Section</span>
            {isDirectEdit ? (
              <div className="flex items-center gap-1">
                <span className="text-gray-500 font-bold text-xs">Cls</span>
                <input
                  type="text"
                  value={student.className || ''}
                  onChange={(e) => handleField('className', e.target.value)}
                  className="w-12 text-center bg-amber-50/80 border border-amber-400 rounded py-0.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-maroon focus:outline-none"
                />
                <span className="text-gray-500 font-bold text-xs">Sec</span>
                <input
                  type="text"
                  value={student.section || ''}
                  onChange={(e) => handleField('section', e.target.value.toUpperCase())}
                  className="w-10 text-center bg-amber-50/80 border border-amber-400 rounded py-0.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-maroon focus:outline-none"
                />
              </div>
            ) : (
              <span className="font-semibold text-gray-900">Class {student.className} - {student.section}</span>
            )}
          </div>

          <div>
            <span className="block text-[9.5px] print:text-[8.5px] text-gray-500 font-bold uppercase">Roll Number</span>
            {isDirectEdit ? (
              <input
                type="text"
                value={student.rollNumber || ''}
                onChange={(e) => handleField('rollNumber', e.target.value)}
                className="w-20 text-center bg-amber-50/80 border border-amber-400 rounded px-1.5 py-0.5 font-bold text-xs text-gray-900 focus:bg-white focus:border-maroon focus:outline-none"
              />
            ) : (
              <span className="font-semibold text-gray-900">{student.rollNumber}</span>
            )}
          </div>

          <div>
            <span className="block text-[9.5px] print:text-[8.5px] text-gray-500 font-bold uppercase">Enrollment No.</span>
            {isDirectEdit ? (
              <input
                type="text"
                value={student.enrollmentNumber || ''}
                onChange={(e) => handleField('enrollmentNumber', e.target.value)}
                className="w-full bg-amber-50/80 border border-amber-400 rounded px-1.5 py-0.5 font-bold text-xs text-gray-900 focus:bg-white focus:border-maroon focus:outline-none"
              />
            ) : (
              <span className="font-semibold text-gray-900">{student.enrollmentNumber}</span>
            )}
          </div>

          <div>
            <span className="block text-[9.5px] print:text-[8.5px] text-gray-500 font-bold uppercase">Date of Birth</span>
            {isDirectEdit ? (
              <input
                type="text"
                value={student.dob || ''}
                onChange={(e) => handleField('dob', e.target.value)}
                className="w-full bg-amber-50/80 border border-amber-400 rounded px-1.5 py-0.5 font-medium text-xs text-gray-800 focus:bg-white focus:border-maroon focus:outline-none"
              />
            ) : (
              <span className="font-medium text-gray-800">{student.dob}</span>
            )}
          </div>

          <div>
            <span className="block text-[9.5px] print:text-[8.5px] text-gray-500 font-bold uppercase">House</span>
            {isDirectEdit ? (
              <input
                type="text"
                value={student.house || ''}
                onChange={(e) => handleField('house', e.target.value)}
                className="w-full bg-amber-50/80 border border-amber-400 rounded px-1.5 py-0.5 font-medium text-xs text-gray-800 focus:bg-white focus:border-maroon focus:outline-none"
              />
            ) : (
              <span className="font-medium text-gray-800">{student.house || 'Red House'}</span>
            )}
          </div>

          <div>
            <span className="block text-[9.5px] print:text-[8.5px] text-gray-500 font-bold uppercase">Address</span>
            {isDirectEdit ? (
              <input
                type="text"
                value={student.address || ''}
                onChange={(e) => handleField('address', e.target.value)}
                className="w-full bg-amber-50/80 border border-amber-400 rounded px-1.5 py-0.5 font-medium text-xs text-gray-800 focus:bg-white focus:border-maroon focus:outline-none"
              />
            ) : (
              <span className="font-medium text-gray-800 truncate block">{student.address}</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. SCHOLASTIC AREA MARKS TABLE */}
      <div className="mb-3 print:mb-2.5 overflow-x-auto">
        <div className="flex items-center justify-between border-b border-maroon/30 pb-0.5 mb-1">
          <h3 className="font-heading font-bold text-xs print:text-[11px] text-maroon uppercase tracking-wide">
            1. SCHOLASTIC AREA (Academic Evaluation)
          </h3>
          {isDirectEdit && (
            <span className="no-print text-[10px] text-amber-700 font-bold">
              Tip: Totals & Grades recompute automatically
            </span>
          )}
        </div>

        <table className="w-full text-center border-collapse border border-gray-300 text-xs min-w-[700px] bg-white">
          <thead>
            <tr className="bg-maroon text-white font-bold text-[11px] print:text-[10px] uppercase">
              <th className="border border-maroon-dark p-2 print:p-1.5 text-left w-36" rowSpan={2}>Subjects</th>
              <th className="border border-maroon-dark p-1.5 print:p-1 bg-maroon-dark/90" colSpan={6}>TERM-1 (100 Marks)</th>
              <th className="border border-maroon-dark p-1.5 print:p-1 bg-maroon-dark/90" colSpan={6}>TERM-2 (100 Marks)</th>
              <th className="border border-maroon-dark p-1.5 print:p-1 bg-gold/90 text-maroon-dark" colSpan={2}>OVERALL</th>
            </tr>
            <tr className="bg-gray-100 text-[9px] print:text-[8.5px] font-bold text-gray-700 uppercase">
              <th className="border border-gray-300 p-1">Test (10)</th>
              <th className="border border-gray-300 p-1">NB (5)</th>
              <th className="border border-gray-300 p-1">SEA (5)</th>
              <th className="border border-gray-300 p-1 bg-gray-200">Test Tot (20)</th>
              <th className="border border-gray-300 p-1">Half Yr (80)</th>
              <th className="border border-gray-300 p-1 bg-maroon/10 text-maroon font-extrabold">T1 TOT (100)</th>
              
              <th className="border border-gray-300 p-1">Test (10)</th>
              <th className="border border-gray-300 p-1">NB (5)</th>
              <th className="border border-gray-300 p-1">SEA (5)</th>
              <th className="border border-gray-300 p-1 bg-gray-200">Test Tot (20)</th>
              <th className="border border-gray-300 p-1">Yearly (80)</th>
              <th className="border border-gray-300 p-1 bg-maroon/10 text-maroon font-extrabold">T2 TOT (100)</th>
              
              <th className="border border-gray-300 p-1 font-bold bg-gold/20 text-maroon">GRAND TOT</th>
              <th className="border border-gray-300 p-1 font-bold bg-gold/20 text-emerald-800">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-medium text-gray-800">
            {student.scholastic && student.scholastic.map((sub, idx) => {
              const testTot1 = (Number(sub.per1) || 0) + (Number(sub.nb1) || 0) + (Number(sub.sea1) || 0);
              const tot1 = testTot1 + (Number(sub.hy1) || 0);

              const testTot2 = (Number(sub.per2) || 0) + (Number(sub.nb2) || 0) + (Number(sub.sea2) || 0);
              const tot2 = testTot2 + (Number(sub.yr2) || 0);

              const grand = tot2 > 0 ? ((tot1 + tot2) / 2) : tot1;
              const grade = calculateGrade(grand);

              return (
                <tr key={idx} className="hover:bg-maroon/5 transition-colors">
                  <td className="border border-gray-300 p-2 print:p-1.5 text-left font-bold text-gray-900">{sub.subject}</td>
                  
                  {/* Term 1 */}
                  <td className="border border-gray-300 p-1 print:p-1.5">
                    {isDirectEdit ? (
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={sub.per1 ?? ''}
                        onChange={(e) => handleScholastic(idx, 'per1', e.target.value)}
                        className="w-10 text-center bg-amber-50/70 border border-amber-300 rounded py-0.5 text-xs font-semibold focus:bg-white focus:border-maroon focus:outline-none"
                      />
                    ) : (
                      sub.per1
                    )}
                  </td>
                  <td className="border border-gray-300 p-1 print:p-1.5">
                    {isDirectEdit ? (
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={sub.nb1 ?? ''}
                        onChange={(e) => handleScholastic(idx, 'nb1', e.target.value)}
                        className="w-10 text-center bg-amber-50/70 border border-amber-300 rounded py-0.5 text-xs font-semibold focus:bg-white focus:border-maroon focus:outline-none"
                      />
                    ) : (
                      sub.nb1
                    )}
                  </td>
                  <td className="border border-gray-300 p-1 print:p-1.5">
                    {isDirectEdit ? (
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={sub.sea1 ?? ''}
                        onChange={(e) => handleScholastic(idx, 'sea1', e.target.value)}
                        className="w-10 text-center bg-amber-50/70 border border-amber-300 rounded py-0.5 text-xs font-semibold focus:bg-white focus:border-maroon focus:outline-none"
                      />
                    ) : (
                      sub.sea1
                    )}
                  </td>
                  <td className="border border-gray-300 p-1 print:p-1.5 font-semibold bg-gray-50">{testTot1}</td>
                  <td className="border border-gray-300 p-1 print:p-1.5">
                    {isDirectEdit ? (
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={sub.hy1 ?? ''}
                        onChange={(e) => handleScholastic(idx, 'hy1', e.target.value)}
                        className="w-12 text-center bg-amber-50/70 border border-amber-300 rounded py-0.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-maroon focus:outline-none"
                      />
                    ) : (
                      sub.hy1
                    )}
                  </td>
                  <td className="border border-gray-300 p-1 print:p-1.5 font-bold text-maroon bg-maroon/5">{tot1}</td>

                  {/* Term 2 */}
                  <td className="border border-gray-300 p-1 print:p-1.5">
                    {isDirectEdit ? (
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={sub.per2 ?? ''}
                        onChange={(e) => handleScholastic(idx, 'per2', e.target.value)}
                        className="w-10 text-center bg-amber-50/70 border border-amber-300 rounded py-0.5 text-xs font-semibold focus:bg-white focus:border-maroon focus:outline-none"
                      />
                    ) : (
                      sub.per2 ?? '-'
                    )}
                  </td>
                  <td className="border border-gray-300 p-1 print:p-1.5">
                    {isDirectEdit ? (
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={sub.nb2 ?? ''}
                        onChange={(e) => handleScholastic(idx, 'nb2', e.target.value)}
                        className="w-10 text-center bg-amber-50/70 border border-amber-300 rounded py-0.5 text-xs font-semibold focus:bg-white focus:border-maroon focus:outline-none"
                      />
                    ) : (
                      sub.nb2 ?? '-'
                    )}
                  </td>
                  <td className="border border-gray-300 p-1 print:p-1.5">
                    {isDirectEdit ? (
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={sub.sea2 ?? ''}
                        onChange={(e) => handleScholastic(idx, 'sea2', e.target.value)}
                        className="w-10 text-center bg-amber-50/70 border border-amber-300 rounded py-0.5 text-xs font-semibold focus:bg-white focus:border-maroon focus:outline-none"
                      />
                    ) : (
                      sub.sea2 ?? '-'
                    )}
                  </td>
                  <td className="border border-gray-300 p-1 print:p-1.5 font-semibold bg-gray-50">{sub.yr2 !== undefined ? testTot2 : '-'}</td>
                  <td className="border border-gray-300 p-1 print:p-1.5">
                    {isDirectEdit ? (
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={sub.yr2 ?? ''}
                        onChange={(e) => handleScholastic(idx, 'yr2', e.target.value)}
                        className="w-12 text-center bg-amber-50/70 border border-amber-300 rounded py-0.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-maroon focus:outline-none"
                      />
                    ) : (
                      sub.yr2 ?? '-'
                    )}
                  </td>
                  <td className="border border-gray-300 p-1 print:p-1.5 font-bold text-maroon bg-maroon/5">{tot2 || '-'}</td>

                  {/* Overall */}
                  <td className="border border-gray-300 p-1 print:p-1.5 font-extrabold text-maroon bg-gold/10">{grand.toFixed(2)}</td>
                  <td className="border border-gray-300 p-1 print:p-1.5 font-extrabold text-emerald-700 bg-gold/10">{grade}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. CO-SCHOLASTIC & ATTENDANCE & SUMMARY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-2.5 print:mb-2.5 print:gap-2.5">
        
        {/* Co-Scholastic Table */}
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <div className="bg-maroon text-white px-2 py-1 font-bold text-[10px] print:text-[9.5px] uppercase tracking-wider">
            2. CO-SCHOLASTIC ACTIVITIES
          </div>
          <table className="w-full text-[10px] print:text-[9.5px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-[9px] print:text-[8.5px] text-gray-600 uppercase font-bold border-b border-gray-300">
                <th className="p-1.5 print:p-1 border-r border-gray-300">Activity</th>
                <th className="p-1.5 print:p-1 text-center border-r border-gray-300">Half Yr</th>
                <th className="p-1.5 print:p-1 text-center">Annual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-bold text-gray-800">
              {student.coScholastic && student.coScholastic.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-1.5 print:p-1 border-r border-gray-300 text-gray-900">{item.activity}</td>
                  <td className="p-1.5 print:p-1 text-center border-r border-gray-300">
                    {isDirectEdit ? (
                      <select
                        value={item.hyGrade || 'A'}
                        onChange={(e) => handleCoScholastic(idx, 'hyGrade', e.target.value)}
                        className="bg-amber-50 border border-amber-300 rounded px-1 py-0.5 text-xs font-bold text-emerald-700 text-center focus:outline-none"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                      </select>
                    ) : (
                      <span className="text-emerald-700">{item.hyGrade}</span>
                    )}
                  </td>
                  <td className="p-1.5 print:p-1 text-center">
                    {isDirectEdit ? (
                      <select
                        value={item.annualGrade || 'A'}
                        onChange={(e) => handleCoScholastic(idx, 'annualGrade', e.target.value)}
                        className="bg-amber-50 border border-amber-300 rounded px-1 py-0.5 text-xs font-bold text-emerald-700 text-center focus:outline-none"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                      </select>
                    ) : (
                      <span className="text-emerald-700">{item.annualGrade}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Attendance Summary */}
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <div className="bg-maroon text-white px-2 py-1 font-bold text-[10px] print:text-[9.5px] uppercase tracking-wider">
            3. ATTENDANCE RECORD
          </div>
          <table className="w-full text-[10px] print:text-[9.5px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-[9px] print:text-[8.5px] text-gray-600 uppercase font-bold border-b border-gray-300">
                <th className="p-1.5 print:p-1 border-r border-gray-300">Term</th>
                <th className="p-1.5 print:p-1 text-center border-r border-gray-300">Present / Total</th>
                <th className="p-1.5 print:p-1 text-center">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-[10px] print:text-[9.5px] text-gray-800 font-medium">
              <tr>
                <td className="p-1.5 print:p-1 border-r border-gray-300">Term 1</td>
                <td className="p-1.5 print:p-1 text-center border-r border-gray-300">
                  {isDirectEdit ? (
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        min="0"
                        value={student.attendance?.t1Present ?? ''}
                        onChange={(e) => handleAttendance('t1Present', e.target.value)}
                        className="w-10 text-center bg-amber-50 border border-amber-300 rounded py-0.5 text-xs font-bold"
                      />
                      <span>/</span>
                      <input
                        type="number"
                        min="1"
                        value={student.attendance?.t1Total ?? ''}
                        onChange={(e) => handleAttendance('t1Total', e.target.value)}
                        className="w-10 text-center bg-amber-50 border border-amber-300 rounded py-0.5 text-xs font-bold"
                      />
                    </div>
                  ) : (
                    `${student.attendance?.t1Present || 0} / ${student.attendance?.t1Total || 60}`
                  )}
                </td>
                <td className="p-1.5 print:p-1 text-center font-bold text-maroon">
                  {Math.round(((student.attendance?.t1Present || 0) / (student.attendance?.t1Total || 60)) * 100)}%
                </td>
              </tr>
              <tr>
                <td className="p-1.5 print:p-1 border-r border-gray-300">Half Yearly</td>
                <td className="p-1.5 print:p-1 text-center border-r border-gray-300">
                  {isDirectEdit ? (
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        min="0"
                        value={student.attendance?.hyPresent ?? ''}
                        onChange={(e) => handleAttendance('hyPresent', e.target.value)}
                        className="w-10 text-center bg-amber-50 border border-amber-300 rounded py-0.5 text-xs font-bold"
                      />
                      <span>/</span>
                      <input
                        type="number"
                        min="1"
                        value={student.attendance?.hyTotal ?? ''}
                        onChange={(e) => handleAttendance('hyTotal', e.target.value)}
                        className="w-10 text-center bg-amber-50 border border-amber-300 rounded py-0.5 text-xs font-bold"
                      />
                    </div>
                  ) : (
                    `${student.attendance?.hyPresent || 0} / ${student.attendance?.hyTotal || 60}`
                  )}
                </td>
                <td className="p-1.5 print:p-1 text-center font-bold text-maroon">
                  {Math.round(((student.attendance?.hyPresent || 0) / (student.attendance?.hyTotal || 60)) * 100)}%
                </td>
              </tr>
              <tr>
                <td className="p-1.5 print:p-1 border-r border-gray-300">Term 2</td>
                <td className="p-1.5 print:p-1 text-center border-r border-gray-300">
                  {isDirectEdit ? (
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        min="0"
                        value={student.attendance?.t2Present ?? ''}
                        onChange={(e) => handleAttendance('t2Present', e.target.value)}
                        className="w-10 text-center bg-amber-50 border border-amber-300 rounded py-0.5 text-xs font-bold"
                      />
                      <span>/</span>
                      <input
                        type="number"
                        min="1"
                        value={student.attendance?.t2Total ?? ''}
                        onChange={(e) => handleAttendance('t2Total', e.target.value)}
                        className="w-10 text-center bg-amber-50 border border-amber-300 rounded py-0.5 text-xs font-bold"
                      />
                    </div>
                  ) : (
                    `${student.attendance?.t2Present || 0} / ${student.attendance?.t2Total || 60}`
                  )}
                </td>
                <td className="p-1.5 print:p-1 text-center font-bold text-maroon">
                  {Math.round(((student.attendance?.t2Present || 0) / (student.attendance?.t2Total || 60)) * 100)}%
                </td>
              </tr>
              <tr>
                <td className="p-1.5 print:p-1 border-r border-gray-300">Annual</td>
                <td className="p-1.5 print:p-1 text-center border-r border-gray-300">
                  {isDirectEdit ? (
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        min="0"
                        value={student.attendance?.annualPresent ?? ''}
                        onChange={(e) => handleAttendance('annualPresent', e.target.value)}
                        className="w-10 text-center bg-amber-50 border border-amber-300 rounded py-0.5 text-xs font-bold"
                      />
                      <span>/</span>
                      <input
                        type="number"
                        min="1"
                        value={student.attendance?.annualTotal ?? ''}
                        onChange={(e) => handleAttendance('annualTotal', e.target.value)}
                        className="w-10 text-center bg-amber-50 border border-amber-300 rounded py-0.5 text-xs font-bold"
                      />
                    </div>
                  ) : (
                    `${student.attendance?.annualPresent || 0} / ${student.attendance?.annualTotal || 60}`
                  )}
                </td>
                <td className="p-1.5 print:p-1 text-center font-bold text-maroon">
                  {Math.round(((student.attendance?.annualPresent || 0) / (student.attendance?.annualTotal || 60)) * 100)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Overall Summary Box */}
        <div className="border border-gray-300 rounded-lg bg-white p-2.5 print:p-2 flex flex-col justify-between text-[10px] print:text-[9.5px]">
          <div>
            <h4 className="font-heading font-bold text-[10px] print:text-[9.5px] uppercase text-maroon mb-1 border-b border-gray-200 pb-0.5">
              4. RESULT SUMMARY
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-600 font-semibold">Grand Total Marks:</span>
                <span className="font-extrabold text-maroon">{totalGrand.toFixed(2)} / {maxPossible}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-600 font-semibold">Overall Percentage:</span>
                <span className="font-extrabold text-maroon">{percentage}%</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-600 font-semibold">Overall Grade:</span>
                <span className="font-extrabold text-emerald-700">{overallGrade}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-0.5">
                <span className="text-gray-600 font-semibold">Attendance Pct:</span>
                <span className="font-bold text-gray-800">{attendancePct}%</span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span className="text-gray-600 font-semibold">Final Result:</span>
                {isDirectEdit ? (
                  <select
                    value={student.resultStatus || 'Promote'}
                    onChange={(e) => handleField('resultStatus', e.target.value)}
                    className="bg-amber-50 border border-amber-300 rounded px-1.5 py-0.5 font-bold text-[10px] text-gray-900 focus:outline-none"
                  >
                    <option value="Promote">PROMOTED TO NEXT CLASS</option>
                    <option value="Compartment">COMPARTMENT</option>
                    <option value="Essential Repeat">ESSENTIAL REPEAT</option>
                  </select>
                ) : (
                  <span className={`px-1.5 py-0.5 rounded font-extrabold text-[9.5px] print:text-[9px] ${
                    student.resultStatus === 'Promote' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {student.resultStatus === 'Promote' ? 'PROMOTED TO NEXT CLASS' : (student.resultStatus || 'TERM PENDING')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 5. REMARKS & SIGNATURES */}
      <div className="border-t border-gray-300 pt-2 print:pt-1.5 mt-2 print:mt-1.5">
        <div className="mb-2 print:mb-1.5 p-2 print:p-1.5 bg-white border border-gray-300 rounded-lg text-[10px] print:text-[9.5px]">
          <span className="font-bold text-maroon uppercase">Teacher's Remarks: </span>
          {isDirectEdit ? (
            <input
              type="text"
              value={student.remarks || ''}
              onChange={(e) => handleField('remarks', e.target.value)}
              placeholder="Type student remarks here..."
              className="w-full mt-1 bg-amber-50/80 border border-amber-400 rounded px-2 py-1 text-xs text-gray-900 font-medium italic focus:bg-white focus:border-maroon focus:outline-none"
            />
          ) : (
            <span className="text-gray-800 italic">{student.remarks || 'Diligent student with polite behavior and consistent academic focus.'}</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-[10px] print:text-[9px] text-gray-700 font-bold pt-2 print:pt-1.5">
          <div>
            <div className="w-28 sm:w-32 h-px bg-gray-400 mx-auto mb-1"></div>
            <span>Class Teacher Signature</span>
          </div>
          <div>
            <div className="w-28 sm:w-32 h-px bg-gray-400 mx-auto mb-1"></div>
            <span>Principal Signature ({school?.principalName || 'Dr. Rajan Kumar'})</span>
          </div>
          <div className="text-right italic text-gray-500 font-normal text-[9px] print:text-[8.5px]">
            <span>Official e-Report Card</span>
            <br />
            <span>Stitch Academia Portal</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReportCard;
