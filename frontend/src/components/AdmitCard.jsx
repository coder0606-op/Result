import React from 'react';
import { Calendar, MapPin, ShieldCheck, Image as ImageIcon } from 'lucide-react';

const AdmitCard = ({ data, isEditing, onDataChange }) => {
  if (!data) return null;

  const handleChange = (field, value) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value });
    }
  };

  const handleStudentChange = (field, value) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        student: { ...data.student, [field]: value }
      });
    }
  };

  const handleSchoolChange = (field, value) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        school: { ...data.school, [field]: value }
      });
    }
  };

  const handleScheduleChange = (index, field, value) => {
    if (onDataChange) {
      const updatedSchedule = [...data.examSchedule];
      updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
      onDataChange({ ...data, examSchedule: updatedSchedule });
    }
  };

  const handleInstructionChange = (index, value) => {
    if (onDataChange) {
      const updatedInstructions = [...data.instructions];
      updatedInstructions[index] = value;
      onDataChange({ ...data, instructions: updatedInstructions });
    }
  };

  const handleAddSubjectRow = () => {
    if (onDataChange) {
      const updatedSchedule = [
        ...(data.examSchedule || []),
        {
          date: '16/03/2025',
          day: 'Sunday',
          subject: 'EXTRA SUBJECT',
          time: '09:00 AM - 12:00 PM',
          roomNo: 'Hall-01'
        }
      ];
      onDataChange({ ...data, examSchedule: updatedSchedule });
    }
  };

  const handleRemoveSubjectRow = (index) => {
    if (onDataChange) {
      const updatedSchedule = data.examSchedule.filter((_, idx) => idx !== index);
      onDataChange({ ...data, examSchedule: updatedSchedule });
    }
  };

  return (
    <div className="report-card-printable max-w-4xl mx-auto bg-white border-2 border-maroon p-4 sm:p-5 rounded-xl shadow-xl text-gray-900 font-body relative overflow-hidden my-3">
      
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <img
          src={data.school?.schoolLogo || '/mahaviri_shishu_vidya_mandir_logo/screen.png'}
          alt="Watermark"
          className="w-80 h-80 object-contain"
        />
      </div>

      {/* Outer Border Frame */}
      <div className="border border-gold-dark/40 p-3 sm:p-4 rounded-lg relative z-10">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b-2 border-maroon pb-2.5 mb-2.5 gap-2">
          
          {/* Left School Logo */}
          <div className="shrink-0 text-center">
            {isEditing ? (
              <div className="space-y-1">
                <img
                  src={data.school?.schoolLogo || '/mahaviri_shishu_vidya_mandir_logo/screen.png'}
                  alt="School Logo"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain mx-auto border border-gray-200 rounded p-0.5"
                />
                <input
                  type="text"
                  value={data.school?.schoolLogo || ''}
                  onChange={(e) => handleSchoolChange('schoolLogo', e.target.value)}
                  placeholder="Logo URL"
                  className="no-print text-[9px] w-20 p-0.5 border rounded bg-gray-50 focus:bg-white"
                  title="Change Logo URL"
                />
              </div>
            ) : (
              <img
                src={data.school?.schoolLogo || '/mahaviri_shishu_vidya_mandir_logo/screen.png'}
                alt="School Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
              />
            )}
          </div>

          {/* Center School Details */}
          <div className="text-center flex-1 px-2">
            {isEditing ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={data.school?.schoolName || ''}
                  onChange={(e) => handleSchoolChange('schoolName', e.target.value)}
                  className="w-full text-center font-heading font-black text-base sm:text-xl text-maroon uppercase border-b border-maroon/30 focus:border-maroon px-1 bg-yellow-50/50"
                  placeholder="SCHOOL NAME"
                />
                <input
                  type="text"
                  value={data.school?.affiliationNumber || ''}
                  onChange={(e) => handleSchoolChange('affiliationNumber', e.target.value)}
                  className="w-full text-center text-[11px] font-bold text-gray-700 border-b border-gray-200 px-1 bg-yellow-50/50"
                  placeholder="AFFILIATION / REGISTRATION NO."
                />
                <input
                  type="text"
                  value={data.school?.address || ''}
                  onChange={(e) => handleSchoolChange('address', e.target.value)}
                  className="w-full text-center text-[10px] text-gray-600 border-b border-gray-200 px-1 bg-yellow-50/50"
                  placeholder="SCHOOL ADDRESS"
                />
              </div>
            ) : (
              <>
                <h1 className="font-heading font-black text-base sm:text-xl text-maroon uppercase tracking-wide leading-tight">
                  {data.school?.schoolName || 'MAHAVIRI SHISHU VIDYA MANDIR'}
                </h1>
                <p className="text-[10px] sm:text-[11px] font-bold text-gray-700 tracking-tight">
                  {data.school?.affiliationNumber ? `Affiliation: ${data.school.affiliationNumber}` : 'RTE Regd. Educational Institution'}
                </p>
                <p className="text-[9.5px] sm:text-[10px] text-gray-600 font-medium">
                  {data.school?.address || 'Siwan, Bihar'} | Ph: {data.school?.contactNumber || '+91 98765 43210'}
                </p>
              </>
            )}
          </div>

          {/* Right Secondary Logo / QR Badge */}
          <div className="shrink-0 text-center flex flex-col items-center justify-center">
            {isEditing ? (
              <div className="space-y-1">
                <img
                  src={data.school?.secondLogo || '/academic_excellence_logo/screen.png'}
                  alt="Secondary Badge"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain mx-auto border border-gray-200 rounded p-0.5"
                />
                <input
                  type="text"
                  value={data.school?.secondLogo || ''}
                  onChange={(e) => handleSchoolChange('secondLogo', e.target.value)}
                  placeholder="2nd Logo URL"
                  className="no-print text-[9px] w-20 p-0.5 border rounded bg-gray-50 focus:bg-white"
                />
              </div>
            ) : (
              <img
                src={data.school?.secondLogo || '/academic_excellence_logo/screen.png'}
                alt="Secondary Badge"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
            )}
          </div>
        </div>

        {/* Title Banner */}
        <div className="bg-gradient-to-r from-maroon via-maroon-dark to-maroon text-white text-center py-1 px-3 rounded my-1.5 shadow-2xs flex flex-row items-center justify-between gap-1 border border-gold">
          <span className="text-[9.5px] sm:text-[10.5px] font-extrabold uppercase tracking-widest text-gold-light">
            {isEditing ? (
              <input
                type="text"
                value={data.academicSession || ''}
                onChange={(e) => handleChange('academicSession', e.target.value)}
                className="bg-maroon-dark text-white px-1.5 py-0.5 rounded text-center border border-gold/40 text-[10px]"
                placeholder="SESSION: 2024-25"
              />
            ) : (
              `SESSION: ${data.academicSession || '2024-2025'}`
            )}
          </span>
          <h2 className="font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-white">
            {isEditing ? (
              <input
                type="text"
                value={data.examTitle || ''}
                onChange={(e) => handleChange('examTitle', e.target.value)}
                className="bg-maroon-dark text-white font-black px-1.5 py-0.5 rounded text-center border border-gold text-xs uppercase w-56 sm:w-72"
                placeholder="ANNUAL EXAMINATION HALL TICKET"
              />
            ) : (
              data.examTitle || 'EXAMINATION ADMIT CARD / HALL TICKET'
            )}
          </h2>
          <span className="text-[9.5px] sm:text-[10.5px] font-extrabold uppercase tracking-widest text-gold-light">
            OFFICIAL COPY
          </span>
        </div>

        {/* Student Information Grid & Right-Side Student Photo Box */}
        <div className="flex flex-row items-stretch justify-between gap-3 my-2 p-2.5 bg-gray-50/90 rounded-lg border border-gray-200">
          
          {/* Left Details Column */}
          <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] leading-tight">
            
            {/* Student Name */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-0.5 col-span-2 sm:col-span-1">
              <span className="font-extrabold text-gray-700 min-w-[95px] shrink-0">Student Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={data.student?.studentName || ''}
                  onChange={(e) => handleStudentChange('studentName', e.target.value)}
                  className="font-black text-maroon uppercase w-full bg-yellow-50 px-1 border border-amber-300 rounded text-[11px]"
                />
              ) : (
                <span className="font-black text-maroon uppercase truncate text-[11.5px]">{data.student?.studentName || 'N/A'}</span>
              )}
            </div>

            {/* Roll Number */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-0.5">
              <span className="font-extrabold text-gray-700 min-w-[95px] shrink-0">Roll Number:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={data.student?.rollNumber || ''}
                  onChange={(e) => handleStudentChange('rollNumber', e.target.value)}
                  className="font-bold text-gray-900 w-full bg-yellow-50 px-1 border border-amber-300 rounded text-[11px]"
                />
              ) : (
                <span className="font-bold text-gray-900">{data.student?.rollNumber || 'N/A'}</span>
              )}
            </div>

            {/* Father's Name */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-0.5">
              <span className="font-extrabold text-gray-700 min-w-[95px] shrink-0">Father's Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={data.student?.fatherName || ''}
                  onChange={(e) => handleStudentChange('fatherName', e.target.value)}
                  className="font-bold text-gray-900 uppercase w-full bg-yellow-50 px-1 border border-amber-300 rounded text-[11px]"
                />
              ) : (
                <span className="font-bold text-gray-900 uppercase truncate">{data.student?.fatherName || 'N/A'}</span>
              )}
            </div>

            {/* Mother's Name */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-0.5">
              <span className="font-extrabold text-gray-700 min-w-[95px] shrink-0">Mother's Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={data.student?.motherName || ''}
                  onChange={(e) => handleStudentChange('motherName', e.target.value)}
                  className="font-bold text-gray-900 uppercase w-full bg-yellow-50 px-1 border border-amber-300 rounded text-[11px]"
                />
              ) : (
                <span className="font-bold text-gray-900 uppercase truncate">{data.student?.motherName || 'N/A'}</span>
              )}
            </div>

            {/* Class & Section */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-0.5">
              <span className="font-extrabold text-gray-700 min-w-[95px] shrink-0">Class & Sec:</span>
              {isEditing ? (
                <div className="flex gap-1 w-full">
                  <input
                    type="text"
                    value={data.student?.className || ''}
                    onChange={(e) => handleStudentChange('className', e.target.value)}
                    placeholder="Class"
                    className="font-bold text-gray-900 w-1/2 bg-yellow-50 px-1 border border-amber-300 rounded text-[11px]"
                  />
                  <input
                    type="text"
                    value={data.student?.section || ''}
                    onChange={(e) => handleStudentChange('section', e.target.value)}
                    placeholder="Sec"
                    className="font-bold text-gray-900 w-1/2 bg-yellow-50 px-1 border border-amber-300 rounded text-[11px]"
                  />
                </div>
              ) : (
                <span className="font-bold text-gray-900">
                  Class {data.student?.className || 'N/A'} - {data.student?.section || 'A'}
                </span>
              )}
            </div>

            {/* Registration No */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-0.5">
              <span className="font-extrabold text-gray-700 min-w-[95px] shrink-0">Reg. Number:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={data.student?.enrollmentNumber || ''}
                  onChange={(e) => handleStudentChange('enrollmentNumber', e.target.value)}
                  className="font-bold text-gray-900 w-full bg-yellow-50 px-1 border border-amber-300 rounded text-[11px]"
                />
              ) : (
                <span className="font-bold text-gray-900">{data.student?.enrollmentNumber || 'N/A'}</span>
              )}
            </div>

            {/* Date of Birth */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-0.5">
              <span className="font-extrabold text-gray-700 min-w-[95px] shrink-0">Date of Birth:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={data.student?.dob || ''}
                  onChange={(e) => handleStudentChange('dob', e.target.value)}
                  className="font-bold text-gray-900 w-full bg-yellow-50 px-1 border border-amber-300 rounded text-[11px]"
                />
              ) : (
                <span className="font-bold text-gray-900">{data.student?.dob || 'N/A'}</span>
              )}
            </div>

            {/* Gender */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-0.5">
              <span className="font-extrabold text-gray-700 min-w-[95px] shrink-0">Category:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={data.student?.gender || 'Regular'}
                  onChange={(e) => handleStudentChange('gender', e.target.value)}
                  className="font-bold text-gray-900 w-full bg-yellow-50 px-1 border border-amber-300 rounded text-[11px]"
                />
              ) : (
                <span className="font-bold text-gray-900">{data.student?.gender || 'Regular'}</span>
              )}
            </div>

            {/* Exam Center Name */}
            <div className="flex items-center gap-1 border-b border-gray-200 pb-0.5 col-span-2">
              <span className="font-extrabold text-gray-700 min-w-[95px] shrink-0 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-maroon" />
                <span>Exam Center:</span>
              </span>
              {isEditing ? (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={data.examCenter || ''}
                    onChange={(e) => handleChange('examCenter', e.target.value)}
                    className="font-bold text-gray-900 w-3/4 bg-yellow-50 px-1 border border-amber-300 rounded text-[11px]"
                    placeholder="Exam Center Name"
                  />
                  <input
                    type="text"
                    value={data.centerCode || ''}
                    onChange={(e) => handleChange('centerCode', e.target.value)}
                    className="font-bold text-gray-900 w-1/4 bg-yellow-50 px-1 border border-amber-300 rounded text-[11px]"
                    placeholder="Code"
                  />
                </div>
              ) : (
                <span className="font-bold text-maroon truncate">
                  {data.examCenter || 'Main School Campus'} {data.centerCode ? `(${data.centerCode})` : ''}
                </span>
              )}
            </div>

          </div>

          {/* Right Side: Photo Box & Barcode Column */}
          <div className="w-28 sm:w-32 flex flex-col items-center justify-center p-1.5 bg-white rounded border border-gray-300 text-center shrink-0 self-center">
            {data.student?.studentPhoto ? (
              <img
                src={data.student.studentPhoto}
                alt="Student Passport Photo"
                className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded border border-gray-400 shadow-2xs"
              />
            ) : (
              <div className="w-20 h-24 sm:w-24 sm:h-28 bg-gray-100 border border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 p-1">
                <ImageIcon className="w-6 h-6 mb-0.5 text-gray-400" />
                <span className="text-[8px] font-bold text-center">PASSPORT PHOTO</span>
              </div>
            )}
            
            {isEditing && (
              <input
                type="text"
                value={data.student?.studentPhoto || ''}
                onChange={(e) => handleStudentChange('studentPhoto', e.target.value)}
                placeholder="Photo URL"
                className="no-print text-[8px] w-full p-0.5 border rounded bg-gray-50 mt-1"
              />
            )}

            <div className="mt-1.5 text-center">
              <div className="font-mono text-[8px] font-bold tracking-widest text-gray-800 bg-gray-100 px-1 py-0.5 rounded border border-gray-200">
                ||||| | |||| || |||||
              </div>
              <span className="text-[8px] font-mono text-gray-600 block mt-0.5 truncate">
                {data.student?.enrollmentNumber || 'ENR-992024'}
              </span>
            </div>
          </div>

        </div>

        {/* Examination Schedule / Timetable Table */}
        <div className="my-2">
          <div className="flex items-center justify-between border-b-2 border-maroon pb-0.5 mb-1">
            <h3 className="text-[11px] font-black text-maroon uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Examination Schedule & Subject Timetable</span>
            </h3>
            {isEditing && (
              <button
                type="button"
                onClick={handleAddSubjectRow}
                className="no-print px-2 py-0.5 bg-maroon text-white font-extrabold text-[9.5px] rounded hover:bg-maroon-dark transition-all"
              >
                + Add Extra Subject
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-300 text-[10.5px]">
              <thead>
                <tr className="bg-maroon text-white text-[10px] font-extrabold uppercase">
                  <th className="p-1.5 border border-gray-300 text-center w-8">S.N.</th>
                  <th className="p-1.5 border border-gray-300 w-24">Date</th>
                  <th className="p-1.5 border border-gray-300 w-20">Day</th>
                  <th className="p-1.5 border border-gray-300">Subject Name</th>
                  <th className="p-1.5 border border-gray-300 w-32">Time Slot</th>
                  <th className="p-1.5 border border-gray-300 w-20 text-center">Room No</th>
                  <th className="p-1.5 border border-gray-300 text-center w-24">Invigilator</th>
                  {isEditing && <th className="no-print p-1.5 border border-gray-300 text-center w-8">Action</th>}
                </tr>
              </thead>
              <tbody>
                {data.examSchedule && data.examSchedule.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                    <td className="p-1 border border-gray-300 text-center font-bold text-gray-700">
                      {idx + 1}
                    </td>
                    
                    {/* Date */}
                    <td className="p-1 border border-gray-300 font-semibold text-gray-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.date || ''}
                          onChange={(e) => handleScheduleChange(idx, 'date', e.target.value)}
                          className="w-full bg-yellow-50 px-1 border border-amber-300 rounded text-[10px]"
                        />
                      ) : (
                        item.date
                      )}
                    </td>

                    {/* Day */}
                    <td className="p-1 border border-gray-300 font-medium text-gray-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.day || ''}
                          onChange={(e) => handleScheduleChange(idx, 'day', e.target.value)}
                          className="w-full bg-yellow-50 px-1 border border-amber-300 rounded text-[10px]"
                        />
                      ) : (
                        item.day
                      )}
                    </td>

                    {/* Subject Name */}
                    <td className="p-1 border border-gray-300 font-bold text-maroon uppercase">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.subject || ''}
                          onChange={(e) => handleScheduleChange(idx, 'subject', e.target.value)}
                          className="w-full bg-yellow-50 px-1 border border-amber-300 rounded text-[10px] uppercase font-bold"
                        />
                      ) : (
                        item.subject
                      )}
                    </td>

                    {/* Time Slot */}
                    <td className="p-1 border border-gray-300 text-gray-800 font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.time || ''}
                          onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)}
                          className="w-full bg-yellow-50 px-1 border border-amber-300 rounded text-[10px]"
                        />
                      ) : (
                        item.time
                      )}
                    </td>

                    {/* Room No */}
                    <td className="p-1 border border-gray-300 text-center font-bold text-gray-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.roomNo || ''}
                          onChange={(e) => handleScheduleChange(idx, 'roomNo', e.target.value)}
                          className="w-full text-center bg-yellow-50 px-1 border border-amber-300 rounded text-[10px] font-bold"
                        />
                      ) : (
                        item.roomNo || 'Hall-01'
                      )}
                    </td>

                    {/* Invigilator Sign Box */}
                    <td className="p-1 border border-gray-300 text-center">
                      <div className="h-5 border border-dashed border-gray-300 rounded bg-gray-50/50"></div>
                    </td>

                    {/* Delete Subject Row Action */}
                    {isEditing && (
                      <td className="no-print p-1 border border-gray-300 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSubjectRow(idx)}
                          className="text-red-600 hover:text-red-800 font-bold text-[11px]"
                          title="Remove Subject"
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidate Rules & Instructions */}
        <div className="my-2 p-2 bg-amber-50/40 rounded border border-amber-200">
          <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-wide mb-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-700" />
            <span>Important Instructions for Candidates</span>
          </h4>
          <ol className="list-decimal list-inside space-y-0.5 text-[9.5px] text-gray-800 font-medium">
            {data.instructions && data.instructions.map((inst, idx) => (
              <li key={idx} className="leading-tight">
                {isEditing ? (
                  <input
                    type="text"
                    value={inst}
                    onChange={(e) => handleInstructionChange(idx, e.target.value)}
                    className="w-11/12 bg-white px-1 border border-amber-300 rounded text-[9.5px] my-0.5 inline-block"
                  />
                ) : (
                  <span>{inst}</span>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Signatures & Seal Section */}
        <div className="mt-4 pt-2 border-t border-gray-300 grid grid-cols-3 gap-3 text-center text-xs">
          
          {/* Candidate Signature */}
          <div className="flex flex-col items-center justify-end">
            <div className="h-7 w-28 border-b border-dashed border-gray-400 mb-0.5 flex items-end justify-center pb-0.5">
              <span className="text-[9px] italic text-gray-400">(Candidate Sign)</span>
            </div>
            <p className="font-extrabold text-gray-800 text-[10px]">Candidate Signature</p>
          </div>

          {/* Invigilator Signature */}
          <div className="flex flex-col items-center justify-end">
            <div className="h-7 w-28 border-b border-dashed border-gray-400 mb-0.5 flex items-end justify-center pb-0.5">
              <span className="text-[9px] italic text-gray-400">(Invigilator Sign)</span>
            </div>
            <p className="font-extrabold text-gray-800 text-[10px]">Room Invigilator</p>
          </div>

          {/* Controller of Exam / Principal Signature */}
          <div className="flex flex-col items-center justify-end">
            <div className="h-7 w-32 border-b-2 border-maroon mb-0.5 flex items-center justify-center relative">
              <span className="font-serif italic font-bold text-maroon text-xs tracking-wider">
                {data.school?.principalName || 'Dr. Rajan Kumar'}
              </span>
              <div className="absolute right-0 bottom-0 text-[8px] font-mono text-gold-dark border border-gold px-0.5 rounded bg-amber-50">
                SEAL
              </div>
            </div>
            <p className="font-black text-maroon text-[10px] uppercase">
              {isEditing ? (
                <input
                  type="text"
                  value={data.principalTitle || 'Controller of Examinations / Principal'}
                  onChange={(e) => handleChange('principalTitle', e.target.value)}
                  className="bg-yellow-50 text-center border border-amber-300 rounded px-1 w-full text-[9px]"
                />
              ) : (
                data.principalTitle || 'Controller of Examinations / Principal'
              )}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdmitCard;
