import React, { useState, useEffect } from 'react';
import { UserPlus, Download, LogOut, Clock, ShieldCheck } from 'lucide-react';
import { getAvatarColor, getInitials } from '../utils/dateUtils';

export const Navbar = ({
  onOpenRegister,
  onExportCSV,
  user,
  onLogout,
}) => {
  const [currentTime, setCurrentTime] = useState('');

  // Live Clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Live Clock */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  Visitor<span className="text-indigo-600">Flow</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Desk
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Digital Reception Management System
              </p>
            </div>
          </div>

          {/* Live Date / Time Badge */}
          {currentTime && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{currentTime}</span>
            </div>
          )}
        </div>

        {/* User Info & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
          {user && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border ${getAvatarColor(
                  user.name
                )}`}
              >
                {getInitials(user.name)}
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-slate-800">{user.name}</p>
                <p className="text-[10px] text-slate-400">Receptionist</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExportCSV}
              title="Download CSV export"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              type="button"
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Register Visitor</span>
            </button>

            {user && (
              <button
                type="button"
                onClick={onLogout}
                title="Log out from reception session"
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
