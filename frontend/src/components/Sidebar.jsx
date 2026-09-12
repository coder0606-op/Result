import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  BookOpen, 
  Settings, 
  FileText, 
  LogOut, 
  Sparkles,
  FilePlus,
  Ticket,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Admit Card', path: '/admit-card', icon: Ticket },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Create Report Card', path: '/create-report-card', icon: FilePlus },
    { name: 'Report Cards', path: '/report-cards', icon: FileText },
    { name: 'Update Data Page', path: '/update-report-card', icon: Sparkles },
    { name: 'Add Student', path: '/add-student', icon: UserPlus },
    { name: 'Subject Management', path: '/subjects', icon: BookOpen },
    { name: 'School Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden no-print"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside className={`no-print w-64 bg-sidebar text-gray-300 min-h-screen flex flex-col border-r border-sidebar-border shadow-xl fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-sidebar-border bg-sidebar/80 backdrop-blur-sm flex items-center justify-between">
          <Link to="/dashboard" onClick={handleNavClick} className="flex items-center gap-3">
            <img 
              src="/mahaviri_shishu_vidya_mandir_logo/screen.png" 
              alt="School Logo" 
              className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-maroon/30 shadow-sm"
            />
            <div>
              <h1 className="font-heading text-base sm:text-lg font-bold text-white leading-tight tracking-wide">
                Stitch Academia
              </h1>
              <p className="text-[10px] sm:text-[11px] text-gold-light font-medium tracking-tight flex items-center gap-1">
                <span>Report Card Portal</span>
              </p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-sidebar-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Profile Card */}
        <div className="mx-3 sm:mx-4 my-3 sm:my-4 p-3 rounded-lg bg-sidebar-hover/60 border border-sidebar-border/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-maroon text-white font-bold flex items-center justify-center text-xs shadow-inner shrink-0">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Faculty Administrator'}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.schoolName || 'Mahaviri Shishu Vidya Mandir'}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 space-y-1 py-2 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Main Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-maroon text-white shadow-md shadow-maroon/20 font-bold border-l-4 border-gold'
                    : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Session Badge & Logout */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar/50 text-xs">
          <div className="bg-maroon-dark/40 border border-maroon/40 rounded-lg p-2 mb-3 text-center">
            <p className="text-[10px] text-gold-light font-semibold uppercase">Academic Session</p>
            <p className="text-xs font-bold text-white">2024 - 2025</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-semibold flex items-center justify-center gap-2 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout System</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
