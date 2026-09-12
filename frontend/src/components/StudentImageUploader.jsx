import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Trash2, CheckCircle2, User } from 'lucide-react';

const PRESET_AVATARS = [
  { name: 'Student Girl 1', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80' },
  { name: 'Student Girl 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
  { name: 'Student Boy 1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
  { name: 'Student Boy 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' }
];

const StudentImageUploader = ({ value, onChange, studentName }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="space-y-4 font-body text-xs">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        
        {/* Preview Frame */}
        <div className="relative shrink-0 group">
          {value ? (
            <div className="relative w-36 h-36 rounded-xl overflow-hidden border-2 border-maroon shadow-md bg-white">
              <img
                src={value}
                alt={studentName || 'Student Photo'}
                className="w-full h-full object-cover object-center"
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-1 right-1 p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-full transition-all shadow-sm"
                title="Remove Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="w-36 h-36 rounded-xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center gap-1.5 text-gray-400">
              <User className="w-8 h-8 text-gray-300" />
              <span className="text-[10px] font-semibold text-gray-500">No Photo</span>
            </div>
          )}
        </div>

        {/* Upload Controls & Selector Tabs */}
        <div className="flex-1 space-y-3 w-full">
          <div className="flex border-b border-gray-200 space-x-4">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`pb-1.5 font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'upload' ? 'border-b-2 border-maroon text-maroon' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image File</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`pb-1.5 font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'url' ? 'border-b-2 border-maroon text-maroon' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Paste Photo URL</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`pb-1.5 font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'presets' ? 'border-b-2 border-maroon text-maroon' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Preset Avatars</span>
            </button>
          </div>

          {/* Tab 1: Device Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-2">
              <label className="block p-3 border-2 border-dashed border-maroon/30 hover:border-maroon rounded-xl text-center bg-white cursor-pointer transition-all hover:bg-maroon/5">
                <Upload className="w-5 h-5 text-maroon mx-auto mb-1" />
                <span className="font-bold text-gray-800 block">Click to select photo from device</span>
                <span className="text-[10px] text-gray-500">Supports JPG, PNG, WEBP (Max 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Tab 2: URL Input */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/student-photo.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 p-2 bg-white border border-gray-300 rounded-lg focus:border-maroon focus:ring-1 focus:ring-maroon text-xs"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-maroon text-white font-bold rounded-lg hover:bg-maroon-dark transition-all"
              >
                Apply URL
              </button>
            </form>
          )}

          {/* Tab 3: Presets */}
          {activeTab === 'presets' && (
            <div className="flex flex-wrap gap-2">
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(avatar.url)}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                    value === avatar.url ? 'border-maroon bg-maroon/10 font-bold' : 'border-gray-200 hover:border-gray-400 bg-white'
                  }`}
                >
                  <img src={avatar.url} alt={avatar.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-[11px] text-gray-700 font-semibold">{avatar.name}</span>
                </button>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default StudentImageUploader;
