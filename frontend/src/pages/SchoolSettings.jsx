import React, { useState, useEffect } from 'react';
import { schoolService } from '../services/schoolService';
import { Save, School, CheckCircle2, Sparkles, Building, Phone, Mail, UserCheck } from 'lucide-react';

const SchoolSettings = () => {
  const [settings, setSettings] = useState({
    schoolName: '',
    schoolLogo: '',
    affiliationNumber: '',
    address: '',
    contactNumber: '',
    email: '',
    principalName: '',
    academicSession: ''
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await schoolService.getSchoolSettings();
    setSettings(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await schoolService.updateSchoolSettings(settings);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      console.error('Failed to update settings', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-body pb-10">
      
      {toast && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Institutional Settings Updated Successfully!</span>
        </div>
      )}

      <div>
        <h1 className="font-heading text-2xl font-extrabold text-gray-900">School Profile & Branding</h1>
        <p className="text-xs text-gray-500">Configure report card header information, official crests, and signatures</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          <div className="flex items-center gap-4 p-4 bg-maroon/5 border border-maroon/20 rounded-xl">
            <img
              src={settings.schoolLogo || '/mahaviri_shishu_vidya_mandir_logo/screen.png'}
              alt="Crest Preview"
              className="w-16 h-16 object-contain rounded bg-white p-1 border border-maroon/30 shadow-xs"
            />
            <div>
              <h3 className="font-heading font-extrabold text-lg text-maroon">{settings.schoolName || 'School Name'}</h3>
              <p className="text-xs text-gray-600">{settings.address || 'Address'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">School Name *</label>
              <input
                type="text"
                required
                value={settings.schoolName}
                onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">School Logo URL</label>
              <input
                type="text"
                value={settings.schoolLogo}
                onChange={(e) => setSettings({ ...settings, schoolLogo: e.target.value })}
                placeholder="/mahaviri_shishu_vidya_mandir_logo/screen.png"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Affiliation / Code</label>
              <input
                type="text"
                value={settings.affiliationNumber}
                onChange={(e) => setSettings({ ...settings, affiliationNumber: e.target.value })}
                placeholder="RTE/SWN/0052 (G.F.E.R.T PATNA)"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Academic Session</label>
              <input
                type="text"
                value={settings.academicSession}
                onChange={(e) => setSettings({ ...settings, academicSession: e.target.value })}
                placeholder="2024-25"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Principal Name</label>
              <input
                type="text"
                value={settings.principalName}
                onChange={(e) => setSettings({ ...settings, principalName: e.target.value })}
                placeholder="Dr. Rajan Kumar"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contactNumber}
                onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Official Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="contact@mahavirishishu.edu.in"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">School Campus Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Ward No-01 Lakhraw Siwan (Bihar)"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-maroon text-white font-extrabold rounded-lg text-xs hover:bg-maroon-dark flex items-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default SchoolSettings;
