import React from 'react';
import { Search, Plus, Printer, ShieldCheck, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onSearch, onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="no-print bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs px-3 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left: Mobile Hamburger Menu & Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-maroon hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon transition-all"
          />
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Add Button */}
        <button
          onClick={() => navigate('/add-student')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-maroon text-white text-xs font-semibold rounded-lg hover:bg-maroon-dark transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Student</span>
        </button>

        {/* Quick Report Card */}
        <button
          onClick={() => navigate('/report-cards')}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gold/10 text-gold-dark border border-gold/30 text-xs font-semibold rounded-lg hover:bg-gold/20 transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Report Card</span>
        </button>

        {/* Admin Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Staff Admin</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
